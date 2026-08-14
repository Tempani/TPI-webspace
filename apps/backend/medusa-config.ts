import { loadEnv, defineConfig } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

/**
 * Tempani Medusa backend configuration.
 *
 * Database: Medusa v2 requires PostgreSQL (configure via DATABASE_URL).
 * The provided Turso/libSQL host is not compatible with Medusa's ORM —
 * keep TURSO_* env vars only for optional non-Medusa services.
 *
 * Mollie: registered when MOLLIE_API_KEY is set. Without it, the default
 * system payment provider remains available for local development.
 */
const mollieProviders =
  process.env.MOLLIE_API_KEY
    ? [
        {
          resolve: "@variablevic/mollie-payments-medusa/providers/mollie",
          id: "mollie",
          options: {
            apiKey: process.env.MOLLIE_API_KEY,
            redirectUrl:
              process.env.MOLLIE_REDIRECT_URL ||
              "http://localhost:3000/checkout/payment",
            medusaUrl: process.env.MEDUSA_URL || "http://localhost:9000",
            autoCapture: true,
            description: "Tempani order payment",
            debug: process.env.NODE_ENV === "development",
          },
        },
      ]
    : []

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  modules: [
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: mollieProviders,
      },
    },
    {
      resolve: "@medusajs/medusa/notification",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/notification-local",
            id: "local",
            options: {
              channels: ["email", "feed"],
            },
          },
        ],
      },
    },
  ],
})
