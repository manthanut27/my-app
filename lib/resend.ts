import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Send a transactional audit report email via Resend.
 * High-savings audits include a Credex follow-up note.
 */
export async function sendAuditEmail(params: {
  to: string
  auditId: string
  totalMonthlySavings: number
  isHighSavings: boolean
}): Promise<void> {
  const { to, auditId, totalMonthlySavings, isHighSavings } = params
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://stackaudit.app'
  const auditUrl = `${appUrl}/audit/${auditId}`
  const from = process.env.RESEND_FROM_EMAIL ?? 'audit@stackaudit.app'

  const credexNote = isHighSavings
    ? `<p style="margin:24px 0;padding:16px;background:#0D2A1A;border-left:3px solid #00FF88;color:#E0E0E0;font-size:14px;">
        Our team at Credex will reach out with a custom offer to help you capture these savings with AI credits and vendor negotiation.
      </p>`
    : ''

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your StackAudit Report</title>
</head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:Inter,sans-serif;color:#E0E0E0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="padding:0 0 32px 0;">
              <span style="font-family:monospace;font-size:20px;font-weight:700;color:#E0E0E0;text-transform:uppercase;letter-spacing:0.1em;">StackAudit</span>
            </td>
          </tr>
          <!-- Savings hero -->
          <tr>
            <td style="background:#111111;border:1px solid #1F1F1F;padding:32px;">
              <p style="margin:0 0 8px 0;font-size:11px;font-family:monospace;color:#666666;text-transform:uppercase;letter-spacing:0.1em;">TOTAL MONTHLY SAVINGS IDENTIFIED</p>
              <p style="margin:0 0 24px 0;font-size:56px;font-family:monospace;font-weight:700;color:#00FF88;line-height:1;letter-spacing:-0.05em;">$${totalMonthlySavings.toFixed(2)}</p>
              <p style="margin:0;font-size:14px;color:#E0E0E0;">That's <strong style="color:#E0E0E0;">$${(totalMonthlySavings * 12).toFixed(2)}</strong> saved per year</p>
            </td>
          </tr>
          <!-- CTA -->
          <tr>
            <td style="padding:24px 0;">
              ${credexNote}
              <a href="${auditUrl}" style="display:inline-block;background:#00FF88;color:#0A0A0A;font-family:monospace;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;padding:14px 28px;text-decoration:none;">
                VIEW FULL REPORT →
              </a>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="border-top:1px solid #1F1F1F;padding-top:24px;">
              <p style="margin:0;font-size:12px;color:#666666;">
                © 2025 StackAudit · Built for Credex<br/>
                <a href="${appUrl}" style="color:#666666;text-decoration:underline;">stackaudit.app</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  await resend.emails.send({
    from,
    to,
    subject: 'Your StackAudit Report',
    html,
  })
}
