import { BrushDivider } from "@/components/ui/BrushDivider";
import { cn } from "@/lib/utils";

interface AboutHeroProps {
  className?: string;
}

export function AboutHero({ className }: AboutHeroProps) {
  return (
    <header className={cn("max-w-xl", className)}>
      <h1 className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] text-teal leading-[1.15] mb-3">
        About Ella
      </h1>
      <BrushDivider width="w-16" />
    </header>
  );
}
