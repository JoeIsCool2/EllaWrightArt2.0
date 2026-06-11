import type { Metadata } from "next";
import { MessageCircle, Mail, Heart } from "lucide-react";
import { getFeaturedArtwork } from "@/lib/artworks/service";
import { LayoutContainer } from "@/components/layout/LayoutContainer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CommissionForm } from "@/components/forms/CommissionForm";
import { ArtworkLabel } from "@/components/artwork/ArtworkLabel";
import { FeaturedArtworkFrame } from "@/components/artwork/FeaturedArtworkFrame";

export const metadata: Metadata = {
  title: "Commissions",
  description:
    "Request a custom oil painting commission from Ella Wright. Each piece is created with care and intention.",
  openGraph: {
    title: "Commissions | EllaWrightsArt",
    description:
      "Request a custom oil painting commission from Ella Wright. Each piece is created with care and intention.",
  },
};

const STEPS = [
  {
    icon: MessageCircle,
    title: "Share Your Vision",
    description:
      "Fill out the form with your ideas, inspiration, and any details you'd like to include.",
  },
  {
    icon: Mail,
    title: "Ella Reviews & Responds",
    description:
      "Ella will review your request and be in touch within 3–5 business days with next steps.",
  },
  {
    icon: Heart,
    title: "Create Something Meaningful",
    description:
      "Once we're aligned, Ella will begin creating a custom piece made just for you.",
  },
];

export default async function CommissionsPage() {
  const featured = await getFeaturedArtwork();

  return (
    <section className="py-8 md:py-12 relative overflow-hidden">
      <LayoutContainer>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-3">
            <SectionHeader title="Request a Commission" className="mb-6 md:mb-8" />
            <div className="text-teal/80 leading-relaxed mb-6 space-y-3 max-w-2xl text-[15px] md:text-base">
              <p>
                Ella is accepting custom artwork inquiries. Each piece is created
                with care and intention—designed to reflect what matters most to
                you.
              </p>
              <p>
                Pricing depends on size, complexity, materials, and timeline.
              </p>
            </div>
            <CommissionForm />
          </div>

          <div className="lg:col-span-2 space-y-5 lg:sticky lg:top-24">
            <div>
              <FeaturedArtworkFrame
                artwork={featured}
                compact
                sizes="(max-width: 1024px) 100vw, 280px"
                maxWidthClass="max-w-[240px] mx-auto lg:mx-0"
              />
              <div className="pt-3">
                <ArtworkLabel artwork={featured} align="right" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 md:p-6 shadow-[var(--shadow-soft)]">
              <h2 className="font-serif text-xl text-teal mb-2">
                What to Expect
              </h2>
              <div className="brush-stroke w-14 mb-5" aria-hidden="true" />

              <div className="space-y-5">
                {STEPS.map((step, i) => (
                  <div key={step.title} className="flex gap-3">
                    <div className="shrink-0 w-9 h-9 rounded-full bg-coral/10 flex items-center justify-center">
                      <step.icon size={18} className="text-coral" />
                    </div>
                    <div>
                      <h3 className="font-medium text-teal text-sm mb-0.5">
                        {i + 1}. {step.title}
                      </h3>
                      <p className="text-sm text-teal/70 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="text-center mt-10 md:mt-12 text-teal/60 flex items-center justify-center gap-2 text-sm">
          <Heart size={14} className="text-coral" aria-hidden="true" />
          Thank you for trusting Ella with your story.
        </p>
      </LayoutContainer>
    </section>
  );
}
