"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type SessionInfo = { role: "restaurant" | "candidate"; name: string } | null;

const publicLinks = [
  { label: "Find Jobs", href: "/jobs" },
  { label: "Login", href: "/login" },
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

export default function NavbarClient({ session }: { session: SessionInfo }) {
  const [open, setOpen] = useState(false); // mobile menu
  const [menuOpen, setMenuOpen] = useState(false); // profile dropdown
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close the profile dropdown when clicking anywhere else.
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
      <nav className="flex justify-between items-center w-full px-6 max-w-[1280px] mx-auto h-14">
        <Link
          href={session ? (session.role === "restaurant" ? "/admin" : "/candidate") : "/"}
          className="text-2xl font-extrabold text-primary tracking-tight"
        >
          FastFoodJobs{session && <span className="font-bold text-on-surface"> Portal</span>}
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {!session ? (
            <>
              {publicLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/jobs"
                className="bg-primary text-on-primary px-6 py-2 rounded-full text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
              >
                Apply Now
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/jobs"
                className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
              >
                Find Jobs
              </Link>
              <span className="material-symbols-outlined text-on-surface-variant">notifications</span>

              {/* Profile dropdown */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-1.5 group"
                  aria-expanded={menuOpen}
                  aria-haspopup="menu"
                >
                  <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    {initials(session.name)}
                  </div>
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
                    <div className="px-4 py-3 border-b border-outline-variant/30">
                      <p className="text-sm font-bold text-on-surface truncate">{session.name}</p>
                      <p className="text-xs text-on-surface-variant capitalize">{session.role} account</p>
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
          {(!session ? publicLinks : [...portalLinks, { label: "Settings", href: settingsHref, icon: "settings" }]).map(
            (link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-semibold text-on-surface-variant"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            )
          )}
          {!session ? (
            <Link
              href="/jobs"
              onClick={() => setOpen(false)}
              className="bg-primary text-on-primary px-6 py-3 rounded-full text-sm font-semibold text-center"
            >
              Apply Now
            </Link>
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
