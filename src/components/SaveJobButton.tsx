"use client";
import { useEffect, useState } from "react";

const STORAGE_KEY = "ffj_saved_jobs";

function getSaved(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export default function SaveJobButton({ slug }: { slug: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(getSaved().includes(slug));
  }, [slug]);

  const toggle = () => {
    const current = getSaved();
    const next = current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSaved(next.includes(slug));
  };

  return (
    <button
      onClick={toggle}
      className={`w-full border py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-1 transition-colors ${
        saved
          ? "border-primary bg-primary-fixed text-primary"
          : "border-outline text-on-surface hover:bg-surface-container"
      }`}
    >
      <span className={`material-symbols-outlined text-[18px] ${saved ? "icon-filled" : ""}`}>bookmark</span>
      {saved ? "Saved" : "Save Job"}
    </button>
  );
}
