import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/contact-schema";

async function sanitize(value: string): Promise<string> {
  const { default: DOMPurify } = await import("isomorphic-dompurify");
  return DOMPurify.sanitize(value);
}

const resend = new Resend(process.env.RESEND_API_KEY);

const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_MS = 60_000;
const RECAPTCHA_THRESHOLD = 0.5;

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

function buildConfirmationHtml(name: string, message: string): string {
  const safeName = escapeHtml(name);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="dark" />
  <title>Got your message!</title>
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
                Wesley Ramalho
              </p>
              <h1 style="margin:8px 0 0;font-family:'Orbitron','Courier New',monospace;font-size:20px;font-weight:700;color:#f0f0f0;letter-spacing:0.05em;">
                Got your message! 👋
              </h1>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding-bottom:28px;">
              <div style="height:1px;background:rgba(255,255,255,0.08);"></div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding-bottom:28px;">
              <p style="margin:0;font-size:15px;line-height:1.7;color:#d4d4d8;">
                Hi <strong style="color:#f0f0f0;">${safeName}</strong>, thanks for reaching out!
                I received your message and will get back to you as soon as possible.
              </p>
            </td>
          </tr>

          <!-- Message recap card -->
          <tr>
            <td style="padding-bottom:40px;">
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:24px;">
                <tr>
                  <td>
                    <p style="margin:0 0 12px;font-family:'Orbitron','Courier New',monospace;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#71717a;">
                      Your message
                    </p>
                    <p style="margin:0;font-size:14px;line-height:1.7;color:#a1a1aa;">
                      ${safeMessage}
                    </p>
                  </td>
                </tr>
              </table>
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
                This is an automated confirmation from
                <a href="https://wesleyramalho.com" style="color:#71717a;text-decoration:none;">wesleyramalho.com</a>.
                Please do not reply to this email.
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

async function verifyRecaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return true; // Skip verification if not configured

  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
    });

    const data = (await res.json()) as { success: boolean; score?: number };
    return data.success && (data.score ?? 1) >= RECAPTCHA_THRESHOLD;
  } catch {
    return false;
  }
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

  const parsed = body as Record<string, unknown>;

  // Honeypot check — silently reject bots
  if (parsed.company) {
    return NextResponse.json({ success: true });
  }

  // Zod validation
  const result = contactSchema.safeParse(parsed);
  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid fields", details: result.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  // reCAPTCHA verification
  const recaptchaToken = typeof parsed.recaptchaToken === "string" ? parsed.recaptchaToken : "";
  if (recaptchaToken) {
    const isHuman = await verifyRecaptcha(recaptchaToken);
    if (!isHuman) {
      return NextResponse.json(
        { error: "reCAPTCHA verification failed" },
        { status: 403 },
      );
    }
  }

  const toEmail = process.env.RESEND_TO_EMAIL;
  if (!toEmail) {
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 },
    );
  }

  // Sanitize with DOMPurify + trim (Zod already trims via .trim())
  const trimmedName = await sanitize(result.data.name);
  const trimmedEmail = await sanitize(result.data.email);
  const trimmedMessage = await sanitize(result.data.message);

  const { error } = await resend.batch.send([
    {
      from: "Portfolio Contact <contato@wesleyramalho.com>",
      to: toEmail,
      replyTo: trimmedEmail,
      subject: `New message from ${trimmedName}`,
      text: `From: ${trimmedName} <${trimmedEmail}>\n\n${trimmedMessage}`,
      html: buildEmailHtml(trimmedName, trimmedEmail, trimmedMessage),
    },
    {
      from: "Portfolio Contact <contato@wesleyramalho.com>",
      to: trimmedEmail,
      subject: "Got your message!",
      text: `Hi ${trimmedName}, thanks for reaching out!\n\nI received your message and will get back to you as soon as possible.\n\nYour message:\n${trimmedMessage}\n\n— Wesley Ramalho\nhttps://wesleyramalho.com`,
      html: buildConfirmationHtml(trimmedName, trimmedMessage),
    },
  ]);

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
