import { NextRequest, NextResponse } from 'next/server'
import { AuditInputSchema } from '../../../lib/validators'
import { runAudit } from '../../../lib/audit/auditEngine'
import { createServerClient } from '../../../lib/supabase/server'

export async function POST(req: NextRequest) {
  // TEMPORARY DEBUG — remove after confirming env vars
  console.log('ENV CHECK:', {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'EXISTS' : 'MISSING',
  })

  // 1. Parse and validate request body
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    )
  }

  const parsed = AuditInputSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        details: parsed.error.issues.map((issue) => issue.message),
      },
      { status: 400 }
    )
  }

  const { tools, teamSize, useCase } = parsed.data

  // 2. Run the audit engine (pure TypeScript, no AI)
  const auditSummary = runAudit({ tools, teamSize, useCase })

  // 3. Persist to Supabase
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('audits')
      .insert({
        team_size: teamSize,
        use_case: useCase,
        tools_input: tools,
        results: auditSummary.results,
        total_monthly_savings: auditSummary.totalMonthlySavings,
        total_annual_savings: auditSummary.totalAnnualSavings,
        is_optimal: auditSummary.isOptimal,
      })
      .select('id')
      .single()

    if (error || !data) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }

    // 4. Return 201 with auditId + summary
    return NextResponse.json(
      {
        auditId: data.id,
        totalMonthlySavings: auditSummary.totalMonthlySavings,
        totalAnnualSavings: auditSummary.totalAnnualSavings,
        results: auditSummary.results,
        isOptimal: auditSummary.isOptimal,
        showCredexCTA: auditSummary.showCredexCTA,
        showNotifyMe: auditSummary.showNotifyMe,
      },
      { status: 201 }
    )
  } catch (err) {
    console.error('Unexpected error in POST /api/audit:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
