import { Resend } from "resend";
import { getContactEmail, getResendFromEmail } from "./env";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey || apiKey.includes("your-")) return null;
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

  const from = getResendFromEmail();

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
        "Email sender address is invalid. In Vercel, delete RESEND_FROM_EMAIL and redeploy to use the default test sender, or set it exactly to: EllaWrightsArt <onboarding@resend.dev>"
      );
    }
    if (error.message.includes("domain") || error.message.includes("verified")) {
      throw new Error(
        "The sender domain is not verified in Resend yet. For testing, set RESEND_FROM_EMAIL to EllaWrightsArt <onboarding@resend.dev> and redeploy."
      );
    }
    throw new Error(error.message);
  }
}
