"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";

  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, remember: data.remember === "on" }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Something went wrong.");
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full pl-10 pr-4 py-3 bg-white border border-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-base";

  return (
    <div className="bg-surface-container-lowest shadow-[0px_4px_20px_rgba(29,53,87,0.05)] rounded-xl p-8 md:p-10 border border-outline-variant">
      <div className="text-center mb-8">
        <h1 className="text-[40px] md:text-[48px] font-extrabold leading-tight tracking-[-0.02em] text-primary mb-2">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="text-base text-on-surface-variant">
          {mode === "login"
            ? "Manage your restaurant's hiring in one place."
            : "Set up your restaurant's recruitment portal."}
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {mode === "register" && (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-on-surface" htmlFor="restaurant">
              Restaurant Name
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                storefront
              </span>
              <input className={inputClass} id="restaurant" name="restaurant" placeholder="The Grand Bistro" required />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-on-surface" htmlFor="email">
            Email Address
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
              mail
            </span>
            <input className={inputClass} id="email" name="email" placeholder="name@company.com" type="email" required />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-semibold text-on-surface" htmlFor="password">
              Password
            </label>
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
              lock
            </span>
            <input
              className="w-full pl-10 pr-10 py-3 bg-white border border-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-base"
              id="password"
              name="password"
              placeholder="••••••••"
              type={showPass ? "text" : "password"}
              required
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">{showPass ? "visibility_off" : "visibility"}</span>
            </button>
          </div>
          {mode === "register" && <p className="text-xs text-on-surface-variant">At least 8 characters.</p>}
        </div>

        {mode === "login" && (
          <div className="flex items-center">
            <input
              className="w-4 h-4 text-primary border-outline rounded focus:ring-primary cursor-pointer accent-primary"
              id="remember"
              name="remember"
              type="checkbox"
            />
            <label className="ml-2 text-sm font-semibold text-on-surface-variant cursor-pointer" htmlFor="remember">
              Remember me for 30 days
            </label>
          </div>
        )}

        {error && <p className="text-sm font-semibold text-error bg-error-container rounded-lg px-4 py-3">{error}</p>}

        <button
          className="w-full bg-primary hover:bg-primary-container text-white font-semibold text-sm py-4 rounded-lg transition-all active:scale-[0.98] shadow-md disabled:opacity-70"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-on-surface-variant">
          {mode === "login" ? "Don't have an account yet?" : "Already have an account?"}
          <button
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError(null);
            }}
            className="text-primary font-bold hover:underline ml-1"
          >
            {mode === "login" ? "Create an Account" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}
