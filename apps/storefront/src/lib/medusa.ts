import Medusa from "@medusajs/js-sdk";
import {
  MEDUSA_BACKEND_URL,
  PUBLISHABLE_KEY,
} from "@/lib/constants";

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  publishableKey: PUBLISHABLE_KEY,
  debug: process.env.NODE_ENV === "development",
});

export function getAuthHeaders(token?: string | null): Record<string, string> {
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}
