import { BrushDivider } from "@/components/ui/BrushDivider";

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

export function CommissionProcessCard() {
  return (
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
  );
}
