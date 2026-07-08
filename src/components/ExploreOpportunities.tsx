"use client";
import { useRef } from "react";
import { restaurants } from "@/data/restaurants";
import RestaurantCard from "@/components/RestaurantCard";

export default function ExploreOpportunities() {
  const carousel = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) =>
    carousel.current?.scrollBy({ left: dir * 400, behavior: "smooth" });

  return (
    <section className="py-16 md:py-20 bg-surface-container-lowest overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <h2 className="text-2xl md:text-[32px] font-bold leading-tight text-on-surface mb-1">
              Explore Opportunities
            </h2>
            <p className="text-base text-on-surface-variant">
              Top-rated franchises actively hiring new talent today.
            </p>
          </div>
          <div className="flex gap-4">
            <button
              className="w-12 h-12 rounded-xl border border-outline-variant flex items-center justify-center hover:bg-surface hover:text-primary transition-all"
              onClick={() => scroll(-1)}
              aria-label="Scroll left"
            >
              <span className="material-symbols-outlined">west</span>
            </button>
            <button
              className="w-12 h-12 rounded-xl border border-outline-variant flex items-center justify-center hover:bg-surface hover:text-primary transition-all"
              onClick={() => scroll(1)}
              aria-label="Scroll right"
            >
              <span className="material-symbols-outlined">east</span>
            </button>
          </div>
        </div>

        <div ref={carousel} className="flex gap-6 overflow-x-auto pb-8 hide-scrollbar scroll-smooth">
          {restaurants.map((r) => (
            <RestaurantCard key={r.name} restaurant={r} />
          ))}
        </div>
      </div>
    </section>
  );
}
