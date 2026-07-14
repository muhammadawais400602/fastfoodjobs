import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ApplicationForm from "@/components/ApplicationForm";
import { getPublicJob } from "@/lib/public";
import { getSession } from "@/lib/auth";
import { getCandidate } from "@/lib/candidate";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await getPublicJob(id);
  return { title: data ? `Apply for ${data.job.jobTitle} | FastFoodJobs` : "Apply | FastFoodJobs" };
}

export default async function ApplyJobPage({ params }: Props) {
  const { id } = await params;
  const data = await getPublicJob(id);
  if (!data) notFound();
  const { job, restaurant } = data;

  const session = await getSession();
  const candidate = session?.role === "candidate" ? await getCandidate(session.id) : null;

  // A candidate can only apply once per job — if they already did, show their chat instead of the form.
  let existingChatUrl: string | null = null;
  if (candidate?.email) {
    try {
      const db = await getDb();
      const existing = await db
        .collection("applications")
        .findOne({ jobId: job.id, email: candidate.email.toLowerCase() });
      if (existing) existingChatUrl = existing.chatToken ? `/chat/${existing.chatToken}` : "/candidate/applications";
    } catch {
      // If the check fails, the API's duplicate guard still catches it on submit.
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow py-16 md:py-20 px-6 pt-[112px] md:pt-[132px] relative overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 translate-x-1/2 -translate-y-1/4 opacity-10">
          <div className="w-[600px] h-[600px] bg-secondary rounded-full blur-[120px]"></div>
        </div>
        <div className="max-w-[720px] mx-auto">
          <div className="flex items-center gap-1 mb-6 text-xs font-bold text-on-surface-variant">
            <Link className="hover:text-primary" href={`/j/${job.id}`}>
              {job.jobTitle}
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-on-surface">Application Form</span>
          </div>

          <div className="mb-10">
            <h1 className="font-extrabold text-[36px] md:text-[48px] leading-[1.1] tracking-[-0.02em] text-primary mb-2">
              Join the Team
            </h1>
            <p className="text-lg leading-relaxed text-on-surface-variant">
              Applying for <span className="font-bold text-secondary">{job.jobTitle}</span>
              {restaurant ? ` at ${restaurant.restaurant}` : ""}.
            </p>
          </div>

          {existingChatUrl ? (
            <section className="bg-surface-container-lowest rounded-xl shadow-[0px_8px_30px_rgba(29,53,87,0.08)] border border-outline-variant/10 p-8 md:p-14 text-center animate-fade-in-up">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-fixed text-primary rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-[36px]">how_to_reg</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">You&apos;ve already applied</h2>
              <p className="text-on-surface-variant mb-8 max-w-md mx-auto">
                Your application for <span className="font-bold text-secondary">{job.jobTitle}</span>
                {restaurant ? ` at ${restaurant.restaurant}` : ""} is in. Each person can apply once per job — but you
                can message the restaurant any time.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Link
                  href={existingChatUrl}
                  className="bg-primary text-on-primary px-8 py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  Open your chat
                </Link>
                <Link
                  href="/candidate/applications"
                  className="border border-outline text-on-surface px-8 py-3 rounded-lg text-sm font-semibold flex items-center justify-center"
                >
                  View my applications
                </Link>
              </div>
            </section>
          ) : (
            <ApplicationForm
              jobSlug=""
              jobId={job.id}
              jobTitle={job.jobTitle}
              restaurant={restaurant?.restaurant ?? ""}
              defaultName={candidate?.name}
              defaultEmail={candidate?.email}
              defaultPhone={candidate?.phone}
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
