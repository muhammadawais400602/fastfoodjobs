"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
        router.refresh();
      }}
      className="mt-4 flex items-center gap-2 text-white/60 hover:text-white text-xs font-semibold transition-colors"
    >
      <span className="material-symbols-outlined text-[18px]">logout</span>
      Sign out
    </button>
  );
}
