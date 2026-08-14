"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { HttpTypes } from "@medusajs/types";
import {
  addLineItem,
  ensureCart,
  removeLineItem,
  setStoredCartId,
  updateCart as updateCartApi,
  updateLineItem,
} from "@/lib/cart";

type CartContextValue = {
  cart: HttpTypes.StoreCart | null;
  loading: boolean;
  itemCount: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  refreshCart: () => Promise<void>;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  updateCartData: (data: HttpTypes.StoreUpdateCart) => Promise<HttpTypes.StoreCart>;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<HttpTypes.StoreCart | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const refreshCart = useCallback(async () => {
    try {
      const next = await ensureCart();
      setCart(next);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshCart();
  }, [refreshCart]);

  const addItem = useCallback(
    async (variantId: string, quantity = 1) => {
      const next = await addLineItem(variantId, quantity);
      setCart(next);
      setIsDrawerOpen(true);
    },
    []
  );

  const updateItem = useCallback(async (lineId: string, quantity: number) => {
    const next = await updateLineItem(lineId, quantity);
    setCart(next);
  }, []);

  const removeItem = useCallback(async (lineId: string) => {
    const next = await removeLineItem(lineId);
    setCart(next);
  }, []);

  const updateCartData = useCallback(
    async (data: HttpTypes.StoreUpdateCart) => {
      const next = await updateCartApi(data);
      setCart(next);
      return next;
    },
    []
  );

  const clearCart = useCallback(() => {
    setStoredCartId(null);
    setCart(null);
  }, []);

  const itemCount = useMemo(
    () =>
      cart?.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0,
    [cart]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      loading,
      itemCount,
      isDrawerOpen,
      openDrawer: () => setIsDrawerOpen(true),
      closeDrawer: () => setIsDrawerOpen(false),
      refreshCart,
      addItem,
      updateItem,
      removeItem,
      updateCartData,
      clearCart,
    }),
    [
      cart,
      loading,
      itemCount,
      isDrawerOpen,
      refreshCart,
      addItem,
      updateItem,
      removeItem,
      updateCartData,
      clearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
