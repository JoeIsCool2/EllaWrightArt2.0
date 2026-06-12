import { cn } from "@/lib/utils";
import { FeaturedCommissionArtCard } from "./FeaturedCommissionArtCard";
import { CommissionProcessCard } from "./CommissionProcessCard";

interface CommissionSidebarProps {
  className?: string;
}

export function CommissionSidebar({ className }: CommissionSidebarProps) {
  return (
    <aside
      className={cn(
        "space-y-5 lg:space-y-6 lg:sticky lg:top-24",
        className
      )}
    >
      <FeaturedCommissionArtCard />
      <CommissionProcessCard />

      <div className="rounded-xl bg-cream/50 border border-teal/[0.06] px-4 py-3.5">
        <p className="text-sm text-teal/70 leading-relaxed">
          Not sure exactly what to ask for? You can share an idea, a color
          palette, a feeling, a memory, or a reference image.
        </p>
      </div>
    </aside>
  );
}
