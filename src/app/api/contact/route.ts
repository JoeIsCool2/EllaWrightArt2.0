import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { isValidEmail, sanitizeText, LIMITS } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = sanitizeText(body.name, LIMITS.name);
    const email = sanitizeText(body.email, LIMITS.email);
    const subject = sanitizeText(body.subject, LIMITS.subject);
    const message = sanitizeText(body.message, LIMITS.message);

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    await sendEmail({
      subject: `[Contact] ${subject}`,
      replyTo: email,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <hr />
        <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to send message.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
