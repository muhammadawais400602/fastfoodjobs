import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SaveJobButton from "@/components/SaveJobButton";
import { jobs, getJob, mapImage } from "@/data/jobs";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return jobs.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = getJob(slug);
  return {
    title: job ? `${job.title} at ${job.company} | FastFoodJobs` : "Job | FastFoodJobs",
    description: job?.about,
  };
}

export default async function JobPage({ params }: Props) {
  const { slug } = await params;
  const job = getJob(slug);
  if (!job) notFound();

  return (
    <>
      <Navbar />
      <main className="max-w-[1280px] mx-auto px-6 py-10 pt-[88px]">
        {/* Back link */}
        <div className="mb-6 flex items-center gap-1">
          <span className="material-symbols-outlined text-on-surface-variant text-[20px]">chevron_left</span>
          <Link href="/jobs" className="text-xs font-bold text-on-surface-variant hover:text-primary transition-all">
            Back to Job Search
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left column */}
          <article className="lg:col-span-8">
            {/* Header card */}
            <div className="bg-surface-container-lowest rounded-xl p-6 md:p-10 shadow-[0px_4px_20px_rgba(29,53,87,0.05)] mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-outline-variant flex-shrink-0">
                    <img className="w-full h-full object-cover" alt={`${job.company} logo`} src={job.logo} />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-[32px] font-bold leading-tight text-on-surface mb-2">{job.title}</h1>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/restaurants/${job.companySlug}`}
                        className="text-base font-bold text-secondary hover:underline"
                      >
                        {job.company}
                      </Link>
                      <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                      <span className="text-sm font-semibold text-on-surface-variant">{job.city}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <span
                      key={tag.label}
                      className={
                        tag.highlight
                          ? "bg-secondary-fixed text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold"
                          : "bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-xs font-bold"
                      }
                    >
                      {tag.label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-outline-variant pt-6">
                {[
                  { label: "Salary", value: job.salary },
                  { label: "Experience", value: job.experience },
                  { label: "Shift", value: job.shift },
                  { label: "Posted", value: job.posted },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">{item.label}</p>
                    <p className="text-base text-on-surface font-bold">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Job content */}
            <div className="bg-surface-container-lowest rounded-xl p-6 md:p-10 shadow-[0px_4px_20px_rgba(29,53,87,0.05)] space-y-10">
              <section>
                <h2 className="text-2xl font-bold leading-snug text-on-surface mb-6">About the Role</h2>
                <p className="text-base text-on-surface-variant leading-relaxed">{job.about}</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold leading-snug text-on-surface mb-6">Key Responsibilities</h2>
                <ul className="space-y-3">
                  {job.responsibilities.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="material-symbols-outlined text-primary text-[20px] shrink-0">check_circle</span>
                      <span className="text-base text-on-surface-variant">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold leading-snug text-on-surface mb-6">Requirements</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {job.requirements.map((item) => (
                    <li
                      key={item}
                      className="bg-surface p-3 rounded-lg border border-outline-variant/10 text-base text-on-surface-variant"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold leading-snug text-on-surface mb-6">Benefits &amp; Perks</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {job.benefits.map((b) => (
                    <div key={b.label} className="text-center p-6 bg-surface-container-high/30 rounded-xl">
                      <span className="material-symbols-outlined text-secondary text-[32px] mb-2">{b.icon}</span>
                      <p className="text-sm font-semibold text-on-surface">{b.label}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </article>

          {/* Right column */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Apply card */}
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_8px_30px_rgba(29,53,87,0.12)] border border-primary/10">
              <Link
                href={`/apply/${job.slug}`}
                className="block w-full bg-primary text-on-primary py-5 rounded-lg text-xl font-bold mb-4 active:scale-95 transition-all hover:bg-primary-container shadow-md text-center"
              >
                Apply for this Job
              </Link>
              <SaveJobButton slug={job.slug} />
              <p className="text-center mt-4 text-xs font-bold text-on-surface-variant">
                Application takes less than 3 minutes.
              </p>
            </div>

            {/* Franchise info */}
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_4px_20px_rgba(29,53,87,0.05)]">
              <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-6">
                Franchise Information
              </h3>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-surface-container-high rounded-full flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-secondary">corporate_fare</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">{job.franchise.name}</p>
                  <p className="text-xs font-bold text-on-surface-variant">{job.franchise.since}</p>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-on-surface-variant">Locations:</span>
                  <span className="text-on-surface">{job.franchise.locations}</span>
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-on-surface-variant">Employee Rating:</span>
                  <span className="text-secondary flex items-center gap-1">
                    {job.franchise.rating} <span className="material-symbols-outlined text-[14px]">star</span>
                  </span>
                </div>
              </div>
              <Link
                href={`/restaurants/${job.companySlug}`}
                className="block text-center py-2 text-primary text-sm font-semibold hover:underline"
              >
                View Franchise Profile
              </Link>
            </div>

            {/* Map */}
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(29,53,87,0.05)]">
              <div className="h-48 relative">
                <div
                  className="absolute inset-0 bg-surface-container-high bg-cover bg-center"
                  style={{ backgroundImage: `url('${mapImage}')` }}
                ></div>
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-3 rounded-lg flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
                  <span className="text-xs font-bold text-on-surface">{job.mapAddress}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
