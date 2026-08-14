import type { MetadataRoute } from "next";
import { listProducts } from "@/lib/cart";
import { SITE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/shop",
    "/search",
    "/cart",
    "/wishlist",
    "/account/login",
    "/account/register",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const { products } = await listProducts({ limit: 100 });
    productRoutes = products
      .filter((product) => product.handle)
      .map((product) => ({
        url: `${SITE_URL}/products/${product.handle}`,
        lastModified: new Date(),
      }));
  } catch {
    productRoutes = [];
  }

  return [...staticRoutes, ...productRoutes];
}
