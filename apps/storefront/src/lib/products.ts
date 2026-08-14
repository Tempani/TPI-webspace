import type { HttpTypes } from "@medusajs/types";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { formatMoney, getVariantPrice } from "@/lib/format";

export function getProductThumbnail(
  product: HttpTypes.StoreProduct
): string {
  return (
    product.thumbnail ||
    product.images?.[0]?.url ||
    PLACEHOLDER_IMAGE
  );
}

export function getProductImages(
  product: HttpTypes.StoreProduct
): string[] {
  const urls = (product.images || [])
    .map((image) => image.url)
    .filter(Boolean) as string[];

  if (product.thumbnail && !urls.includes(product.thumbnail)) {
    urls.unshift(product.thumbnail);
  }

  return urls.length ? urls : [PLACEHOLDER_IMAGE];
}

export function getCheapestVariant(
  product: HttpTypes.StoreProduct
): HttpTypes.StoreProductVariant | undefined {
  const variants = product.variants || [];
  if (!variants.length) return undefined;

  return [...variants].sort((a, b) => {
    const pa = getVariantPrice(a).amount ?? Number.POSITIVE_INFINITY;
    const pb = getVariantPrice(b).amount ?? Number.POSITIVE_INFINITY;
    return pa - pb;
  })[0];
}

export function getProductPriceLabel(
  product: HttpTypes.StoreProduct
): string {
  const variant = getCheapestVariant(product);
  if (!variant) return "Price on request";
  const { amount, currency } = getVariantPrice(variant);
  return formatMoney(amount, currency);
}

export function sortProducts(
  products: HttpTypes.StoreProduct[],
  sort: string | undefined
): HttpTypes.StoreProduct[] {
  const copy = [...products];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => {
        const pa = getVariantPrice(getCheapestVariant(a) || {}).amount ?? 0;
        const pb = getVariantPrice(getCheapestVariant(b) || {}).amount ?? 0;
        return pa - pb;
      });
    case "price-desc":
      return copy.sort((a, b) => {
        const pa = getVariantPrice(getCheapestVariant(a) || {}).amount ?? 0;
        const pb = getVariantPrice(getCheapestVariant(b) || {}).amount ?? 0;
        return pb - pa;
      });
    case "title-asc":
      return copy.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    case "title-desc":
      return copy.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
    default:
      return copy;
  }
}
