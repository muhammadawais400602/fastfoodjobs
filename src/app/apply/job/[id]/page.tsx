import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ApplicationForm from "@/components/ApplicationForm";
import { getPublicJob } from "@/lib/public";
import { getSession } from "@/lib/auth";
import { getCandidate } from "@/lib/candidate";

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

          <ApplicationForm
            jobSlug=""
            jobId={job.id}
            jobTitle={job.jobTitle}
            restaurant={restaurant?.restaurant ?? ""}
            defaultName={candidate?.name}
            defaultEmail={candidate?.email}
            defaultPhone={candidate?.phone}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
