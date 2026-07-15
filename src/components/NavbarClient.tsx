"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type SessionInfo = { role: "restaurant" | "candidate"; name: string; logoUrl?: string } | null;

// Main site menu, centered in the header for everyone.
const menuLinks = [
  { label: "Home", href: "/" },
  { label: "Restaurants", href: "/jobs" },
  { label: "Subscription", href: "/subscription" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const restaurantLinks = [
  { label: "Dashboard", href: "/admin", icon: "dashboard" },
  { label: "Job Listings", href: "/admin/listings", icon: "work" },
  { label: "Applications", href: "/admin/applications", icon: "group" },
  { label: "Messages", href: "/admin/messages", icon: "mail" },
];

const candidateLinks = [
  { label: "Dashboard", href: "/candidate", icon: "dashboard" },
  { label: "Job Listings", href: "/candidate/jobs", icon: "work" },
  { label: "Applications", href: "/candidate/applications", icon: "description" },
  { label: "Messages", href: "/candidate/messages", icon: "mail" },
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

function Avatar({ session, size }: { session: NonNullable<SessionInfo>; size: string }) {
  if (session.logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={session.logoUrl}
        alt={session.name}
        className={`${size} rounded-full object-cover border border-outline-variant/40`}
      />
    );
  }
  return (
    <div className={`${size} rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center`}>
      {initials(session.name)}
    </div>
  );
}

export default function NavbarClient({ session }: { session: SessionInfo }) {
  const [open, setOpen] = useState(false); // mobile menu
  const [menuOpen, setMenuOpen] = useState(false); // profile dropdown
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  const signOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const portalLinks = session?.role === "restaurant" ? restaurantLinks : candidateLinks;
  const settingsHref = session?.role === "restaurant" ? "/admin/settings" : "/candidate/settings";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface shadow-[0px_4px_20px_rgba(29,53,87,0.05)]">
      <nav className="relative flex justify-between items-center w-full px-6 max-w-[1280px] mx-auto h-14">
        <Link
          href={session ? (session.role === "restaurant" ? "/admin" : "/candidate") : "/"}
          className="text-2xl font-extrabold text-primary tracking-tight shrink-0"
        >
          FastFoodJobs
        </Link>

        {/* Centered main menu (desktop) */}
        <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-7">
          {menuLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side (desktop) */}
        <div className="hidden lg:flex items-center gap-4 shrink-0">
          {!session ? (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
              >
                Login
              </Link>
              <Link
                href="/jobs"
                className="bg-primary text-on-primary px-6 py-2 rounded-full text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
              >
                Apply Now
              </Link>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
              {/* Profile dropdown */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-1.5 group"
                  aria-expanded={menuOpen}
                  aria-haspopup="menu"
                >
                  <Avatar session={session} size="w-9 h-9" />
                  <span
                    className={`material-symbols-outlined text-[20px] text-on-surface-variant transition-transform duration-200 ${
                      menuOpen ? "rotate-180" : ""
                    }`}
                  >
                    expand_more
                  </span>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] w-64 bg-white rounded-xl shadow-[0px_12px_40px_rgba(29,53,87,0.18)] border border-outline-variant/30 py-2 animate-scale-in origin-top-right">
                    <div className="px-4 py-3 border-b border-outline-variant/30 flex items-center gap-3">
                      <Avatar session={session} size="w-10 h-10" />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-on-surface truncate">{session.name}</p>
                        <p className="text-xs text-on-surface-variant capitalize">{session.role} account</p>
                      </div>
                    </div>
                    {portalLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
                        {link.label}
                      </Link>
                    ))}
                    <Link
                      href={settingsHref}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">settings</span>
                      Settings
                    </Link>
                    <div className="border-t border-outline-variant/30 mt-1 pt-1">
                      <button
                        onClick={signOut}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-primary hover:bg-primary/5 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px]">logout</span>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden text-primary p-1"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className="material-symbols-outlined">{open ? "close" : "menu"}</span>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-surface border-t border-outline-variant/20 shadow-lg px-6 py-5 flex flex-col gap-5 animate-fade-in max-h-[calc(100dvh-3.5rem)] overflow-y-auto">
          {session && (
            <div className="flex items-center gap-3 pb-4 border-b border-outline-variant/30">
              <Avatar session={session} size="w-10 h-10" />
              <div className="min-w-0">
                <p className="text-sm font-bold truncate">{session.name}</p>
                <p className="text-xs text-on-surface-variant capitalize">{session.role} account</p>
              </div>
            </div>
          )}
          {menuLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-semibold text-on-surface-variant"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {session && (
            <div className="pt-4 border-t border-outline-variant/30 flex flex-col gap-5">
              {[...portalLinks, { label: "Settings", href: settingsHref, icon: "settings" }].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-2 text-sm font-semibold text-on-surface-variant"
                  onClick={() => setOpen(false)}
                >
                  <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>
          )}
          {!session ? (
            <div className="flex flex-col gap-3 pt-2">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="border border-outline text-on-surface px-6 py-3 rounded-full text-sm font-semibold text-center"
              >
                Login
              </Link>
              <Link
                href="/jobs"
                onClick={() => setOpen(false)}
                className="bg-primary text-on-primary px-6 py-3 rounded-full text-sm font-semibold text-center"
              >
                Apply Now
              </Link>
            </div>
          ) : (
            <button
              onClick={signOut}
              className="bg-primary text-on-primary px-6 py-3 rounded-full text-sm font-semibold text-center"
            >
              Sign Out
            </button>
          )}
        </div>
      )}
    </header>
  );
}
