import { NextRequest, NextResponse } from 'next/server'
import { SummaryInputSchema } from '../../../lib/validators'
import { generateSummary } from '../../../lib/gemini'
import { createServerClient } from '../../../lib/supabase/server'

export async function POST(req: NextRequest) {
  // 1. Parse and validate body
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = SummaryInputSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    )
  }

  const { auditId, results, totalMonthlySavings, useCase, teamSize } = parsed.data

  // 2. Generate summary via Gemini (with fallback)
  const { summary, fallback } = await generateSummary({
    results,
    totalMonthlySavings,
    useCase,
    teamSize,
  })

  // 3. Persist ai_summary to audits table
  try {
    const supabase = createServerClient()
    await supabase
      .from('audits')
      .update({ ai_summary: summary })
      .eq('id', auditId)
  } catch (err) {
    // Non-fatal — summary still returns to client even if DB update fails
    console.error('Failed to persist ai_summary:', err)
  }

  // 4. Return summary (with optional fallback flag)
  const response: { summary: string; fallback?: boolean } = { summary }
  if (fallback) response.fallback = true

  return NextResponse.json(response)
}
