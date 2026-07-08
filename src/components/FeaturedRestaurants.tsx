"use client";
import { useRef } from "react";
import { restaurants } from "@/data/restaurants";
import RestaurantCard from "@/components/RestaurantCard";

export default function FeaturedRestaurants() {
  const carousel = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) =>
    carousel.current?.scrollBy({ left: dir * 344, behavior: "smooth" });

  return (
    <section className="py-6 bg-white border-y border-outline-variant/10">
      <div className="max-w-[1280px] mx-auto px-6 overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">
            Featured Restaurants
          </h2>
          <div className="flex gap-2">
            <button
              className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface transition-colors"
              onClick={() => scroll(-1)}
              aria-label="Scroll left"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button
              className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface transition-colors"
              onClick={() => scroll(1)}
              aria-label="Scroll right"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>

        <div ref={carousel} className="flex overflow-x-auto gap-6 py-4 hide-scrollbar scroll-smooth items-stretch">
          {restaurants.map((r) => (
            <RestaurantCard key={r.name} restaurant={r} />
          ))}
        </div>
      </div>
    </section>
  );
}
