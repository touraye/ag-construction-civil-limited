'use server'

import { Resend } from 'resend'
import { checkSuperAdmin } from '@/lib/auth/role-check'
import type { ActionResult } from '@/types/actions'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendShareEmail(input: {
    to: string
    projectName: string
    shareUrl: string
    token: string
    expiresAt: string
}): Promise<ActionResult> {
    const check = await checkSuperAdmin()
    if (!check.ok) return { success: false, error: check.error }

    const expiryFormatted = new Date(input.expiresAt).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric',
    })

    try {
        await resend.emails.send({
            from: 'IRONCLAD Construction <noreply@ironclad.gm>',
            to: input.to,
            subject: `Project Update — ${input.projectName}`,
            html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0d1117;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d1117;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#131a22;border-radius:4px;overflow:hidden;">
          <tr>
            <td style="padding:32px 32px 24px;border-bottom:1px solid rgba(255,255,255,0.06);">
              <div style="font-size:22px;font-weight:700;color:#f8fafc;letter-spacing:2px;">IRONCLAD</div>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <h1 style="color:#f8fafc;font-size:20px;margin:0 0 16px;">Project Update</h1>
              <p style="color:#8fa3ba;font-size:14px;line-height:1.6;margin:0 0 24px;">
                You can now view the latest progress and status for
                <strong style="color:#f8fafc;">${input.projectName}</strong>.
              </p>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius:3px;background:#1a6fd4;">
                    <a href="${input.shareUrl}" style="display:inline-block;padding:12px 28px;color:#ffffff;text-decoration:none;font-size:13px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">
                      View Project Progress
                    </a>
                  </td>
                </tr>
              </table>
              <p style="color:#8fa3ba;font-size:13px;margin:24px 0 4px;">Your access code:</p>
              <p style="color:#1a6fd4;font-size:20px;font-weight:700;letter-spacing:2px;margin:0 0 24px;font-family:monospace;">
                ${input.token}
              </p>
              <p style="color:#4a5a70;font-size:12px;margin:0;">
                This link is valid until ${expiryFormatted}.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.06);">
              <p style="color:#4a5a70;font-size:11px;margin:0;">
                IRONCLAD Construction · Banjul, Gambia
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
        })

        return { success: true, data: undefined, message: 'Email sent successfully' }
    } catch (err) {
        return {
            success: false,
            error: err instanceof Error ? err.message : 'Failed to send email',
        }
    }
}