import { BrandStatement } from "@/components/home/BrandStatement";
import { EditorialStory } from "@/components/home/EditorialStory";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Hero } from "@/components/home/Hero";
import { HomeCTA } from "@/components/home/HomeCTA";
import { TrustStrip } from "@/components/home/TrustStrip";
import { listProducts } from "@/lib/cart";

export default async function HomePage() {
  let products: Awaited<ReturnType<typeof listProducts>>["products"] = [];
  try {
    const result = await listProducts({ limit: 8 });
    products = result.products;
  } catch {
    products = [];
  }

  return (
    <>
      <Hero />
      <BrandStatement />
      <FeaturedProducts products={products} />
      <TrustStrip />
      <EditorialStory />
      <HomeCTA />
    </>
  );
}
