"use client";
import { useState } from "react";

const navLinks = [
  { label: "Find Jobs", href: "#", active: true },
  { label: "Post a Job", href: "#", active: false },
  { label: "Login", href: "#", active: false },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface shadow-[0px_4px_20px_rgba(29,53,87,0.05)]">
      <nav className="flex justify-between items-center w-full px-6 max-w-[1280px] mx-auto h-14">
        <a href="#" className="text-2xl font-extrabold text-primary tracking-tight">
          FastFoodJobs
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={
                link.active
                  ? "text-sm font-semibold text-primary border-b-2 border-primary pb-1"
                  : "text-sm font-semibold text-on-surface-variant hover:text-secondary transition-colors"
              }
            >
              {link.label}
            </a>
          ))}
          <button className="bg-primary text-on-primary px-6 py-2 rounded-full text-sm font-semibold hover:opacity-90 active:scale-95 transition-all">
            Apply Now
          </button>
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
        <div className="md:hidden bg-surface border-t border-outline-variant/20 shadow-lg px-6 py-5 flex flex-col gap-5">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={
                link.active
                  ? "text-sm font-semibold text-primary"
                  : "text-sm font-semibold text-on-surface-variant"
              }
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <button className="bg-primary text-on-primary px-6 py-3 rounded-full text-sm font-semibold text-center">
            Apply Now
          </button>
        </div>
      )}
    </header>
  );
}
