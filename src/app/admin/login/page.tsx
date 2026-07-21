"use client";

import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error("Invalid password");
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Invalid password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center section-pad">
      <div className="w-full max-w-md border border-line p-8 md:p-10">
        <Link href="/" className="eyebrow link-underline">
          Back to site
        </Link>
        <h1 className="section-title mt-8">Admin</h1>
        <p className="mt-4 text-sm text-muted">Manage portfolio items and contact messages.</p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-8">
          <label className="block">
            <span className="eyebrow">Password</span>
            <input
              type="password"
              className="input-minimal mt-4"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <button type="submit" className="btn-primary w-full disabled:opacity-50" disabled={loading}>
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <LoaderCircle className="animate-spin" size={14} />
                Signing in
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
