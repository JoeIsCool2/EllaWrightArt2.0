import { BrushDivider } from "@/components/ui/BrushDivider";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface AboutCTAProps {
  className?: string;
}

export function AboutCTA({ className }: AboutCTAProps) {
  return (
    <div className={cn("text-center max-w-2xl mx-auto", className)}>
      <BrushDivider width="w-14" className="mx-auto mb-6" />
      <h2
        id="about-cta-heading"
        className="font-serif text-2xl md:text-3xl text-teal mb-6"
      >
        Explore Ella&apos;s work
      </h2>
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
        <Button href="/gallery" variant="primary" size="md" className="sm:min-w-[160px]">
          View Gallery
        </Button>
        <Button
          href="/commissions"
          variant="secondary"
          size="md"
          className="sm:min-w-[200px]"
        >
          Request a Commission
        </Button>
      </div>
    </div>
  );
}
