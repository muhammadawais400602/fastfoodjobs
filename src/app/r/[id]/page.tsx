import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPublicRestaurant, getRestaurantActiveJobs } from "@/lib/public";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const r = await getPublicRestaurant(id);
  return {
    title: r ? `${r.restaurant} | FastFoodJobs` : "Restaurant | FastFoodJobs",
    description: r?.profile.description,
  };
}

export default async function PublicRestaurantPage({ params }: Props) {
  const { id } = await params;
  const r = await getPublicRestaurant(id);
  if (!r) notFound();
  const jobs = await getRestaurantActiveJobs(r.restaurant);

  return (
    <>
      <Navbar />
      <main className="pt-14">
        {/* Hero */}
        <section className="bg-[#F5F3EE] px-6 py-16 md:py-20">
          <div className="max-w-[1280px] mx-auto">
            <span className="inline-block bg-secondary-container text-on-secondary-container text-xs font-bold px-4 py-1.5 rounded-full mb-4">
              {r.profile.cuisine}
            </span>
            <h1 className="font-extrabold text-[36px] md:text-[48px] leading-tight tracking-[-0.02em] text-on-surface">
              {r.restaurant}
            </h1>
            {r.profile.description && (
              <p className="text-lg text-on-surface-variant max-w-2xl mt-4">{r.profile.description}</p>
            )}
            <div className="flex flex-wrap gap-6 mt-6 text-sm text-on-surface-variant">
              {r.profile.address && (
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px] text-primary">location_on</span>
                  {r.profile.address}
                </span>
              )}
              {r.profile.website && (
                <a href={r.profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary font-semibold hover:underline">
                  <span className="material-symbols-outlined text-[18px]">language</span>
                  Website
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Jobs */}
        <section className="max-w-[1280px] mx-auto px-6 py-16">
          <h2 className="text-2xl md:text-[32px] font-bold mb-8">
            Open Positions <span className="text-primary">({jobs.length})</span>
          </h2>
          {jobs.length === 0 ? (
            <p className="text-on-surface-variant">No open positions right now. Check back soon.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map((j) => (
                <Link
                  key={j.id}
                  href={`/j/${j.id}`}
                  className="block bg-white p-6 rounded-2xl border border-outline-variant/20 shadow-[0px_4px_20px_rgba(29,53,87,0.05)] hover:border-primary-fixed transition-all"
                >
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <h3 className="text-lg font-bold text-primary">{j.jobTitle}</h3>
                    <span className="bg-secondary-fixed text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                      {j.jobType}
                    </span>
                  </div>
                  {j.rate && (
                    <p className="text-sm font-bold text-outline flex items-center gap-1 mb-3">
                      <span className="material-symbols-outlined text-[18px]">payments</span>
                      {j.rate}
                    </p>
                  )}
                  <p className="text-base text-on-surface-variant line-clamp-2">{j.description}</p>
                  <span className="inline-block mt-4 text-sm font-semibold text-primary">View job →</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
