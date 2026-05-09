import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '../../../../lib/supabase/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!id) {
    return NextResponse.json({ error: 'Audit ID required' }, { status: 400 })
  }

  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('audits')
      .select(
        'id, created_at, team_size, use_case, tools_input, results, total_monthly_savings, total_annual_savings, ai_summary, is_optimal'
      )
      .eq('id', id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Audit not found' }, { status: 404 })
    }

    // Return public-safe data (no PII — leads table is separate)
    return NextResponse.json({
      auditId: data.id,
      createdAt: data.created_at,
      teamSize: data.team_size,
      useCase: data.use_case,
      toolsInput: data.tools_input,
      results: data.results,
      totalMonthlySavings: data.total_monthly_savings,
      totalAnnualSavings: data.total_annual_savings,
      aiSummary: data.ai_summary,
      isOptimal: data.is_optimal,
    })
  } catch (err) {
    console.error('Unexpected error in GET /api/audit/[id]:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
