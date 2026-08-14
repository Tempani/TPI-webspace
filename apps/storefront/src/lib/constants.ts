export const SITE_NAME = "Tempani";
export const SITE_TAGLINE = "Luxury wine & lifestyle, curated with restraint.";

export const CART_ID_KEY = "tempani_cart_id";
export const WISHLIST_KEY = "tempani_wishlist";
export const AUTH_TOKEN_KEY = "tempani_auth_token";
export const REGION_ID_KEY = "tempani_region_id";

export const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

export const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ||
  "pk_3c4605ca67d56fcfb9963b191a75306c4f20141d0047added31ded56300ad1d5";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80";

export const HERO_IMAGE =
  "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=2400&q=80";

export const EDITORIAL_IMAGE =
  "https://images.unsplash.com/photo-1474722883778-792e7990302f?auto=format&fit=crop&w=1600&q=80";

export const PRODUCT_FIELDS =
  "*variants.calculated_price,*variants.prices,*images,*options,*categories,*collection,+metadata";

export const CART_FIELDS =
  "*items,*items.variant,*items.product,*region,*shipping_address,*billing_address,*shipping_methods,*payment_collection,*payment_collection.payment_sessions,+promotions";

export const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/categories/shirts", label: "Collection" },
  { href: "/search", label: "Search" },
  { href: "/wishlist", label: "Wishlist" },
] as const;
