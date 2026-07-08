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

  return (
    <>
      <Navbar />
      <main className="max-w-[1280px] mx-auto px-6 py-10 pt-[88px]">
        {restaurant && (
          <Link href={`/r/${restaurant.id}`} className="text-xs font-bold text-on-surface-variant hover:text-primary flex items-center gap-1 mb-6">
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            Back to {restaurant.restaurant}
          </Link>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <article className="lg:col-span-8 space-y-6">
            <div className="bg-surface-container-lowest rounded-xl p-6 md:p-10 shadow-[0px_4px_20px_rgba(29,53,87,0.05)]">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                <div>
                  <h1 className="text-2xl md:text-[32px] font-bold leading-tight mb-2">{job.jobTitle}</h1>
                  {restaurant && (
                    <Link href={`/r/${restaurant.id}`} className="text-base font-bold text-secondary hover:underline">
                      {restaurant.restaurant}
                    </Link>
                  )}
                </div>
                <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-xs font-bold">
                  {job.jobType}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-6 border-t border-outline-variant pt-6">
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Rate</p>
                  <p className="text-base font-bold">{job.rate || "—"}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Location</p>
                  <p className="text-base font-bold">{restaurant?.profile.address || "—"}</p>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-6 md:p-10 shadow-[0px_4px_20px_rgba(29,53,87,0.05)]">
              <h2 className="text-2xl font-bold mb-6">About the Role</h2>
              <p className="text-base text-on-surface-variant leading-relaxed whitespace-pre-line">{job.description}</p>
            </div>
          </article>

          <aside className="lg:col-span-4">
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_8px_30px_rgba(29,53,87,0.12)] border border-primary/10">
              <Link
                href={`/apply/job/${job.id}`}
                className="block w-full bg-primary text-on-primary py-5 rounded-lg text-xl font-bold mb-4 text-center active:scale-95 transition-all hover:bg-primary-container shadow-md"
              >
                Apply for this Job
              </Link>
              <p className="text-center text-xs font-bold text-on-surface-variant">Application takes less than 3 minutes.</p>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
