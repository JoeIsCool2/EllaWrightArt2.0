import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { sanitizeText, LIMITS } from "@/lib/validation";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { EMAIL, INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/constants";
import { getFeaturedArtwork } from "@/lib/artworks/service";
import { LayoutContainer } from "@/components/layout/LayoutContainer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ContactForm } from "@/components/forms/ContactForm";
import { FeaturedArtworkFrame } from "@/components/artwork/FeaturedArtworkFrame";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Ella Wright for artwork inquiries, commissions, and purchases.",
  openGraph: {
    title: "Contact | EllaWrightsArt",
    description:
      "Contact Ella Wright for artwork inquiries, commissions, and purchases.",
  },
};

interface ContactPageProps {
  searchParams: Promise<{ subject?: string }>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams;
  const defaultSubject = sanitizeText(params.subject, LIMITS.subject);
  const featured = await getFeaturedArtwork();

  return (
    <section className="py-8 md:py-12 relative overflow-hidden">
      <LayoutContainer>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div>
            <SectionHeader title="Contact Ella" className="mb-5 md:mb-6" />
            <p className="text-teal/80 text-base md:text-lg mb-6 -mt-2">
              For artwork inquiries, commissions, and purchases, reach out below.
            </p>

            <div className="space-y-4 mb-8">
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center gap-4 group"
              >
                <div className="w-11 h-11 rounded-full bg-coral flex items-center justify-center shrink-0">
                  <Mail size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-medium text-teal text-sm">Email</p>
                  <p className="text-teal/70 group-hover:text-coral transition-colors text-sm md:text-base">
                    {EMAIL}
                  </p>
                </div>
              </a>

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group"
              >
                <div className="w-11 h-11 rounded-full bg-coral flex items-center justify-center shrink-0">
                  <InstagramIcon size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-medium text-teal text-sm">Instagram</p>
                  <p className="text-teal/70 group-hover:text-coral transition-colors text-sm md:text-base">
                    {INSTAGRAM_HANDLE}
                  </p>
                </div>
              </a>
            </div>

            <ContactForm defaultSubject={defaultSubject} />
          </div>

          <div className="hidden lg:block sticky top-24">
            <FeaturedArtworkFrame
              artwork={featured}
              sizes="360px"
              maxWidthClass="max-w-[320px] mx-auto"
            />
          </div>
        </div>

        <div className="text-center mt-10 md:mt-12 py-6 border-t border-teal/10">
          <p className="font-serif text-lg md:text-xl text-teal mb-1">
            Thank you for supporting art that nurtures the soul.
          </p>
          <p className="text-teal/60 text-sm md:text-base">
            I look forward to connecting with you.
          </p>
        </div>
      </LayoutContainer>
    </section>
  );
}
