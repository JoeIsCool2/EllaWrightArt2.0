import { cn } from "@/lib/utils";

interface BrushDividerProps {
  className?: string;
  width?: string;
}

export function BrushDivider({
  className,
  width = "w-20",
}: BrushDividerProps) {
  return (
    <div
      className={cn("brush-stroke", width, className)}
      aria-hidden="true"
    />
  );
}

export function BrushDividerCentered({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-4 justify-center", className)}>
      <div className="brush-stroke w-16 md:w-24" aria-hidden="true" />
      <div className="w-2 h-2 rounded-full bg-coral/60" aria-hidden="true" />
      <div className="brush-stroke w-16 md:w-24" aria-hidden="true" />
    </div>
  );
}
