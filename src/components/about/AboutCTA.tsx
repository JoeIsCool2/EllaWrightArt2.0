import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface AboutCTAProps {
  className?: string;
}

export function AboutCTA({ className }: AboutCTAProps) {
  return (
    <div
      className={cn(
        "text-center pt-6 md:pt-8 border-t border-teal/[0.06]",
        className
      )}
    >
      <p className="font-serif text-xl md:text-2xl text-teal mb-5">
        Explore Ella&apos;s work
      </p>
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
