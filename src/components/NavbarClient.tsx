"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type SessionInfo = { role: "restaurant" | "candidate"; name: string } | null;

const publicLinks = [
  { label: "Find Jobs", href: "/jobs" },
  { label: "Login", href: "/login" },
];

const restaurantLinks = [
  { label: "Dashboard", href: "/admin" },
  { label: "Job Listings", href: "/admin/listings" },
  { label: "Applications", href: "/admin/applications" },
  { label: "Messages", href: "/admin/messages" },
];

const candidateLinks = [
  { label: "Dashboard", href: "/candidate" },
  { label: "Find Jobs", href: "/jobs" },
  { label: "Applications", href: "/candidate/applications" },
  { label: "Messages", href: "/candidate/messages" },
];

function initials(name: string) {
  return (
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U"
  );
}

export default function NavbarClient({ session }: { session: SessionInfo }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const signOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const links = !session ? publicLinks : session.role === "restaurant" ? restaurantLinks : candidateLinks;
  const settingsHref = session?.role === "restaurant" ? "/admin/settings" : "/candidate/settings";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface shadow-[0px_4px_20px_rgba(29,53,87,0.05)]">
      <nav className="flex justify-between items-center w-full px-6 max-w-[1280px] mx-auto h-14">
        <Link href={session ? (session.role === "restaurant" ? "/admin" : "/candidate") : "/"} className="text-2xl font-extrabold text-primary tracking-tight">
          FastFoodJobs{session && <span className="font-bold text-on-surface"> Portal</span>}
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {!session ? (
            <Link
              href="/jobs"
              className="bg-primary text-on-primary px-6 py-2 rounded-full text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
            >
              Apply Now
            </Link>
          ) : (
            <div className="flex items-center gap-4 pl-2 border-l border-outline-variant/40">
              <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
              <Link href={settingsHref} title="Settings">
                <span className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">
                  settings
                </span>
              </Link>
              <div
                className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center"
                title={session.name}
              >
                {initials(session.name)}
              </div>
              <button onClick={signOut} className="text-sm font-bold text-primary hover:underline">
                Sign Out
              </button>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-primary p-1"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className="material-symbols-outlined">{open ? "close" : "menu"}</span>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-surface border-t border-outline-variant/20 shadow-lg px-6 py-5 flex flex-col gap-5 animate-fade-in">
          {session && (
            <div className="flex items-center gap-3 pb-4 border-b border-outline-variant/30">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center">
                {initials(session.name)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold truncate">{session.name}</p>
                <p className="text-xs text-on-surface-variant capitalize">{session.role} account</p>
              </div>
            </div>
          )}
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-semibold text-on-surface-variant"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {!session ? (
            <Link
              href="/jobs"
              onClick={() => setOpen(false)}
              className="bg-primary text-on-primary px-6 py-3 rounded-full text-sm font-semibold text-center"
            >
              Apply Now
            </Link>
          ) : (
            <>
              <Link
                href={settingsHref}
                onClick={() => setOpen(false)}
                className="text-sm font-semibold text-on-surface-variant"
              >
                Settings
              </Link>
              <button
                onClick={signOut}
                className="bg-primary text-on-primary px-6 py-3 rounded-full text-sm font-semibold text-center"
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
