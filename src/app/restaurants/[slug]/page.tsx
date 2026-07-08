import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { profiles, getProfile } from "@/data/profiles";
import { jobSlug } from "@/data/jobs";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return profiles.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const profile = getProfile(slug);
  return {
    title: profile ? `${profile.name} | FastFoodJobs Profile` : "Restaurant | FastFoodJobs",
    description: profile?.about[0],
  };
}

export default async function RestaurantPage({ params }: Props) {
  const { slug } = await params;
  const profile = getProfile(slug);
  if (!profile) notFound();

  return (
    <>
      <Navbar />
      <main className="pt-14">
        {/* Hero branding */}
        <section className="relative w-full h-[320px] md:h-[450px] overflow-hidden">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url('${profile.heroImage}')` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-10 max-w-[1280px] mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              <div className="w-24 h-24 md:w-40 md:h-40 bg-surface rounded-xl shadow-lg flex items-center justify-center p-4 md:p-6 md:-mb-8 relative z-10 shrink-0">
                <img className="w-full h-full object-contain" alt={`${profile.name} logo`} src={profile.logo} />
              </div>
              <div className="flex-1 pb-2 md:pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-green-600 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-full">
                    Open Now
                  </span>
                  <span className="text-sm font-semibold text-surface flex items-center gap-1 opacity-90">
                    <span className="material-symbols-outlined text-[18px]">location_on</span>
                    {profile.city}
                  </span>
                </div>
                <h1 className="text-white font-extrabold text-[36px] md:text-[48px] leading-none tracking-[-0.02em] drop-shadow-md">
                  {profile.name}
                </h1>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-[1280px] mx-auto px-6 py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left column */}
            <div className="lg:col-span-8 space-y-10">
              {/* About */}
              <div className="bg-surface-container-lowest rounded-xl p-8 md:p-10 shadow-[0px_4px_20px_rgba(29,53,87,0.05)]">
                <h2 className="text-2xl font-bold leading-snug text-on-surface mb-6">
                  About {profile.name} {profile.city.split(",")[0]}
                </h2>
                {profile.about.map((paragraph, i) => (
                  <p
                    key={i}
                    className={`text-base text-on-surface-variant leading-relaxed ${i < profile.about.length - 1 ? "mb-6" : ""}`}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-2xl font-bold leading-snug text-on-surface mb-6">Branch Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {profile.amenities.map((a) => (
                    <div
                      key={a.label}
                      className="flex flex-col items-center justify-center p-6 bg-surface-container rounded-xl text-center border border-outline-variant hover:border-secondary transition-colors duration-300"
                    >
                      <span className="material-symbols-outlined text-primary text-[32px] mb-2">{a.icon}</span>
                      <span className="text-sm font-semibold text-on-surface-variant">{a.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Available jobs */}
              <div>
                <div className="flex justify-between items-end mb-6">
                  <h3 className="text-2xl font-bold leading-snug text-on-surface">Available Jobs</h3>
                  <span className="text-sm font-semibold text-primary">{profile.jobs.length} Openings</span>
                </div>
                <div className="space-y-6">
                  {profile.jobs.map((job) => (
                    <div
                      key={job.title}
                      className="flex flex-col md:flex-row justify-between items-start md:items-center bg-surface-container-lowest p-6 rounded-xl shadow-[0px_4px_20px_rgba(29,53,87,0.05)] border border-transparent hover:border-primary-container transition-all"
                    >
                      <div>
                        <h4 className="font-bold text-on-surface text-[20px] mb-2">{job.title}</h4>
                        <div className="flex flex-wrap items-center gap-3">
                          {job.tag && (
                            <span
                              className={
                                job.tag.style === "urgent"
                                  ? "bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded text-[12px] font-bold"
                                  : "bg-tertiary-fixed text-on-tertiary-fixed-variant px-2 py-0.5 rounded text-[12px] font-bold"
                              }
                            >
                              {job.tag.label}
                            </span>
                          )}
                          <span className="text-on-surface-variant text-xs font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">payments</span>
                            {job.rate}
                          </span>
                          <span className="text-on-surface-variant text-xs font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                            {job.schedule}
                          </span>
                        </div>
                      </div>
                      <Link
                        href={`/jobs/${jobSlug(profile.slug, job.title)}`}
                        className="mt-6 md:mt-0 w-full md:w-auto bg-primary text-on-primary px-10 py-2.5 rounded-lg text-sm font-semibold hover:shadow-lg transition-all text-center"
                      >
                        View Job
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column: info sidebar */}
            <div className="lg:col-span-4 space-y-6">
              {/* Branch info */}
              <div className="bg-surface shadow-[0px_8px_30px_rgba(29,53,87,0.12)] rounded-xl overflow-hidden border border-outline-variant">
                <div className="h-48 w-full bg-surface-container relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-primary p-2 rounded-full shadow-lg animate-bounce">
                      <span className="material-symbols-outlined text-white">location_on</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">Address</h4>
                    <p className="text-base text-on-surface">
                      {profile.address[0]}
                      <br />
                      {profile.address[1]}
                    </p>
                  </div>
                  <div className="border-t border-outline-variant pt-6">
                    <h4 className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">Contact</h4>
                    <p className="text-base text-on-surface">{profile.phone}</p>
                  </div>
                  <div className="border-t border-outline-variant pt-6">
                    <h4 className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">Operating Hours</h4>
                    <ul className="space-y-2 text-base text-on-surface-variant">
                      {profile.hours.map((h) => (
                        <li key={h.days} className="flex justify-between">
                          <span>{h.days}</span> <span className="font-bold">{h.time}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button className="w-full border-2 border-primary text-primary text-sm font-semibold py-3 rounded-lg hover:bg-primary-fixed transition-colors">
                    Get Directions
                  </button>
                </div>
              </div>

              {/* CTA card */}
              <div className="bg-primary text-on-primary rounded-xl p-8 space-y-6 relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <h4 className="text-2xl font-bold leading-tight">Ready to join the {profile.name} team?</h4>
                <p className="text-base opacity-90">
                  We&apos;re always looking for energetic individuals to join our {profile.city.split(",")[0]} family. Apply today!
                </p>
                <Link
                  href={`/apply/${jobSlug(profile.slug, profile.jobs[0].title)}`}
                  className="block w-full bg-white text-primary font-bold py-4 rounded-lg shadow-xl hover:scale-105 transition-transform text-center"
                >
                  Quick Apply
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
