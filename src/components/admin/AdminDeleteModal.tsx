"use client";

import { Button } from "@/components/ui/Button";

interface AdminDeleteModalProps {
  title: string;
  open: boolean;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function AdminDeleteModal({
  title,
  open,
  loading,
  onConfirm,
  onCancel,
}: AdminDeleteModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-teal/20 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-[var(--shadow-card)]">
        <h2 id="delete-modal-title" className="font-serif text-xl text-teal mb-2">
          Delete artwork?
        </h2>
        <p className="text-sm text-teal/70 leading-relaxed mb-6">
          <span className="font-medium text-teal">{title}</span> will be removed from
          your gallery. This cannot be undone.
        </p>
        <div className="flex flex-wrap gap-3 justify-end">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete Artwork"}
          </button>
        </div>
      </div>
    </div>
  );
}
