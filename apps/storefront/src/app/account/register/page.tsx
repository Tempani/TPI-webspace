"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register(form);
      router.push("/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to register.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-5 py-16 md:px-10">
      <h1 className="font-[family-name:var(--font-serif)] text-5xl">
        Create account
      </h1>
      <p className="mt-3 text-sm text-[var(--color-muted)]">
        Join Tempani for a quieter checkout and order history.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="First name"
            value={form.first_name}
            onChange={(e) =>
              setForm((f) => ({ ...f, first_name: e.target.value }))
            }
          />
          <Input
            label="Last name"
            value={form.last_name}
            onChange={(e) =>
              setForm((f) => ({ ...f, last_name: e.target.value }))
            }
          />
        </div>
        <Input
          label="Email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />
        <Input
          label="Password"
          type="password"
          required
          value={form.password}
          onChange={(e) =>
            setForm((f) => ({ ...f, password: e.target.value }))
          }
        />
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <Button type="submit" className="w-full" loading={loading}>
          Create account
        </Button>
      </form>
      <p className="mt-6 text-sm text-[var(--color-muted)]">
        Already have an account?{" "}
        <Link href="/account/login" className="underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
