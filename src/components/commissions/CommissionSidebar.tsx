import type { Artwork } from "@/lib/artworks/types";
import { BrushDivider } from "@/components/ui/BrushDivider";
import { CommissionFeaturedCard } from "./CommissionFeaturedCard";

const STEPS = [
  {
    title: "Share Your Vision",
    description:
      "Fill out the form with your ideas, inspiration, and any details you'd like to include.",
  },
  {
    title: "Ella Reviews & Responds",
    description:
      "Ella will review your request and be in touch within 3–5 business days with next steps.",
  },
  {
    title: "Create Something Meaningful",
    description:
      "Once aligned, Ella will begin creating a custom piece made just for you.",
  },
] as const;

interface CommissionSidebarProps {
  artwork: Artwork;
}

export function CommissionSidebar({ artwork }: CommissionSidebarProps) {
  return (
    <aside className="space-y-5 lg:space-y-6">
      <div>
        <p className="text-xs tracking-[0.18em] uppercase text-teal/50 font-medium mb-1">
          Commission Process
        </p>
        <BrushDivider width="w-12" />
      </div>

      <CommissionFeaturedCard artwork={artwork} />

      <div className="bg-white rounded-2xl p-5 md:p-6 shadow-[var(--shadow-soft)] border border-teal/[0.05]">
        <h2 className="font-serif text-xl text-teal mb-1">What to Expect</h2>
        <BrushDivider width="w-12" className="mb-5" />

        <ol className="space-y-5">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex gap-3.5">
              <div
                className="shrink-0 w-8 h-8 rounded-full bg-coral/10 border border-coral/15 flex items-center justify-center text-xs font-semibold text-coral"
                aria-hidden="true"
              >
                {i + 1}
              </div>
              <div className="min-w-0 pt-0.5">
                <h3 className="font-medium text-teal text-sm mb-1">{step.title}</h3>
                <p className="text-sm text-teal/65 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-xl bg-cream/50 border border-teal/[0.06] px-4 py-3.5">
        <p className="text-sm text-teal/70 leading-relaxed">
          Not sure what to request? Share whatever you have — an idea, a feeling,
          a reference image, or a story.
        </p>
      </div>
    </aside>
  );
}
