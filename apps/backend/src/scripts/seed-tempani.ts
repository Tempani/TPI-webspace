import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createCollectionsWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"

/**
 * Seeds Tempani-branded catalogue data on top of the default Medusa seed.
 * Safe to re-run: skips creating products that already exist by handle.
 */
export default async function seedTempani({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const regionModule = container.resolve(Modules.REGION)
  const paymentModule = container.resolve(Modules.PAYMENT)

  logger.info("Updating Tempani store branding...")

  const { data: stores } = await query.graph({
    entity: "store",
    fields: ["id", "name"],
  })

  if (stores?.[0]?.id) {
    await updateStoresWorkflow(container).run({
      input: {
        selector: { id: stores[0].id },
        update: {
          name: "Tempani",
          supported_currencies: [
            { currency_code: "eur", is_default: true },
            { currency_code: "usd", is_default: false },
          ],
        },
      },
    })
  }

  // Enable Mollie + system payment providers on Europe region when available
  const regions = await regionModule.listRegions({}, { relations: ["payment_providers"] })
  const providers = await paymentModule.listPaymentProviders({ is_enabled: true })
  const providerIds = providers.map((p: { id: string }) => p.id)

  for (const region of regions) {
    const desired = [
      "pp_system_default",
      ...providerIds.filter((id: string) => id.includes("mollie")),
    ].filter((id, index, arr) => arr.indexOf(id) === index)

    // Attach NL/BE for Mollie methods (iDEAL / Bancontact)
    await regionModule.updateRegions(region.id, {
      payment_providers: desired,
      countries: [
        "nl",
        "be",
        "gb",
        "de",
        "dk",
        "se",
        "fr",
        "es",
        "it",
      ],
    })
    logger.info(
      `Region ${region.name}: payment providers → ${desired.join(", ")}`
    )
  }

  // Ensure Tempani categories exist
  const { data: existingCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name", "handle"],
  })

  const neededCategories = [
    { name: "Red Wine", handle: "red-wine" },
    { name: "White Wine", handle: "white-wine" },
    { name: "Sparkling", handle: "sparkling" },
    { name: "Lifestyle", handle: "lifestyle" },
  ]

  const missingCategories = neededCategories.filter(
    (c) =>
      !existingCategories?.some(
        (e: { handle?: string; name?: string }) =>
          e.handle === c.handle || e.name === c.name
      )
  )

  let categoryMap: Record<string, string> = {}
  for (const cat of existingCategories || []) {
    if (cat.handle) categoryMap[cat.handle] = cat.id
    if (cat.name) categoryMap[cat.name.toLowerCase()] = cat.id
  }

  if (missingCategories.length) {
    const { result } = await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: missingCategories.map((c) => ({
          name: c.name,
          handle: c.handle,
          is_active: true,
        })),
      },
    })
    for (const cat of result) {
      categoryMap[cat.handle] = cat.id
    }
  }

  // Collection
  const { data: existingCollections } = await query.graph({
    entity: "product_collection",
    fields: ["id", "handle"],
  })

  let collectionId =
    existingCollections?.find((c: { handle?: string }) => c.handle === "estate-selection")
      ?.id

  if (!collectionId) {
    const { result } = await createCollectionsWorkflow(container).run({
      input: {
        collections: [
          {
            title: "Estate Selection",
            handle: "estate-selection",
          },
        ],
      },
    })
    collectionId = result[0].id
  }

  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  })
  const shippingProfileId = shippingProfiles?.[0]?.id

  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id"],
  })
  const salesChannelId = salesChannels?.[0]?.id

  const { data: existingProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
  })
  const existingHandles = new Set(
    (existingProducts || []).map((p: { handle?: string }) => p.handle)
  )

  const wineProducts = [
    {
      title: "Tempani Estate Cabernet",
      handle: "tempani-estate-cabernet",
      description:
        "A composed Cabernet with dark cherry, cedar, and a long mineral finish. Sourced from hillside parcels and aged with quiet restraint.",
      category: "red-wine",
      price: 4800,
      image:
        "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Fiesole Blanc",
      handle: "fiesole-blanc",
      description:
        "Crisp orchard fruit and citrus peel over fine acidity. An elegant white for long lunches and cool evenings.",
      category: "white-wine",
      price: 3600,
      image:
        "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Noir Rosé",
      handle: "noir-rose",
      description:
        "Pale, precise, and quietly festive. Wild strawberry and rose petal with a dry, saline close.",
      category: "sparkling",
      price: 4200,
      image:
        "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Linen Service Set",
      handle: "linen-service-set",
      description:
        "Stone-washed linen napkins and a table runner in warm ivory. Soft structure for everyday ceremony.",
      category: "lifestyle",
      price: 8900,
      image:
        "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1200&q=80",
    },
  ]

  const toCreate = wineProducts.filter((p) => !existingHandles.has(p.handle))

  if (toCreate.length) {
    logger.info(`Creating ${toCreate.length} Tempani products...`)
    const { result: products } = await createProductsWorkflow(container).run({
      input: {
        products: toCreate.map((p) => ({
          title: p.title,
          handle: p.handle,
          description: p.description,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfileId,
          collection_id: collectionId,
          category_ids: categoryMap[p.category]
            ? [categoryMap[p.category]]
            : [],
          sales_channels: salesChannelId
            ? [{ id: salesChannelId }]
            : undefined,
          images: [{ url: p.image }],
          options: [{ title: "Size", values: ["750ml"] }],
          variants: [
            {
              title: "750ml",
              sku: p.handle.toUpperCase().replace(/-/g, "_"),
              options: { Size: "750ml" },
              prices: [
                { amount: p.price, currency_code: "eur" },
                { amount: Math.round(p.price * 1.1), currency_code: "usd" },
              ],
              manage_inventory: true,
            },
          ],
        })),
      },
    })

    // Inventory levels
    const { data: stockLocations } = await query.graph({
      entity: "stock_location",
      fields: ["id"],
    })
    const locationId = stockLocations?.[0]?.id

    if (locationId) {
      const inventoryItems: { inventory_item_id: string; location_id: string; stocked_quantity: number }[] = []
      for (const product of products) {
        for (const variant of product.variants || []) {
          const { data: variantInventory } = await query.graph({
            entity: "product_variant",
            fields: ["id", "inventory_items.inventory_item_id"],
            filters: { id: variant.id },
          })
          const invId =
            variantInventory?.[0]?.inventory_items?.[0]?.inventory_item_id
          if (invId) {
            inventoryItems.push({
              inventory_item_id: invId,
              location_id: locationId,
              stocked_quantity: 100,
            })
          }
        }
      }
      if (inventoryItems.length) {
        await createInventoryLevelsWorkflow(container).run({
          input: { inventory_levels: inventoryItems },
        })
      }
    }
  } else {
    logger.info("Tempani products already present — skipping create.")
  }

  // Soft-rebrand default Medusa demo products if still present
  const productModule = container.resolve(Modules.PRODUCT)
  const renames: Record<string, { title: string; description: string }> = {
    "t-shirt": {
      title: "Tempani Cotton Tee",
      description: "A soft everyday tee with a quiet Tempani mark.",
    },
    sweatshirt: {
      title: "Estate Sweatshirt",
      description: "Heavyweight cotton with a restrained silhouette.",
    },
    sweatpants: {
      title: "Atelier Trousers",
      description: "Relaxed trousers for travel and late dinners.",
    },
    shorts: {
      title: "Terrace Shorts",
      description: "Light shorts for warm harvest days.",
    },
  }

  for (const [handle, data] of Object.entries(renames)) {
    const match = existingProducts?.find(
      (p: { handle?: string }) => p.handle === handle
    )
    if (match?.id) {
      await productModule.updateProducts(match.id, {
        title: data.title,
        description: data.description,
      })
    }
  }

  logger.info("Tempani seed completed.")
}
