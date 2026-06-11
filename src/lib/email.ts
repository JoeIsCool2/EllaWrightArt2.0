import { Resend } from "resend";
import { EMAIL } from "./constants";

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
  const from =
    process.env.RESEND_FROM_EMAIL ||
    "EllaWrightsArt <onboarding@resend.dev>";

  if (!resend) {
    throw new Error(
      "Email is temporarily unavailable. Please email Ella directly at ellawright.artist@gmail.com."
    );
  }

  const { error } = await resend.emails.send({
    from,
    to: EMAIL,
    subject,
    html,
    replyTo,
    attachments: attachments?.map((a) => ({
      filename: a.filename,
      content: a.content,
    })),
  });

  if (error) {
    throw new Error(error.message);
  }
}
