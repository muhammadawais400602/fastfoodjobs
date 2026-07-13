"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Role = "candidate" | "restaurant";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const nextParam = params.get("next");

  const [role, setRole] = useState<Role>("candidate");
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setInfo(null);
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());

    if (mode === "forgot") {
      try {
        const res = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email, role }),
        });
        const json = await res.json();
        if (!res.ok || !json.ok) throw new Error(json.error ?? "Something went wrong.");
        setInfo("If an account exists for that email, we've sent a reset link. Check your inbox.");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
      setSubmitting(false);
      return;
    }

    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, role, remember: data.remember === "on" }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Something went wrong.");
      const dest = nextParam ?? (role === "candidate" ? "/candidate" : "/admin");
      router.push(dest);
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
      <div className="text-center mb-6">
        <h1 className="text-[36px] md:text-[44px] font-extrabold leading-tight tracking-[-0.02em] text-primary mb-2">
          {mode === "login" ? "Welcome Back" : mode === "register" ? "Create Account" : "Reset Password"}
        </h1>
        <p className="text-base text-on-surface-variant">
          {mode === "forgot"
            ? "Enter your email and we'll send you a reset link."
            : role === "candidate"
              ? "Find your next shift and manage your applications."
              : "Manage your restaurant's hiring."}
        </p>
      </div>

      {/* Role toggle */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-surface-container rounded-xl mb-6">
        {(["candidate", "restaurant"] as Role[]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => {
              setRole(r);
              setError(null);
            }}
            className={`py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-1 ${
              role === r ? "bg-white text-primary shadow-sm" : "text-on-surface-variant"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{r === "candidate" ? "person" : "storefront"}</span>
            {r === "candidate" ? "Job Seeker" : "Restaurant"}
          </button>
        ))}
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {mode === "register" && (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-on-surface" htmlFor="name">
              {role === "candidate" ? "Full Name" : "Restaurant Name"}
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                {role === "candidate" ? "badge" : "storefront"}
              </span>
              <input className={inputClass} id="name" name="name" placeholder={role === "candidate" ? "Alex Rivera" : "The Grand Bistro"} required />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-on-surface" htmlFor="email">
            Email Address
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">mail</span>
            <input className={inputClass} id="email" name="email" placeholder="name@company.com" type="email" required />
          </div>
        </div>

        {mode !== "forgot" && (
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-on-surface" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">lock</span>
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
        )}

        {mode === "login" && (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input className="w-4 h-4 rounded accent-primary" id="remember" name="remember" type="checkbox" />
              <label className="ml-2 text-sm font-semibold text-on-surface-variant cursor-pointer" htmlFor="remember">
                Remember me for 30 days
              </label>
            </div>
            <button
              type="button"
              onClick={() => {
                setMode("forgot");
                setError(null);
                setInfo(null);
              }}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Forgot password?
            </button>
          </div>
        )}

        {error && <p className="text-sm font-semibold text-error bg-error-container rounded-lg px-4 py-3">{error}</p>}
        {info && <p className="text-sm font-semibold text-green-800 bg-green-50 border border-green-200 rounded-lg px-4 py-3">{info}</p>}

        <button
          className="w-full bg-primary hover:bg-primary-container text-white font-semibold text-sm py-4 rounded-lg transition-all active:scale-[0.98] shadow-md disabled:opacity-70"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Please wait…" : mode === "login" ? "Sign In" : mode === "register" ? "Create Account" : "Send Reset Link"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-on-surface-variant">
          {mode === "login" ? "Don't have an account yet?" : "Already have an account?"}
          <button
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError(null);
              setInfo(null);
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
