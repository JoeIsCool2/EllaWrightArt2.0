const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export function sanitizeText(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

export const LIMITS = {
  name: 120,
  email: 254,
  subject: 200,
  message: 5000,
  description: 5000,
  budget: 100,
  size: 100,
  style: 200,
  instagram: 80,
} as const;

export const MAX_REFERENCE_FILE_BYTES = 5 * 1024 * 1024; // 5 MB
export const MAX_ARTWORK_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

export const ALLOWED_ARTWORK_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export function isValidArtworkImageFile(file: File): boolean {
  return (
    (ALLOWED_ARTWORK_MIME_TYPES as readonly string[]).includes(file.type) &&
    file.size <= MAX_ARTWORK_FILE_BYTES
  );
}

export function isValidImageFile(file: File): boolean {
  return file.type.startsWith("image/") && file.size <= MAX_REFERENCE_FILE_BYTES;
}
