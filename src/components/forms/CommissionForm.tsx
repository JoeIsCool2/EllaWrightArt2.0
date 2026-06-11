"use client";

import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MAX_REFERENCE_FILE_BYTES } from "@/lib/validation";

export function CommissionForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileSelect(file: File | undefined) {
    if (!file) {
      setFileName("");
      setFileError("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setFileName("");
      setFileError("Please choose an image file (JPEG, PNG, or WebP).");
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    if (file.size > MAX_REFERENCE_FILE_BYTES) {
      setFileName("");
      setFileError("Image must be 5 MB or smaller.");
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    setFileName(file.name);
    setFileError("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const description = String(formData.get("description") || "").trim();

    if (!name || !email || !description) {
      setStatus("error");
      setErrorMessage("Name, email, and description are required.");
      return;
    }

    if (fileError) {
      setStatus("error");
      setErrorMessage(fileError);
      return;
    }

    try {
      const res = await fetch("/api/commission", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit request.");
      }

      setStatus("success");
      form.reset();
      setFileName("");
      setFileError("");
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
        <h3 className="font-serif text-2xl text-teal mb-3">Request Submitted</h3>
        <p className="text-teal/70 mb-6">
          Thank you for your commission inquiry! Ella will review your request
          and be in touch within 3–5 business days.
        </p>
        <Button onClick={() => setStatus("idle")} variant="coral">
          Submit Another Request
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
          <label htmlFor="commission-name" className="block text-sm font-medium text-teal mb-1.5">
            Name
          </label>
          <input
            id="commission-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            maxLength={120}
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="commission-email" className="block text-sm font-medium text-teal mb-1.5">
            Email
          </label>
          <input
            id="commission-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            maxLength={254}
            className="input-field"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <label htmlFor="commission-budget" className="block text-sm font-medium text-teal mb-1.5">
            Budget
          </label>
          <input
            id="commission-budget"
            name="budget"
            type="text"
            maxLength={100}
            placeholder="e.g. $500 - $1000"
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="commission-size" className="block text-sm font-medium text-teal mb-1.5">
            Desired Size
          </label>
          <input
            id="commission-size"
            name="size"
            type="text"
            maxLength={100}
            placeholder={'e.g. 16" x 20"'}
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="commission-deadline" className="block text-sm font-medium text-teal mb-1.5">
            Deadline
          </label>
          <input
            id="commission-deadline"
            name="deadline"
            type="text"
            maxLength={100}
            placeholder="Preferred deadline"
            className="input-field"
            autoComplete="off"
          />
        </div>
      </div>

      <div>
        <label htmlFor="commission-style" className="block text-sm font-medium text-teal mb-1.5">
          Art Style / Subject
        </label>
        <input
          id="commission-style"
          name="style"
          type="text"
          maxLength={200}
          placeholder="Spiritual, Landscape, Motherhood, Abstract..."
          className="input-field"
        />
      </div>

      <div>
        <label htmlFor="commission-description" className="block text-sm font-medium text-teal mb-1.5">
          Description
        </label>
        <textarea
          id="commission-description"
          name="description"
          required
          rows={4}
          maxLength={5000}
          placeholder="Tell Ella about your vision..."
          className="input-field"
        />
      </div>

      <div>
        <label id="reference-label" className="block text-sm font-medium text-teal mb-1.5">
          Reference Photo Upload
        </label>
        <div
          className="border-2 border-dashed border-teal/20 rounded-xl p-8 text-center cursor-pointer hover:border-coral/40 transition-colors"
          onClick={() => fileRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFileSelect(e.dataTransfer.files?.[0]);
            if (fileRef.current && e.dataTransfer.files?.[0]) {
              const dt = new DataTransfer();
              dt.items.add(e.dataTransfer.files[0]);
              fileRef.current.files = dt.files;
            }
          }}
          role="button"
          tabIndex={0}
          aria-labelledby="reference-label"
        >
          <Upload className="mx-auto text-teal/40 mb-2" size={28} aria-hidden="true" />
          <p className="text-sm text-teal/60">
            {fileName || "Drag and drop or click to upload"}
          </p>
          <p className="text-xs text-teal/40 mt-1">Optional · JPEG, PNG, or WebP · Max 5 MB</p>
          <input
            ref={fileRef}
            type="file"
            name="reference"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files?.[0])}
          />
        </div>
        {fileError && (
          <p className="text-red-600 text-sm mt-2" role="alert">
            {fileError}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="commission-instagram" className="block text-sm font-medium text-teal mb-1.5">
          Instagram Handle <span className="text-teal/40">(optional)</span>
        </label>
        <input
          id="commission-instagram"
          name="instagram"
          type="text"
          maxLength={80}
          placeholder="@yourhandle"
          className="input-field"
        />
      </div>

      {status === "error" && (
        <p className="text-red-600 text-sm" role="alert">
          {errorMessage}
        </p>
      )}

      <Button
        type="submit"
        variant="coral"
        size="lg"
        className="w-full"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Submitting..." : "Request a Commission"}
      </Button>
    </form>
  );
}
