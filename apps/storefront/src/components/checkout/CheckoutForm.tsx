"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { HttpTypes } from "@medusajs/types";
import { clsx } from "clsx";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  addShippingMethod,
  getCheckoutRedirectUrl,
  listShippingOptions,
  updateCart,
} from "@/lib/cart";
import { formatMoney } from "@/lib/format";
import { sdk } from "@/lib/medusa";

type AddressForm = {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2: string;
  city: string;
  postal_code: string;
  country_code: string;
  phone: string;
};

const emptyAddress: AddressForm = {
  first_name: "",
  last_name: "",
  address_1: "",
  address_2: "",
  city: "",
  postal_code: "",
  country_code: "nl",
  phone: "",
};

function providerLabel(id: string) {
  if (id.includes("mollie")) {
    if (id.includes("ideal")) return "iDEAL (Mollie)";
    if (id.includes("card")) return "Card (Mollie)";
    if (id.includes("paypal")) return "PayPal (Mollie)";
    if (id.includes("bancontact")) return "Bancontact (Mollie)";
    if (id.includes("apple")) return "Apple Pay (Mollie)";
    if (id.includes("giftcard")) return "Gift card (Mollie)";
    return "Mollie";
  }
  if (id.includes("system")) return "Manual / test payment";
  return id;
}

export function CheckoutForm() {
  const router = useRouter();
  const { cart, refreshCart, clearCart, loading: cartLoading } = useCart();
  const { customer } = useAuth();

  const [email, setEmail] = useState("");
  const [address, setAddress] = useState<AddressForm>(emptyAddress);
  const [shippingOptions, setShippingOptions] = useState<
    HttpTypes.StoreCartShippingOption[]
  >([]);
  const [selectedShipping, setSelectedShipping] = useState("");
  const [paymentProviders, setPaymentProviders] = useState<
    HttpTypes.StorePaymentProvider[]
  >([]);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [giftCardCode, setGiftCardCode] = useState("");
  const [stepError, setStepError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (customer?.email) setEmail(customer.email);
  }, [customer]);

  useEffect(() => {
    async function bootstrap() {
      if (!cart?.id) return;
      setReady(false);
      setStepError(null);
      try {
        const options = await listShippingOptions(cart.id);
        setShippingOptions(options);
        if (options[0]?.id) {
          setSelectedShipping((prev) => prev || options[0].id);
        }

        if (cart.region_id) {
          const { payment_providers } =
            await sdk.store.payment.listPaymentProviders({
              region_id: cart.region_id,
            });
          const providers = payment_providers || [];
          // Ensure system fallback appears even if only Mollie is returned
          const hasSystem = providers.some((p) =>
            p.id.includes("system_default")
          );
          const nextProviders = hasSystem
            ? providers
            : [
                ...providers,
                { id: "pp_system_default" } as HttpTypes.StorePaymentProvider,
              ];
          setPaymentProviders(nextProviders);
          setSelectedPayment((prev) => prev || nextProviders[0]?.id || "");
        }
      } catch (err) {
        setStepError(
          err instanceof Error ? err.message : "Unable to prepare checkout."
        );
      } finally {
        setReady(true);
      }
    }
    void bootstrap();
  }, [cart?.id, cart?.region_id]);

  const currency = cart?.currency_code || "eur";
  const items = cart?.items || [];

  const canPlace = useMemo(
    () =>
      Boolean(
        email &&
          address.first_name &&
          address.last_name &&
          address.address_1 &&
          address.city &&
          address.postal_code &&
          address.country_code &&
          selectedShipping &&
          selectedPayment &&
          items.length
      ),
    [email, address, selectedShipping, selectedPayment, items.length]
  );

  async function applyDiscount() {
    if (!discountCode.trim() || !cart) return;
    setStepError(null);
    try {
      await updateCart({
        promo_codes: [discountCode.trim()],
      });
      await refreshCart();
    } catch (err) {
      setStepError(
        err instanceof Error ? err.message : "Discount code could not be applied."
      );
    }
  }

  async function applyGiftCard() {
    if (!giftCardCode.trim() || !cart) return;
    setStepError(null);
    try {
      // Medusa gift cards may map to promotions depending on setup
      await updateCart({
        promo_codes: [giftCardCode.trim()],
      });
      await refreshCart();
      setStepError(null);
    } catch (err) {
      setStepError(
        err instanceof Error
          ? err.message
          : "Gift card could not be applied. It will be noted for support if checkout continues."
      );
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!cart || !canPlace) return;
    setSubmitting(true);
    setStepError(null);

    try {
      await updateCart({
        email,
        shipping_address: {
          first_name: address.first_name,
          last_name: address.last_name,
          address_1: address.address_1,
          address_2: address.address_2 || undefined,
          city: address.city,
          postal_code: address.postal_code,
          country_code: address.country_code,
          phone: address.phone || undefined,
        },
        billing_address: {
          first_name: address.first_name,
          last_name: address.last_name,
          address_1: address.address_1,
          address_2: address.address_2 || undefined,
          city: address.city,
          postal_code: address.postal_code,
          country_code: address.country_code,
          phone: address.phone || undefined,
        },
      });

      await addShippingMethod(selectedShipping);
      const refreshed = await refreshCart().then(async () => {
        const { cart: latest } = await sdk.store.cart.retrieve(cart.id);
        return latest;
      });

      const { payment_collection } =
        await sdk.store.payment.initiatePaymentSession(refreshed, {
          provider_id: selectedPayment,
          data: giftCardCode.trim()
            ? { gift_card_code: giftCardCode.trim() }
            : undefined,
        });

      const session = payment_collection?.payment_sessions?.find(
        (s) => s.provider_id === selectedPayment
      ) || payment_collection?.payment_sessions?.[0];

      const redirectUrl = getCheckoutRedirectUrl(
        session?.data as Record<string, unknown> | undefined
      );

      if (redirectUrl) {
        window.location.href = redirectUrl;
        return;
      }

      // System / non-redirect providers: complete immediately
      const result = await sdk.store.cart.complete(cart.id);
      if (result.type === "order" && result.order) {
        clearCart();
        router.push(`/checkout/confirmation?order_id=${result.order.id}`);
        return;
      }

      // Mollie path without immediate redirect — go to payment return handler
      router.push("/checkout/payment");
    } catch (err) {
      setStepError(
        err instanceof Error ? err.message : "Checkout failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (cartLoading || !ready) {
    return (
      <div className="flex items-center gap-3 py-16">
        <Spinner />
        <span className="text-sm text-[var(--color-muted)]">
          Preparing checkout…
        </span>
      </div>
    );
  }

  if (!items.length) {
    return (
      <p className="py-16 text-sm text-[var(--color-muted)]">
        Your bag is empty.{" "}
        <a href="/shop" className="underline">
          Continue shopping
        </a>
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-10">
        <section className="space-y-4">
          <h2 className="font-[family-name:var(--font-serif)] text-2xl">
            Contact
          </h2>
          <Input
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </section>

        <section className="space-y-4">
          <h2 className="font-[family-name:var(--font-serif)] text-2xl">
            Shipping address
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="First name"
              required
              value={address.first_name}
              onChange={(e) =>
                setAddress((a) => ({ ...a, first_name: e.target.value }))
              }
            />
            <Input
              label="Last name"
              required
              value={address.last_name}
              onChange={(e) =>
                setAddress((a) => ({ ...a, last_name: e.target.value }))
              }
            />
          </div>
          <Input
            label="Address"
            required
            value={address.address_1}
            onChange={(e) =>
              setAddress((a) => ({ ...a, address_1: e.target.value }))
            }
          />
          <Input
            label="Apartment, suite, etc."
            value={address.address_2}
            onChange={(e) =>
              setAddress((a) => ({ ...a, address_2: e.target.value }))
            }
          />
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              label="City"
              required
              value={address.city}
              onChange={(e) =>
                setAddress((a) => ({ ...a, city: e.target.value }))
              }
            />
            <Input
              label="Postal code"
              required
              value={address.postal_code}
              onChange={(e) =>
                setAddress((a) => ({ ...a, postal_code: e.target.value }))
              }
            />
            <label className="flex w-full flex-col gap-2">
              <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
                Country
              </span>
              <select
                className="h-11 rounded-[6px] border border-[var(--color-border)] bg-white px-3 text-sm"
                value={address.country_code}
                onChange={(e) =>
                  setAddress((a) => ({ ...a, country_code: e.target.value }))
                }
              >
                <option value="nl">Netherlands</option>
                <option value="be">Belgium</option>
                <option value="gb">United Kingdom</option>
                <option value="de">Germany</option>
                <option value="fr">France</option>
                <option value="es">Spain</option>
                <option value="it">Italy</option>
                <option value="dk">Denmark</option>
                <option value="se">Sweden</option>
              </select>
            </label>
          </div>
          <Input
            label="Phone"
            value={address.phone}
            onChange={(e) =>
              setAddress((a) => ({ ...a, phone: e.target.value }))
            }
          />
        </section>

        <section className="space-y-4">
          <h2 className="font-[family-name:var(--font-serif)] text-2xl">
            Shipping method
          </h2>
          <div className="space-y-3">
            {shippingOptions.length === 0 ? (
              <p className="text-sm text-[var(--color-muted)]">
                No shipping options available for this address yet.
              </p>
            ) : (
              shippingOptions.map((option) => (
                <label
                  key={option.id}
                  className={clsx(
                    "flex cursor-pointer items-center justify-between border px-4 py-3",
                    selectedShipping === option.id
                      ? "border-[var(--color-accent)] bg-[var(--color-blush)]"
                      : "border-[var(--color-border)]"
                  )}
                >
                  <span className="flex items-center gap-3 text-sm">
                    <input
                      type="radio"
                      name="shipping"
                      checked={selectedShipping === option.id}
                      onChange={() => setSelectedShipping(option.id)}
                    />
                    {option.name}
                  </span>
                  <span className="text-sm">
                    {formatMoney(option.amount, currency)}
                  </span>
                </label>
              ))
            )}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-[family-name:var(--font-serif)] text-2xl">
            Discounts & gift cards
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex gap-2">
              <Input
                label="Discount code"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
              />
              <Button
                type="button"
                variant="secondary"
                className="mt-7"
                onClick={() => void applyDiscount()}
              >
                Apply
              </Button>
            </div>
            <div className="flex gap-2">
              <Input
                label="Gift card"
                value={giftCardCode}
                onChange={(e) => setGiftCardCode(e.target.value)}
              />
              <Button
                type="button"
                variant="secondary"
                className="mt-7"
                onClick={() => void applyGiftCard()}
              >
                Apply
              </Button>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-[family-name:var(--font-serif)] text-2xl">
            Payment
          </h2>
          <div className="space-y-3">
            {paymentProviders.map((provider) => (
              <label
                key={provider.id}
                className={clsx(
                  "flex cursor-pointer items-center gap-3 border px-4 py-3 text-sm",
                  selectedPayment === provider.id
                    ? "border-[var(--color-accent)] bg-[var(--color-blush)]"
                    : "border-[var(--color-border)]"
                )}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={selectedPayment === provider.id}
                  onChange={() => setSelectedPayment(provider.id)}
                />
                {providerLabel(provider.id)}
              </label>
            ))}
          </div>
        </section>

        {stepError ? (
          <p className="text-sm text-red-700">{stepError}</p>
        ) : null}

        <Button type="submit" size="lg" loading={submitting} disabled={!canPlace}>
          Place order
        </Button>
      </div>

      <aside className="h-fit border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <h2 className="font-[family-name:var(--font-serif)] text-2xl">
          Order summary
        </h2>
        <ul className="mt-6 space-y-4">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between gap-4 text-sm">
              <span>
                {item.product_title || item.title} × {item.quantity}
              </span>
              <span>{formatMoney(item.total, currency)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 space-y-2 border-t border-[var(--color-border)] pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--color-muted)]">Subtotal</span>
            <span>{formatMoney(cart?.subtotal, currency)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--color-muted)]">Shipping</span>
            <span>{formatMoney(cart?.shipping_total, currency)}</span>
          </div>
          <div className="flex justify-between text-base">
            <span>Total</span>
            <span>{formatMoney(cart?.total, currency)}</span>
          </div>
        </div>
      </aside>
    </form>
  );
}
