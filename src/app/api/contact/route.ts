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

  const safeName = escapeHtml(name.trim());
  const safeEmail = escapeHtml(email.trim());
  const safeMessage = escapeHtml(message.trim()).replace(/\n/g, "<br/>");

  const { error } = await resend.emails.send({
    from: "Portfolio Contact <contato@wesleyramalho.com>",
    to: toEmail,
    replyTo: email.trim(),
    subject: `New message from ${name.trim()}`,
    text: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`,
    html: `<p><strong>Name:</strong> ${safeName}</p><p><strong>Email:</strong> ${safeEmail}</p><hr/><p>${safeMessage}</p>`,
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
