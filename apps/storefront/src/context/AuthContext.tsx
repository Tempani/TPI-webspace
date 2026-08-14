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
import { AUTH_TOKEN_KEY } from "@/lib/constants";
import { getAuthHeaders, sdk } from "@/lib/medusa";

type AuthContextValue = {
  customer: HttpTypes.StoreCustomer | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshCustomer: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function getStoredToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

function setStoredToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (!token) {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    return;
  }
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<HttpTypes.StoreCustomer | null>(
    null
  );
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshCustomer = useCallback(async () => {
    const stored = getStoredToken();
    if (!stored) {
      setCustomer(null);
      setToken(null);
      setLoading(false);
      return;
    }

    try {
      const { customer: next } = await sdk.store.customer.retrieve(
        undefined,
        getAuthHeaders(stored)
      );
      setCustomer(next);
      setToken(stored);
    } catch {
      setStoredToken(null);
      setCustomer(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshCustomer();
  }, [refreshCustomer]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await sdk.auth.login("customer", "emailpass", {
      email,
      password,
    });

    if (typeof result === "object" && result && "location" in result) {
      throw new Error("Additional authentication steps are required.");
    }

    const nextToken = typeof result === "string" ? result : null;
    if (!nextToken) {
      throw new Error("Unable to sign in. Please try again.");
    }

    setStoredToken(nextToken);
    setToken(nextToken);
    const { customer: next } = await sdk.store.customer.retrieve(
      undefined,
      getAuthHeaders(nextToken)
    );
    setCustomer(next);
  }, []);

  const register = useCallback(
    async (payload: {
      email: string;
      password: string;
      first_name?: string;
      last_name?: string;
    }) => {
      const tokenResult = await sdk.auth.register("customer", "emailpass", {
        email: payload.email,
        password: payload.password,
      });

      const nextToken =
        typeof tokenResult === "string" ? tokenResult : null;
      if (!nextToken) {
        throw new Error("Unable to create an account.");
      }

      await sdk.store.customer.create(
        {
          email: payload.email,
          first_name: payload.first_name,
          last_name: payload.last_name,
        },
        {},
        getAuthHeaders(nextToken)
      );

      setStoredToken(nextToken);
      setToken(nextToken);
      await login(payload.email, payload.password);
    },
    [login]
  );

  const logout = useCallback(async () => {
    try {
      await sdk.auth.logout();
    } catch {
      // ignore network logout failures
    }
    setStoredToken(null);
    setToken(null);
    setCustomer(null);
  }, []);

  const value = useMemo(
    () => ({
      customer,
      token,
      loading,
      login,
      register,
      logout,
      refreshCustomer,
    }),
    [customer, token, loading, login, register, logout, refreshCustomer]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
