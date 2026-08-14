import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/ProductGallery";
import { AddToCart } from "@/components/product/AddToCart";
import { Accordion } from "@/components/ui/Accordion";
import { WishlistButton } from "@/components/wishlist/WishlistButton";
import { retrieveProductByHandle } from "@/lib/cart";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { getProductImages, getProductPriceLabel } from "@/lib/products";

type Params = Promise<{ handle: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = await retrieveProductByHandle(handle).catch(() => null);
  if (!product) return { title: "Product" };

  return {
    title: product.title,
    description: product.description || `${product.title} from ${SITE_NAME}`,
    openGraph: {
      title: product.title || SITE_NAME,
      description: product.description || undefined,
      images: product.thumbnail ? [{ url: product.thumbnail }] : undefined,
      url: `${SITE_URL}/products/${product.handle}`,
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { handle } = await params;
  const product = await retrieveProductByHandle(handle).catch(() => null);
  if (!product) notFound();

  const images = getProductImages(product);
  const priceLabel = getProductPriceLabel(product);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: images,
    sku: product.variants?.[0]?.sku || product.id,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/products/${product.handle}`,
      name: priceLabel,
    },
  };

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-12 md:px-10 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={images} alt={product.title || "Product"} />
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
                {product.collection?.title || "Tempani"}
              </p>
              <h1 className="mt-2 font-[family-name:var(--font-serif)] text-4xl leading-tight text-[var(--color-ink)] md:text-5xl">
                {product.title}
              </h1>
            </div>
            <WishlistButton product={product} />
          </div>

          <div className="mt-8">
            <AddToCart product={product} />
          </div>

          {product.description ? (
            <p className="mt-8 text-sm leading-relaxed text-[var(--color-muted)] md:text-base">
              {product.description}
            </p>
          ) : null}

          <div className="mt-10">
            <Accordion
              items={[
                {
                  id: "details",
                  title: "Details",
                  content:
                    "Crafted for everyday ritual. Composition and finish may vary by variant — please review selected options before ordering.",
                },
                {
                  id: "shipping",
                  title: "Shipping & returns",
                  content:
                    "Ships within Europe. Returns accepted within 14 days for unused items in original condition.",
                },
                {
                  id: "care",
                  title: "Care",
                  content:
                    "Store away from direct heat. Follow any care notes included with your order.",
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
