'use client';
import { useState } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-white border-b border-gray-100 px-5 py-4 relative z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <span className="text-[#8B1A1A] font-bold text-xl tracking-tight">FastFoodJobs</span>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm font-medium text-gray-800 border-b-2 border-[#8B1A1A] pb-0.5">Find Jobs</a>
          <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">Post a Job</a>
          <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">Login</a>
          <a href="#" className="bg-[#8B1A1A] text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#701515] transition-colors">
            Apply Now
          </a>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? (
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg px-5 py-4 flex flex-col gap-4">
          <a href="#" className="text-sm font-medium text-[#8B1A1A]">Find Jobs</a>
          <a href="#" className="text-sm font-medium text-gray-600">Post a Job</a>
          <a href="#" className="text-sm font-medium text-gray-600">Login</a>
          <a href="#" className="bg-[#8B1A1A] text-white text-sm font-semibold px-5 py-3 rounded-full text-center hover:bg-[#701515] transition-colors">
            Apply Now
          </a>
        </div>
      )}
    </nav>
  );
}
