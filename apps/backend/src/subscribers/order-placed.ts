import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

/**
 * Sends a local email/feed notification when an order is placed.
 * Swap the local notification provider for Resend/SendGrid/etc. in production.
 */
export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const notificationModule = container.resolve(Modules.NOTIFICATION)
  const query = container.resolve("query")

  const { data: orders } = await query.graph({
    entity: "order",
    fields: ["id", "email", "display_id", "total", "currency_code"],
    filters: { id: data.id },
  })

  const order = orders?.[0]
  if (!order?.email) {
    return
  }

  await notificationModule.createNotifications({
    to: order.email,
    channel: "email",
    template: "order-placed",
    data: {
      order_id: order.id,
      display_id: order.display_id,
      total: order.total,
      currency_code: order.currency_code,
      subject: `Tempani — order #${order.display_id} confirmed`,
      body: `Thank you for your order #${order.display_id}. We are preparing it with care.`,
    },
  })
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
