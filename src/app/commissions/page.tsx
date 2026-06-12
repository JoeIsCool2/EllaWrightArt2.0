import type { Metadata } from "next";
import { Heart } from "lucide-react";
import { LayoutContainer } from "@/components/layout/LayoutContainer";
import { CommissionForm } from "@/components/forms/CommissionForm";
import { CommissionHero } from "@/components/commissions/CommissionHero";
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

export default function CommissionsPage() {
  return (
    <section className="relative py-5 md:py-8 lg:py-10 overflow-x-hidden">
      <WatercolorAccents />
      <LayoutContainer className="relative">
        <div className="flex flex-col gap-6 md:gap-8 lg:grid lg:grid-cols-12 lg:gap-x-10 lg:gap-y-6 lg:items-start">
          <CommissionHero className="order-1 lg:col-span-7 lg:col-start-1 lg:row-start-1" />

          <CommissionSidebar className="order-2 lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:row-span-2" />

          <div className="order-3 lg:col-span-7 lg:col-start-1 lg:row-start-2">
            <CommissionForm />
          </div>
        </div>

        <p className="text-center mt-8 md:mt-10 text-teal/55 flex items-center justify-center gap-2 text-sm">
          <Heart size={14} className="text-coral shrink-0" aria-hidden="true" />
          Thank you for trusting Ella with your story.
        </p>
      </LayoutContainer>
    </section>
  );
}
