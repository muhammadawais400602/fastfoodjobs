"use client";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordForm() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const role = params.get("role") ?? "candidate";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Something went wrong.");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="bg-surface-container-lowest rounded-xl p-8 md:p-10 border border-outline-variant text-center animate-fade-in-up">
        <p className="text-on-surface-variant">This reset link is invalid. Please request a new one from the login page.</p>
        <Link href="/login" className="inline-block mt-4 text-primary font-bold hover:underline">Go to login</Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="bg-surface-container-lowest rounded-xl p-8 md:p-10 border border-outline-variant text-center animate-fade-in-up">
        <div className="w-16 h-16 mx-auto mb-4 bg-primary-fixed text-primary rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-[36px]">check_circle</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">Password updated</h1>
        <p className="text-on-surface-variant mb-6">You can now sign in with your new password.</p>
        <Link
          href={`/login${role === "restaurant" ? "?role=restaurant" : ""}`}
          className="inline-block bg-primary text-white font-semibold px-8 py-3 rounded-lg active:scale-[0.98] transition-all"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest shadow-[0px_4px_20px_rgba(29,53,87,0.05)] rounded-xl p-8 md:p-10 border border-outline-variant animate-fade-in-up">
      <h1 className="text-[32px] font-extrabold leading-tight tracking-[-0.02em] text-primary mb-2 text-center">
        Choose a new password
      </h1>
      <p className="text-base text-on-surface-variant text-center mb-6">At least 8 characters.</p>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-on-surface" htmlFor="new_password">New Password</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">lock</span>
            <input
              className="w-full pl-10 pr-10 py-3 bg-white border border-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-base"
              id="new_password"
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
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
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-on-surface" htmlFor="confirm_password">Confirm Password</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">lock_reset</span>
            <input
              className="w-full pl-10 pr-4 py-3 bg-white border border-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-base"
              id="confirm_password"
              type={showPass ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              minLength={8}
              required
            />
          </div>
        </div>

        {error && <p className="text-sm font-semibold text-error bg-error-container rounded-lg px-4 py-3">{error}</p>}

        <button
          className="w-full bg-primary hover:bg-primary-container text-white font-semibold text-sm py-4 rounded-lg transition-all active:scale-[0.98] shadow-md disabled:opacity-70"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Please wait…" : "Update Password"}
        </button>
      </form>
    </div>
  );
}
