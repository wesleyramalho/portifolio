import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_MS = 60_000;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildEmailHtml(name: string, email: string, message: string): string {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="dark" />
  <title>New message from ${safeName}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet" />
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;color:#f0f0f0;font-family:system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

          <!-- Header -->
          <tr>
            <td style="padding-bottom:32px;">
              <p style="margin:0;font-family:'Orbitron','Courier New',monospace;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#71717a;">
                Portfolio Contact
              </p>
              <h1 style="margin:8px 0 0;font-family:'Orbitron','Courier New',monospace;font-size:20px;font-weight:700;color:#f0f0f0;letter-spacing:0.05em;">
                Wesley Ramalho
              </h1>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding-bottom:24px;">
              <div style="height:1px;background:rgba(255,255,255,0.08);"></div>
            </td>
          </tr>

          <!-- Label -->
          <tr>
            <td style="padding-bottom:12px;">
              <p style="margin:0;font-family:'Orbitron','Courier New',monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#71717a;">
                New message
              </p>
            </td>
          </tr>

          <!-- Sender card -->
          <tr>
            <td style="padding-bottom:24px;">
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.10);border-radius:8px;padding:20px 24px;">
                <tr>
                  <td>
                    <p style="margin:0 0 2px;font-family:'Orbitron','Courier New',monospace;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#71717a;">
                      From
                    </p>
                    <p style="margin:0;font-size:15px;font-weight:600;color:#f0f0f0;">
                      ${safeName}
                    </p>
                    <p style="margin:4px 0 0;font-size:13px;color:#a1a1aa;">
                      <a href="mailto:${safeEmail}" style="color:#a1a1aa;text-decoration:none;">${safeEmail}</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message card -->
          <tr>
            <td style="padding-bottom:32px;">
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:24px;">
                <tr>
                  <td>
                    <p style="margin:0 0 16px;font-family:'Orbitron','Courier New',monospace;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#71717a;">
                      Message
                    </p>
                    <p style="margin:0;font-size:15px;line-height:1.7;color:#d4d4d8;">
                      ${safeMessage}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Reply button -->
          <tr>
            <td style="padding-bottom:40px;">
              <a href="mailto:${safeEmail}?subject=Re: Your message"
                style="display:inline-block;font-family:'Orbitron','Courier New',monospace;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#f0f0f0;background:rgba(255,255,255,0.10);border:1px solid rgba(255,255,255,0.20);border-radius:6px;padding:12px 28px;text-decoration:none;">
                Reply to ${safeName}
              </a>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding-bottom:24px;">
              <div style="height:1px;background:rgba(255,255,255,0.08);"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td>
              <p style="margin:0;font-size:12px;color:#52525b;line-height:1.6;">
                This message was sent via the contact form at
                <a href="https://wesleyramalho.com" style="color:#71717a;text-decoration:none;">wesleyramalho.com</a>.
                Reply directly to this email to respond to ${safeName}.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const lastSent = rateLimitMap.get(ip) ?? 0;
  if (Date.now() - lastSent < RATE_LIMIT_MS) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const { name, email, message } = body as Record<string, unknown>;

  if (
    typeof name !== "string" ||
    name.trim().length === 0 ||
    name.length > 100 ||
    typeof email !== "string" ||
    !EMAIL_REGEX.test(email) ||
    email.length > 254 ||
    typeof message !== "string" ||
    message.trim().length === 0 ||
    message.length > 2000
  ) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 422 });
  }

  const toEmail = process.env.RESEND_TO_EMAIL;
  if (!toEmail) {
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 },
    );
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedMessage = message.trim();

  const { error } = await resend.emails.send({
    from: "Portfolio Contact <contato@wesleyramalho.com>",
    to: toEmail,
    replyTo: trimmedEmail,
    subject: `New message from ${trimmedName}`,
    text: `From: ${trimmedName} <${trimmedEmail}>\n\n${trimmedMessage}`,
    html: buildEmailHtml(trimmedName, trimmedEmail, trimmedMessage),
  });

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[contact] Resend error:", error);
    }
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }

  rateLimitMap.set(ip, Date.now());
  return NextResponse.json({ success: true });
}
