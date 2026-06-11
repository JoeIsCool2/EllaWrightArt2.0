import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  isValidEmail,
  sanitizeText,
  LIMITS,
  MAX_REFERENCE_FILE_BYTES,
} from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name = sanitizeText(formData.get("name"), LIMITS.name);
    const email = sanitizeText(formData.get("email"), LIMITS.email);
    const budget = sanitizeText(formData.get("budget"), LIMITS.budget);
    const size = sanitizeText(formData.get("size"), LIMITS.size);
    const deadline = sanitizeText(formData.get("deadline"), 30);
    const style = sanitizeText(formData.get("style"), LIMITS.style);
    const description = sanitizeText(formData.get("description"), LIMITS.description);
    const instagram = sanitizeText(formData.get("instagram"), LIMITS.instagram);
    const reference = formData.get("reference");

    if (!name || !email || !description) {
      return NextResponse.json(
        { error: "Name, email, and description are required." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    let referenceNote = "None provided";
    const attachments: { filename: string; content: Buffer }[] = [];

    if (reference instanceof File && reference.size > 0) {
      if (!reference.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "Reference file must be an image." },
          { status: 400 }
        );
      }

      if (reference.size > MAX_REFERENCE_FILE_BYTES) {
        return NextResponse.json(
          { error: "Reference image must be 5 MB or smaller." },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await reference.arrayBuffer());
      let referenceUrl = "";

      const supabase = await createAdminClient();
      if (supabase) {
        const ext = reference.name.split(".").pop() || "jpg";
        const fileName = `references/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("artwork-images")
          .upload(fileName, buffer, {
            contentType: reference.type,
            upsert: false,
          });

        if (!uploadError) {
          const { data } = supabase.storage
            .from("artwork-images")
            .getPublicUrl(fileName);
          referenceUrl = data.publicUrl;
        }
      }

      if (referenceUrl) {
        referenceNote = `<a href="${referenceUrl}">${escapeHtml(referenceUrl)}</a>`;
      } else {
        attachments.push({
          filename: reference.name || "reference.jpg",
          content: buffer,
        });
        referenceNote = `Attached: ${escapeHtml(reference.name || "reference.jpg")}`;
      }
    }

    await sendEmail({
      subject: `[Commission Request] from ${name}`,
      replyTo: email,
      attachments: attachments.length > 0 ? attachments : undefined,
      html: `
        <h2>New Commission Request</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Budget:</strong> ${escapeHtml(budget || "Not specified")}</p>
        <p><strong>Desired Size:</strong> ${escapeHtml(size || "Not specified")}</p>
        <p><strong>Deadline:</strong> ${escapeHtml(deadline || "Not specified")}</p>
        <p><strong>Art Style / Subject:</strong> ${escapeHtml(style || "Not specified")}</p>
        <p><strong>Instagram:</strong> ${escapeHtml(instagram || "Not provided")}</p>
        <p><strong>Reference Photo:</strong> ${referenceNote}</p>
        <hr />
        <p><strong>Description:</strong></p>
        <p>${escapeHtml(description).replace(/\n/g, "<br />")}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to submit request.";
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
