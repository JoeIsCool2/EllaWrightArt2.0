import { BrushDivider } from "@/components/ui/BrushDivider";
import { cn } from "@/lib/utils";

interface AboutQuoteProps {
  className?: string;
}

export function AboutQuote({ className }: AboutQuoteProps) {
  return (
    <figure
      className={cn(
        "bg-white/90 rounded-2xl p-5 md:p-6 shadow-[var(--shadow-soft)] border border-teal/[0.05] mt-1",
        className
      )}
    >
      <p className="text-xs tracking-[0.18em] uppercase text-teal/50 font-medium mb-1">
        Artist Statement
      </p>
      <BrushDivider width="w-10" className="mb-4" />
      <blockquote className="font-serif text-lg md:text-xl text-teal/90 italic leading-relaxed">
        &ldquo;Art is my way of listening—for beauty, for truth, and for the
        whispers of something greater than myself.&rdquo;
      </blockquote>
    </figure>
  );
}
