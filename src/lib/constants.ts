export const SITE_NAME = "EllaWrightsArt";
export const SITE_DESCRIPTION =
  "Original oil paintings by Ella Wright exploring femininity, spirituality, motherhood, and landscapes from Alpine, Utah.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ellawrightsart.com";

export const EMAIL = "ellawright.artist@gmail.com";
export const INSTAGRAM_HANDLE = "@ellawright.art";
export const INSTAGRAM_URL = "https://www.instagram.com/ellawright.art/";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/commissions", label: "Commissions" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const GALLERY_CATEGORIES = [
  { id: "all", label: "All Artwork" },
  { id: "spiritual", label: "Spiritual" },
  { id: "landscapes", label: "Landscapes" },
  { id: "women-motherhood", label: "Women & Motherhood" },
  { id: "available", label: "Available Works" },
] as const;

export const ARTWORK_CATEGORIES = [
  { id: "spiritual", label: "Spiritual" },
  { id: "landscapes", label: "Landscapes" },
  { id: "women-motherhood", label: "Women & Motherhood" },
] as const;

export type GalleryCategoryId = (typeof GALLERY_CATEGORIES)[number]["id"];
export type ArtworkCategoryId = (typeof ARTWORK_CATEGORIES)[number]["id"];
