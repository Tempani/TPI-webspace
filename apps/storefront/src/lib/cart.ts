import type { HttpTypes } from "@medusajs/types";
import { sdk } from "@/lib/medusa";
import {
  CART_FIELDS,
  CART_ID_KEY,
  PRODUCT_FIELDS,
  REGION_ID_KEY,
} from "@/lib/constants";

export function getStoredCartId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CART_ID_KEY);
}

export function setStoredCartId(id: string | null) {
  if (typeof window === "undefined") return;
  if (!id) {
    localStorage.removeItem(CART_ID_KEY);
    return;
  }
  localStorage.setItem(CART_ID_KEY, id);
}

export function getStoredRegionId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REGION_ID_KEY);
}

export function setStoredRegionId(id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(REGION_ID_KEY, id);
}

export async function listRegions() {
  const { regions } = await sdk.store.region.list({ limit: 50 });
  return regions;
}

export async function ensureRegionId(): Promise<string> {
  const stored = getStoredRegionId();
  if (stored) return stored;

  const regions = await listRegions();
  const region = regions[0];
  if (!region?.id) {
    throw new Error("No sales region is available.");
  }
  setStoredRegionId(region.id);
  return region.id;
}

export async function retrieveCart(
  cartId: string
): Promise<HttpTypes.StoreCart> {
  const { cart } = await sdk.store.cart.retrieve(cartId, {
    fields: CART_FIELDS,
  });
  return cart;
}

export async function createCart(
  regionId?: string
): Promise<HttpTypes.StoreCart> {
  const region_id = regionId || (await ensureRegionId());
  const { cart } = await sdk.store.cart.create(
    { region_id },
    { fields: CART_FIELDS }
  );
  setStoredCartId(cart.id);
  return cart;
}

export async function ensureCart(): Promise<HttpTypes.StoreCart> {
  const existingId = getStoredCartId();
  if (existingId) {
    try {
      return await retrieveCart(existingId);
    } catch {
      setStoredCartId(null);
    }
  }
  return createCart();
}

export async function addLineItem(
  variantId: string,
  quantity = 1
): Promise<HttpTypes.StoreCart> {
  const cart = await ensureCart();
  const { cart: updated } = await sdk.store.cart.createLineItem(
    cart.id,
    { variant_id: variantId, quantity },
    { fields: CART_FIELDS }
  );
  setStoredCartId(updated.id);
  return updated;
}

export async function updateLineItem(
  lineId: string,
  quantity: number
): Promise<HttpTypes.StoreCart> {
  const cartId = getStoredCartId();
  if (!cartId) throw new Error("No cart found.");
  const { cart } = await sdk.store.cart.updateLineItem(
    cartId,
    lineId,
    { quantity },
    { fields: CART_FIELDS }
  );
  return cart;
}

export async function removeLineItem(
  lineId: string
): Promise<HttpTypes.StoreCart> {
  const cartId = getStoredCartId();
  if (!cartId) throw new Error("No cart found.");
  const { parent: cart } = await sdk.store.cart.deleteLineItem(cartId, lineId, {
    fields: CART_FIELDS,
  });
  return cart as HttpTypes.StoreCart;
}

export async function updateCart(
  data: HttpTypes.StoreUpdateCart
): Promise<HttpTypes.StoreCart> {
  const cartId = getStoredCartId();
  if (!cartId) throw new Error("No cart found.");
  const { cart } = await sdk.store.cart.update(cartId, data, {
    fields: CART_FIELDS,
  });
  return cart;
}

export async function addShippingMethod(
  optionId: string
): Promise<HttpTypes.StoreCart> {
  const cartId = getStoredCartId();
  if (!cartId) throw new Error("No cart found.");
  const { cart } = await sdk.store.cart.addShippingMethod(
    cartId,
    { option_id: optionId },
    { fields: CART_FIELDS }
  );
  return cart;
}

export async function listShippingOptions(cartId: string) {
  const { shipping_options } =
    await sdk.store.fulfillment.listCartOptions({ cart_id: cartId });
  return shipping_options;
}

export async function completeCart() {
  const cartId = getStoredCartId();
  if (!cartId) throw new Error("No cart found.");
  return sdk.store.cart.complete(cartId, { fields: "*order,*order.items" });
}

export async function listProducts(
  query: Record<string, unknown> = {}
): Promise<{
  products: HttpTypes.StoreProduct[];
  count: number;
}> {
  const region_id = await ensureRegionId().catch(() => undefined);
  const { products, count } = await sdk.store.product.list({
    fields: PRODUCT_FIELDS,
    region_id,
    limit: 24,
    ...query,
  });
  return { products, count: count ?? products.length };
}

export async function retrieveProductByHandle(
  handle: string
): Promise<HttpTypes.StoreProduct | null> {
  const region_id = await ensureRegionId().catch(() => undefined);
  const { products } = await sdk.store.product.list({
    handle,
    fields: PRODUCT_FIELDS,
    region_id,
    limit: 1,
  });
  return products[0] ?? null;
}

export async function listCategories() {
  const { product_categories } = await sdk.store.category.list({
    limit: 50,
  });
  return product_categories;
}

export async function retrieveCategoryByHandle(handle: string) {
  const { product_categories } = await sdk.store.category.list({
    handle,
    limit: 1,
  });
  return product_categories[0] ?? null;
}

export function getCheckoutRedirectUrl(
  sessionData: Record<string, unknown> | null | undefined
): string | null {
  if (!sessionData) return null;

  const direct =
    (sessionData.checkout_url as string | undefined) ||
    (sessionData.redirect_url as string | undefined) ||
    (sessionData.redirectUrl as string | undefined);
  if (direct) return direct;

  const links = sessionData._links as
    | { checkout?: { href?: string } }
    | undefined;
  if (links?.checkout?.href) return links.checkout.href;

  return null;
}
