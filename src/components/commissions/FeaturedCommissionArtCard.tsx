import Image from "next/image";

export const COMMISSION_FEATURE_IMAGE = "/artwork/commission-feature-art.png";
export const COMMISSION_FEATURE_ALT =
  "Custom commission artwork in Ella Wright's style";

export function FeaturedCommissionArtCard() {
  return (
    <figure className="bg-white rounded-2xl shadow-[var(--shadow-soft)] border border-teal/[0.06] overflow-hidden">
      <div className="p-3 md:p-4 bg-gradient-to-b from-cream/40 to-ivory">
        <div className="relative aspect-[4/5] rounded-xl overflow-hidden border border-teal/[0.05] bg-ivory shadow-[inset_0_1px_2px_rgba(13,59,63,0.04)]">
          <Image
            src={COMMISSION_FEATURE_IMAGE}
            alt={COMMISSION_FEATURE_ALT}
            fill
            sizes="(max-width: 1024px) 100vw, 400px"
            className="object-contain p-1"
            priority
          />
        </div>
      </div>
      <figcaption className="px-4 pb-4 pt-2 text-center border-t border-teal/[0.04]">
        <p className="text-sm text-teal/60 font-serif italic leading-relaxed">
          Custom artwork, created with care and meaning.
        </p>
      </figcaption>
    </figure>
  );
}
