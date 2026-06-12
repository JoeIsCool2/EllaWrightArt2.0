import { BrushDivider } from "@/components/ui/BrushDivider";
import { cn } from "@/lib/utils";

interface CommissionHeroProps {
  className?: string;
}

export function CommissionHero({ className }: CommissionHeroProps) {
  return (
    <header className={cn("max-w-xl", className)}>
      <h1 className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] text-teal leading-[1.15] mb-3">
        Request a Commission
      </h1>
      <BrushDivider width="w-16" className="mb-4" />
      <div className="text-teal/75 leading-relaxed space-y-2 text-[15px] md:text-base">
        <p>
          Ella is accepting custom artwork inquiries. Each piece is created with
          care and intention—designed to reflect what matters most to you.
        </p>
        <p className="text-teal/65">
          Pricing depends on size, complexity, materials, and timeline.
        </p>
      </div>
    </header>
  );
}
