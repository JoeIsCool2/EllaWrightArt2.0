import { cn } from "@/lib/utils";
import { BrushDivider } from "./BrushDivider";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-6 md:mb-8",
        align === "center" && "text-center",
        className
      )}
    >
      <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-teal mb-3">
        {title}
      </h1>
      <BrushDivider
        className={cn("mb-3", align === "center" ? "mx-auto" : "")}
        width={align === "center" ? "w-24" : "w-20"}
      />
      {subtitle && (
        <p
          className={cn(
            "text-teal/80 text-base md:text-lg max-w-2xl leading-relaxed",
            align === "center" && "mx-auto"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
