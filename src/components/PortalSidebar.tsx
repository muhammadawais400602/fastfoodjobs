"use client";
import { useState } from "react";
import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";

export type NavItem = { label: string; icon: string; href: string };

export default function PortalSidebar({
  brand,
  brandSub,
  nav,
  active,
  footerTitle,
  footerSub,
  headerTitle,
  headerRight,
}: {
  brand: string;
  brandSub: string;
  nav: NavItem[];
  active: string;
  footerTitle: string;
  footerSub: string;
  headerTitle: string;
  headerRight: string;
}) {
  const [open, setOpen] = useState(false);

  const sidebarContent = (
    <>
      <div className="px-6 mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white leading-none">{brand}</h1>
          <p className="text-white/50 text-[10px] uppercase tracking-widest mt-1">{brandSub}</p>
        </div>
        <button
          className="lg:hidden text-white/70 hover:text-white p-1"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
      <nav className="flex-1 space-y-1">
        {nav.map((item) => {
          const isActive = item.label === active;
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className={
                isActive
                  ? "flex items-center gap-3 px-6 py-3 bg-[#b7102a]/15 text-white border-l-4 border-[#b7102a] font-bold"
                  : "flex items-center gap-3 px-6 py-3 text-white/70 hover:text-white hover:bg-white/5 hover:translate-x-1 transition-all duration-200"
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-sm font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="px-6 pt-6 mt-auto border-t border-white/10">
        <p className="text-white text-sm font-semibold truncate">{footerTitle}</p>
        <p className="text-white/50 text-[10px] uppercase tracking-widest truncate">{footerSub}</p>
        <LogoutButton />
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-[260px] bg-[#183153] shadow-lg z-50 flex-col py-6">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`lg:hidden fixed left-0 top-0 h-full w-[280px] max-w-[85vw] bg-[#183153] shadow-2xl z-[70] flex flex-col py-6 transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Header (works on all sizes) */}
      <header className="sticky top-0 z-40 bg-[#f9f9ff]/90 backdrop-blur border-b border-[#e4bebc] h-16 flex items-center justify-between px-4 md:px-6 lg:ml-[260px]">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden text-[#183153] p-1 -ml-1"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <span className="text-sm font-semibold text-[#586158]">{headerTitle}</span>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <span className="material-symbols-outlined text-[#586158] hidden sm:block">notifications</span>
          <span className="material-symbols-outlined text-[#586158] hidden sm:block">help</span>
          <div className="h-8 w-px bg-[#e4bebc] hidden sm:block" />
          <span className="text-sm font-semibold text-[#b7102a] truncate max-w-[140px] md:max-w-none">{headerRight}</span>
        </div>
      </header>
    </>
  );
}
