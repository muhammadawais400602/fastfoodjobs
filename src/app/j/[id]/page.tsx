import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPublicJob } from "@/lib/public";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await getPublicJob(id);
  return {
    title: data ? `${data.job.jobTitle} at ${data.restaurant?.restaurant ?? "FastFoodJobs"}` : "Job | FastFoodJobs",
    description: data?.job.description,
  };
}

export default async function PublicJobPage({ params }: Props) {
  const { id } = await params;
  const data = await getPublicJob(id);
  if (!data) notFound();
  const { job, restaurant } = data;
  const locationLine = restaurant ? [restaurant.profile.address, restaurant.profile.city].filter(Boolean).join(", ") : "";

  const stats = [
    { label: "Salary", value: job.rate || "—" },
    { label: "Experience", value: job.experience || "—" },
    { label: "Shift", value: job.shift || "—" },
    { label: "Type", value: job.jobType || "—" },
  ];

  return (
    <>
      <Navbar />
      <main className="max-w-[1280px] mx-auto px-6 py-10 pt-[88px]">
        <Link href="/jobs" className="text-xs font-bold text-on-surface-variant hover:text-primary flex items-center gap-1 mb-6">
          <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          Back to Job Search
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left */}
          <article className="lg:col-span-8 space-y-6">
            {/* Header card */}
            <div className="bg-surface-container-lowest rounded-xl p-6 md:p-10 shadow-[0px_4px_20px_rgba(29,53,87,0.05)]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                <div className="flex items-center gap-6">
                  {restaurant?.profile.logoUrl && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-outline-variant shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={restaurant.profile.logoUrl} alt={restaurant.restaurant} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div>
                    <h1 className="text-2xl md:text-[32px] font-bold leading-tight mb-2">{job.jobTitle}</h1>
                    <div className="flex items-center gap-3 flex-wrap">
                      {restaurant && (
                        <Link href={`/r/${restaurant.id}`} className="text-base font-bold text-secondary hover:underline">
                          {restaurant.restaurant}
                        </Link>
                      )}
                      {locationLine && (
                        <>
                          <span className="w-1 h-1 bg-outline-variant rounded-full" />
                          <span className="text-sm font-semibold text-on-surface-variant">{restaurant?.profile.city || locationLine}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {job.urgent && (
                    <span className="bg-secondary-fixed text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold">Urgent Hire</span>
                  )}
                  <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-xs font-bold">{job.jobType}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-outline-variant pt-6">
                {stats.map((s) => (
                  <div key={s.label}>
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">{s.label}</p>
                    <p className="text-base text-on-surface font-bold">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="bg-surface-container-lowest rounded-xl p-6 md:p-10 shadow-[0px_4px_20px_rgba(29,53,87,0.05)] space-y-10">
              {job.description && (
                <section>
                  <h2 className="text-2xl font-bold mb-6">About the Role</h2>
                  <p className="text-base text-on-surface-variant leading-relaxed whitespace-pre-line">{job.description}</p>
                </section>
              )}

              {job.responsibilities.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-6">Key Responsibilities</h2>
                  <ul className="space-y-3">
                    {job.responsibilities.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="material-symbols-outlined text-primary text-[20px] shrink-0">check_circle</span>
                        <span className="text-base text-on-surface-variant">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {job.requirements.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-6">Requirements</h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {job.requirements.map((item) => (
                      <li key={item} className="bg-surface p-3 rounded-lg border border-outline-variant/10 text-base text-on-surface-variant">
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {job.benefits.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-6">Benefits &amp; Perks</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {job.benefits.map((b) => (
                      <div key={b} className="text-center p-6 bg-surface-container-high/30 rounded-xl">
                        <span className="material-symbols-outlined text-secondary text-[32px] mb-2">star</span>
                        <p className="text-sm font-semibold text-on-surface">{b}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </article>

          {/* Right */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_8px_30px_rgba(29,53,87,0.12)] border border-primary/10">
              <Link
                href={`/apply/job/${job.id}`}
                className="block w-full bg-primary text-on-primary py-5 rounded-lg text-xl font-bold mb-4 text-center active:scale-95 transition-all hover:bg-primary-container shadow-md"
              >
                Apply for this Job
              </Link>
              <p className="text-center text-xs font-bold text-on-surface-variant">Application takes less than 3 minutes.</p>
            </div>

            {restaurant && (
              <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_4px_20px_rgba(29,53,87,0.05)]">
                <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-4">Restaurant</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-surface-container-high rounded-full flex items-center justify-center overflow-hidden shrink-0">
                    {restaurant.profile.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={restaurant.profile.logoUrl} alt={restaurant.restaurant} className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-secondary">storefront</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{restaurant.restaurant}</p>
                    {restaurant.profile.cuisine && <p className="text-xs font-bold text-on-surface-variant">{restaurant.profile.cuisine}</p>}
                  </div>
                </div>
                {locationLine && <p className="text-sm text-on-surface-variant mb-4">{locationLine}</p>}
                <Link href={`/r/${restaurant.id}`} className="block text-center py-2 text-primary text-sm font-semibold hover:underline">
                  View Restaurant Page
                </Link>
              </div>
            )}
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
