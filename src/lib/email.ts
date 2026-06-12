import { Resend } from "resend";
import { getContactEmail, getResendFromEmail } from "./env";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export interface EmailAttachment {
  filename: string;
  content: Buffer;
}

export async function sendEmail({
  subject,
  html,
  replyTo,
  attachments,
}: {
  subject: string;
  html: string;
  replyTo?: string;
  attachments?: EmailAttachment[];
}) {
  const resend = getResend();

  if (!resend) {
    throw new Error(
      "Email is temporarily unavailable. Please email Ella directly at ellawright.artist@gmail.com."
    );
  }

  let from: string;
  try {
    from = getResendFromEmail();
  } catch {
    throw new Error(
      "Email sender is misconfigured. In Vercel, set RESEND_FROM_EMAIL to: EllaWrightsArt <onboarding@resend.dev> (for testing) or EllaWrightsArt <hello@your-verified-domain.com> (for production)."
    );
  }

  const { error } = await resend.emails.send({
    from,
    to: getContactEmail(),
    subject,
    html,
    replyTo,
    attachments: attachments?.map((a) => ({
      filename: a.filename,
      content: a.content,
    })),
  });

  if (error) {
    if (error.message.includes("Invalid `from` field")) {
      throw new Error(
        "Email sender address is invalid. In Vercel → Environment Variables, set RESEND_FROM_EMAIL exactly like: EllaWrightsArt <onboarding@resend.dev> — include the angle brackets around the email."
      );
    }
    throw new Error(error.message);
  }
}
