import { WISHLIST_KEY } from "@/lib/constants";

export type WishlistItem = {
  id: string;
  handle: string;
  title: string;
  thumbnail?: string | null;
  priceLabel?: string;
};

export function getWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as WishlistItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveWishlist(items: WishlistItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("tempani:wishlist"));
}

export function isInWishlist(productId: string): boolean {
  return getWishlist().some((item) => item.id === productId);
}

export function toggleWishlistItem(item: WishlistItem): WishlistItem[] {
  const current = getWishlist();
  const exists = current.some((entry) => entry.id === item.id);
  const next = exists
    ? current.filter((entry) => entry.id !== item.id)
    : [...current, item];
  saveWishlist(next);
  return next;
}

export function removeWishlistItem(productId: string): WishlistItem[] {
  const next = getWishlist().filter((item) => item.id !== productId);
  saveWishlist(next);
  return next;
}
