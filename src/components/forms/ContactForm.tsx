"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface ContactFormProps {
  defaultSubject?: string;
}

export function ContactForm({ defaultSubject = "" }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const subject = String(formData.get("subject") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name || !email || !subject || !message) {
      setStatus("error");
      setErrorMessage("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message.");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  }

  if (status === "success") {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-[var(--shadow-soft)] text-center">
        <h3 className="font-serif text-2xl text-teal mb-3">Message Sent</h3>
        <p className="text-teal/70 mb-6">
          Thank you for reaching out! Ella will get back to you soon.
        </p>
        <Button onClick={() => setStatus("idle")} variant="secondary">
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl p-6 md:p-8 shadow-[var(--shadow-soft)] space-y-5"
      noValidate
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="contact-name" className="block text-sm font-medium text-teal mb-1.5">
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            maxLength={120}
            placeholder="Your full name"
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-sm font-medium text-teal mb-1.5">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            maxLength={254}
            placeholder="you@example.com"
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className="block text-sm font-medium text-teal mb-1.5">
          Subject
        </label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          required
          maxLength={200}
          defaultValue={defaultSubject}
          placeholder="What is this regarding?"
          className="input-field"
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-teal mb-1.5">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          maxLength={5000}
          placeholder="Tell me more about your inquiry..."
          className="input-field"
        />
      </div>

      {status === "error" && (
        <p className="text-red-600 text-sm" role="alert">
          {errorMessage}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <Button type="submit" variant="primary" disabled={status === "loading"}>
          {status === "loading" ? "Sending..." : "Send Message"}
        </Button>
        <Button href="/commissions" variant="secondary">
          Request a Commission
        </Button>
      </div>
    </form>
  );
}
