import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { LeadInputSchema } from '../../../lib/validators'
import { createServerClient } from '../../../lib/supabase/server'
import { checkRateLimit } from '../../../lib/rateLimit'
import { sendAuditEmail } from '../../../lib/resend'

export async function POST(req: NextRequest) {
  // 1. Parse and validate body
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = LeadInputSchema.safeParse(body)
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]
    return NextResponse.json(
      { error: firstIssue?.message ?? 'Validation failed' },
      { status: 400 }
    )
  }

  const { auditId, email, companyName, role, teamSize, honeypot } = parsed.data

  // 2. Honeypot check (already validated as empty by Zod, but double-check)
  if (honeypot !== '') {
    return NextResponse.json({ error: 'Honeypot triggered' }, { status: 400 })
  }

  // 3. Hash IP for rate limiting (SHA-256, never stored raw)
  const forwarded = req.headers.get('x-forwarded-for')
  const rawIp = forwarded ? forwarded.split(',')[0].trim() : '0.0.0.0'
  const ipHash = createHash('sha256').update(rawIp).digest('hex')

  // 4. Rate limit check: max 3 per IP per hour
  const allowed = await checkRateLimit(ipHash)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Try again later.' },
      { status: 429 }
    )
  }

  // 5. Fetch audit to get savings amount for high-savings flag
  let totalMonthlySavings = 0
  try {
    const supabase = createServerClient()
    const { data } = await supabase
      .from('audits')
      .select('total_monthly_savings')
      .eq('id', auditId)
      .single()
    totalMonthlySavings = data?.total_monthly_savings ?? 0
  } catch {
    // Non-fatal — proceed without savings data
  }

  const isHighSavings = totalMonthlySavings > 500

  // 6. Insert lead into Supabase
  try {
    const supabase = createServerClient()
    const { error } = await supabase.from('leads').insert({
      audit_id: auditId,
      email,
      company_name: companyName ?? null,
      role: role ?? null,
      team_size: teamSize ?? null,
      is_high_savings: isHighSavings,
      email_sent: false,
      ip_hash: ipHash,
    })

    if (error) {
      console.error('Lead insert error:', error)
      return NextResponse.json(
        { error: 'Failed to save lead' },
        { status: 500 }
      )
    }
  } catch (err) {
    console.error('Unexpected error inserting lead:', err)
    return NextResponse.json(
      { error: 'Failed to save lead' },
      { status: 500 }
    )
  }

  // 7. Send transactional email via Resend (non-fatal if it fails)
  try {
    await sendAuditEmail({ to: email, auditId, totalMonthlySavings, isHighSavings })

    // Mark email as sent
    const supabase = createServerClient()
    await supabase
      .from('leads')
      .update({ email_sent: true })
      .eq('audit_id', auditId)
      .eq('email', email)
      .order('created_at', { ascending: false })
      .limit(1)
  } catch (err) {
    console.error('Email send error (non-fatal):', err)
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
