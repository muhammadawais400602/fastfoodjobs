import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPublicRestaurant, getRestaurantActiveJobs } from "@/lib/public";
import { amenityByKey } from "@/lib/profile";

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

function parseHours(hours: string) {
  return hours
    .split("\n")
    .map((line) => {
      const idx = line.indexOf(":");
      if (idx === -1) return { label: line.trim(), value: "" };
      return { label: line.slice(0, idx).trim(), value: line.slice(idx + 1).trim() };
    })
    .filter((h) => h.label);
}

export default async function PublicRestaurantPage({ params }: Props) {
  const { id } = await params;
  const r = await getPublicRestaurant(id);
  if (!r) notFound();
  const jobs = await getRestaurantActiveJobs(r.restaurant);
  const p = r.profile;
  const amenities = p.amenities.map(amenityByKey).filter(Boolean) as { icon: string; label: string }[];
  const hours = parseHours(p.hours);
  const locationLine = [p.address, p.city].filter(Boolean).join(", ");
  const directions = locationLine
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationLine)}`
    : null;

  return (
    <>
      <Navbar />
      <main className="pt-14 bg-[#EEF4EE]">
        {/* Hero */}
        <section className="relative w-full h-[280px] md:h-[400px] overflow-hidden">
          {p.coverUrl ? (
            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${p.coverUrl}')` }} />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/80 to-primary-container" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 max-w-[1280px] mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              <div className="w-24 h-24 md:w-36 md:h-36 bg-white rounded-xl shadow-lg flex items-center justify-center p-3 md:-mb-8 relative z-10 shrink-0 overflow-hidden">
                {p.logoUrl ? (
                  <img src={p.logoUrl} alt={`${r.restaurant} logo`} className="w-full h-full object-contain" />
                ) : (
                  <span className="text-2xl font-extrabold text-primary">{r.restaurant.charAt(0)}</span>
                )}
              </div>
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-green-600 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-full">Open Now</span>
                  {locationLine && (
                    <span className="text-sm font-semibold text-white flex items-center gap-1 opacity-90">
                      <span className="material-symbols-outlined text-[18px]">location_on</span>
                      {p.city || p.address}
                    </span>
                  )}
                </div>
                <h1 className="text-white font-extrabold text-[32px] md:text-[48px] leading-none tracking-[-0.02em] drop-shadow-md">
                  {r.restaurant}
                </h1>
                {p.tagline && <p className="text-white/90 font-semibold mt-2">{p.tagline}</p>}
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-[1280px] mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left */}
            <div className="lg:col-span-8 space-y-10">
              {p.description && (
                <div className="bg-white rounded-xl p-8 shadow-[0px_4px_20px_rgba(29,53,87,0.05)]">
                  <h2 className="text-2xl font-bold mb-4">About {r.restaurant}</h2>
                  <p className="text-base text-on-surface-variant leading-relaxed whitespace-pre-line">{p.description}</p>
                </div>
              )}

              {amenities.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold mb-6">Branch Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {amenities.map((a) => (
                      <div key={a.label} className="flex flex-col items-center justify-center p-6 bg-surface-container rounded-xl text-center border border-outline-variant">
                        <span className="material-symbols-outlined text-primary text-[32px] mb-2">{a.icon}</span>
                        <span className="text-sm font-semibold text-on-surface-variant">{a.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="flex justify-between items-end mb-6">
                  <h3 className="text-2xl font-bold">Available Jobs</h3>
                  <span className="text-sm font-semibold text-primary">{jobs.length} Openings</span>
                </div>
                {jobs.length === 0 ? (
                  <p className="text-on-surface-variant">No open positions right now. Check back soon.</p>
                ) : (
                  <div className="space-y-4">
                    {jobs.map((j) => (
                      <div key={j.id} className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl shadow-[0px_4px_20px_rgba(29,53,87,0.05)] gap-4">
                        <div>
                          <h4 className="font-bold text-[20px] mb-1">{j.jobTitle}</h4>
                          <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-on-surface-variant">
                            {j.rate && (
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">payments</span>
                                {j.rate}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">schedule</span>
                              {j.jobType}
                            </span>
                          </div>
                        </div>
                        <Link href={`/j/${j.id}`} className="w-full md:w-auto bg-primary text-on-primary px-8 py-2.5 rounded-lg text-sm font-semibold text-center hover:shadow-lg transition-all">
                          View Job
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white shadow-[0px_8px_30px_rgba(29,53,87,0.12)] rounded-xl overflow-hidden border border-outline-variant">
                <div className="p-6 space-y-6">
                  {locationLine && (
                    <div>
                      <h4 className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">Address</h4>
                      <p className="text-base">{locationLine}</p>
                    </div>
                  )}
                  {p.phone && (
                    <div className="border-t border-outline-variant pt-6">
                      <h4 className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">Contact</h4>
                      <p className="text-base">{p.phone}</p>
                    </div>
                  )}
                  {hours.length > 0 && (
                    <div className="border-t border-outline-variant pt-6">
                      <h4 className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">Operating Hours</h4>
                      <ul className="space-y-2 text-base text-on-surface-variant">
                        {hours.map((h, i) => (
                          <li key={i} className="flex justify-between gap-4">
                            <span>{h.label}</span>
                            {h.value && <span className="font-bold text-on-surface">{h.value}</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {directions && (
                    <a href={directions} target="_blank" rel="noopener noreferrer" className="block text-center w-full border-2 border-primary text-primary text-sm font-semibold py-3 rounded-lg hover:bg-primary-fixed transition-colors">
                      Get Directions
                    </a>
                  )}
                </div>
              </div>

              {jobs.length > 0 && (
                <div className="bg-primary text-on-primary rounded-xl p-8 space-y-4">
                  <h4 className="text-2xl font-bold leading-tight">Ready to join the {r.restaurant} team?</h4>
                  <p className="text-base opacity-90">We&apos;re always looking for energetic people. Apply today!</p>
                  <Link href={`/j/${jobs[0].id}`} className="block w-full bg-white text-primary font-bold py-4 rounded-lg text-center shadow-xl hover:scale-105 transition-transform">
                    Quick Apply
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
