import { cn } from "@/lib/utils";

interface AboutBioProps {
  className?: string;
}

export function AboutBio({ className }: AboutBioProps) {
  return (
    <div
      className={cn(
        "space-y-5 text-teal/80 leading-[1.75] max-w-prose text-[15px] md:text-base",
        className
      )}
    >
      <p>
        Ella Wright is a student at the University of Utah studying studio art.
      </p>
      <p>
        She began oil painting at age 14 and fell in love with the way colors
        spread across the canvas. Art has become Ella&apos;s compass for
        understanding the world around her.
      </p>
      <p>
        Her work focuses on femininity, spirituality, and motherhood, while also
        drawing inspiration from landscape scenes near her home in Alpine, Utah.
      </p>
      <p>
        Through her paintings, Ella hopes to inspire reflection, thought, and
        change. She wants her art to foster problem solving, critical thinking,
        and a desire for truth in both herself and her viewers.
      </p>
    </div>
  );
}
