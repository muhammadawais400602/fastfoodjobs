"use client";
import { useState } from "react";

export default function VerifyEmailBanner() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const resend = async () => {
    setState("sending");
    try {
      const res = await fetch("/api/auth/resend-verification", { method: "POST" });
      const json = await res.json();
      setState(res.ok && json.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  };

  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3 bg-amber-50 border border-amber-300 text-amber-900 rounded-xl px-4 py-3 animate-fade-in-up">
      <span className="material-symbols-outlined shrink-0">mark_email_unread</span>
      <p className="text-sm font-semibold flex-1">
        Please verify your email address — we sent you a link when you signed up.
      </p>
      <button
        onClick={resend}
        disabled={state === "sending" || state === "sent"}
        className="text-sm font-bold text-amber-900 underline hover:no-underline disabled:opacity-60 text-left"
      >
        {state === "sent" ? "Sent! Check your inbox." : state === "sending" ? "Sending…" : state === "error" ? "Failed — try again" : "Resend email"}
      </button>
    </div>
  );
}
