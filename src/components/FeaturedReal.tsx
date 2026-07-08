import Link from "next/link";
import { getRestaurantsWithActiveJobs } from "@/lib/public";
import FeaturedRestaurants from "@/components/FeaturedRestaurants";

// Shows real restaurants that have active jobs. If none exist yet, falls back
// to the demo carousel so the landing page never looks empty.
export default async function FeaturedReal() {
  let restaurants: { id: string; name: string; jobCount: number }[] = [];
  try {
    restaurants = await getRestaurantsWithActiveJobs();
  } catch {
    restaurants = [];
  }

  if (restaurants.length === 0) {
    return <FeaturedRestaurants />;
  }

  return (
    <section className="py-16 md:py-20 bg-surface-container-lowest">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-[32px] font-bold leading-tight text-on-surface mb-1">Hiring Now</h2>
          <p className="text-base text-on-surface-variant">Restaurants with open positions today</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((r) => (
            <Link
              key={r.id}
              href={`/r/${r.id}`}
              className="group bg-white p-6 rounded-2xl border border-outline-variant/20 shadow-[0px_4px_20px_rgba(29,53,87,0.05)] hover:border-primary-fixed transition-all flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-primary group-hover:underline truncate">{r.name}</h3>
                <p className="text-sm text-on-surface-variant">
                  {r.jobCount} open position{r.jobCount === 1 ? "" : "s"}
                </p>
              </div>
              <span className="material-symbols-outlined text-primary shrink-0">arrow_forward</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
