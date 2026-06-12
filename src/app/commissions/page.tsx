import type { Metadata } from "next";
import { Heart } from "lucide-react";
import { getFeaturedArtwork } from "@/lib/artworks/service";
import { LayoutContainer } from "@/components/layout/LayoutContainer";
import { CommissionForm } from "@/components/forms/CommissionForm";
import { CommissionPageHeader } from "@/components/commissions/CommissionPageHeader";
import { CommissionSidebar } from "@/components/commissions/CommissionSidebar";
import { WatercolorAccents } from "@/components/home/WatercolorAccents";

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

export default async function CommissionsPage() {
  const featured = await getFeaturedArtwork();

  return (
    <section className="relative py-6 md:py-10 lg:py-12 overflow-x-hidden">
      <WatercolorAccents />
      <LayoutContainer className="relative">
        <CommissionPageHeader className="mb-6 md:mb-8" />

        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-12 lg:gap-x-10 lg:gap-y-0 lg:items-start">
          <aside className="order-2 lg:col-span-5 lg:col-start-8 lg:row-start-1">
            <CommissionSidebar artwork={featured} />
          </aside>

          <div className="order-3 lg:col-span-7 lg:col-start-1 lg:row-start-1">
            <CommissionForm />
          </div>
        </div>

        <p className="text-center mt-10 md:mt-12 text-teal/55 flex items-center justify-center gap-2 text-sm">
          <Heart size={14} className="text-coral shrink-0" aria-hidden="true" />
          Thank you for trusting Ella with your story.
        </p>
      </LayoutContainer>
    </section>
  );
}
