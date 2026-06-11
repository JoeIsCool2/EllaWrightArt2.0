"use client";

import { GALLERY_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface GalleryFiltersProps {
  active: string;
  onChange: (categoryId: string) => void;
  disabled?: boolean;
}

export function GalleryFilters({
  active,
  onChange,
  disabled,
}: GalleryFiltersProps) {
  return (
    <div
      className={cn("mb-8 md:mb-10 -mx-1", disabled && "opacity-60")}
      aria-busy={disabled}
    >
      <div
        className="overflow-x-auto scrollbar-hide pb-1"
        role="tablist"
        aria-label="Filter artwork by category"
      >
        <div className="inline-flex min-w-full sm:min-w-0 gap-1.5 sm:gap-1 rounded-2xl sm:rounded-full border border-teal/15 bg-white/70 p-1.5 sm:p-1">
          {GALLERY_CATEGORIES.map((cat) => {
            const isActive = active === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                disabled={disabled}
                onClick={() => onChange(cat.id)}
                className={cn(
                  "px-4 py-2.5 text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap shrink-0",
                  isActive
                    ? "bg-teal text-white shadow-sm"
                    : "text-teal/70 hover:text-teal hover:bg-teal/5"
                )}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
