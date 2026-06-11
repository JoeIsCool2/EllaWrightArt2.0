import type { Metadata } from "next";
import { LayoutContainer } from "@/components/layout/LayoutContainer";
import { BrushDivider } from "@/components/ui/BrushDivider";
import { ProtectedArtworkImage } from "@/components/artwork/ProtectedArtworkImage";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Ella Wright, a studio art student at the University of Utah creating oil paintings inspired by femininity, spirituality, and motherhood.",
  openGraph: {
    title: "About | EllaWrightsArt",
    description:
      "Learn about Ella Wright, a studio art student at the University of Utah creating oil paintings inspired by femininity, spirituality, and motherhood.",
  },
};

export default function AboutPage() {
  return (
    <section className="py-8 md:py-12 overflow-x-hidden">
      <LayoutContainer>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-start">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl text-teal mb-3">
              About Ella
            </h1>
            <BrushDivider className="mb-6" />

            <div className="space-y-4 text-teal/80 leading-relaxed max-w-prose text-[15px] md:text-base">
              <p>
                Ella Wright is a student at the University of Utah studying
                studio art.
              </p>
              <p>
                She began oil painting at age 14 and fell in love with the way
                colors spread across the canvas. Art has become Ella&apos;s
                compass for understanding the world around her.
              </p>
              <p>
                Her work focuses on femininity, spirituality, and motherhood,
                while also drawing inspiration from landscape scenes near her
                home in Alpine, Utah.
              </p>
              <p>
                Through her paintings, Ella hopes to inspire reflection, thought,
                and change. She wants her art to foster problem solving, critical
                thinking, and a desire for truth in both herself and her viewers.
              </p>
            </div>

            <blockquote className="mt-8 pt-6 border-t border-coral/20 font-serif text-lg md:text-xl text-teal italic leading-relaxed max-w-md">
              &ldquo;Art is my way of listening—for beauty, for truth, and for
              the whispers of something greater than myself.&rdquo;
            </blockquote>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-md lg:max-w-none mx-auto lg:mx-0 w-full">
            {[
              {
                src: "/artwork/perspective.jpg",
                alt: "Perspective — colorful landscape painting by Ella Wright",
                position: "center 40%",
              },
              {
                src: "/artwork/mary-and-jesus.jpg",
                alt: "Mary and Jesus — motherhood painting by Ella Wright",
                position: "center 25%",
              },
              {
                src: "/artwork/worshipping-the-living-water.jpg",
                alt: "Worshipping the Living Water — spiritual painting by Ella Wright",
                position: "center 30%",
                className: "col-span-2",
              },
            ].map((img) => (
              <div
                key={img.src}
                className={`rounded-xl overflow-hidden shadow-[var(--shadow-soft)] bg-ivory ${img.className ?? ""}`}
              >
                <div className="relative aspect-[4/5] max-h-[220px] lg:max-h-[260px]">
                  <ProtectedArtworkImage
                    src={img.src}
                    alt={img.alt}
                    fill
                    priority={img.src.includes("perspective")}
                    objectFit="cover"
                    objectPosition={img.position}
                    sizes="(max-width: 1024px) 45vw, 25vw"
                    watermark={false}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </LayoutContainer>
    </section>
  );
}
