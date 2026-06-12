import Image from "next/image";
import { cn } from "@/lib/utils";

export const BRAND_LOGO_PATH = "/brand/ella-wrights-art-logo.png";
export const BRAND_LOGO_ALT = "EllaWrightArt logo";

const LOGO_INTRINSIC = 500;

interface BrandLogoProps {
  variant?: "nav" | "footer";
  className?: string;
  priority?: boolean;
}

export function BrandLogo({
  variant = "nav",
  className,
  priority = false,
}: BrandLogoProps) {
  return (
    <Image
      src={BRAND_LOGO_PATH}
      alt={BRAND_LOGO_ALT}
      width={LOGO_INTRINSIC}
      height={LOGO_INTRINSIC}
      priority={priority}
      className={cn(
        "w-auto object-contain shrink-0",
        variant === "nav" && "h-[42px] sm:h-11 md:h-[52px] max-w-[140px] sm:max-w-[160px]",
        variant === "footer" && "h-9 w-auto max-w-[120px] opacity-90",
        className
      )}
    />
  );
}
