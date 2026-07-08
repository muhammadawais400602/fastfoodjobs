import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ApplicationForm from "@/components/ApplicationForm";
import { jobs, getJob } from "@/data/jobs";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return jobs.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = getJob(slug);
  return {
    title: job ? `Apply for ${job.title} at ${job.company} | FastFoodJobs` : "Apply Now | FastFoodJobs",
    description: job ? `Apply for the ${job.title} position at ${job.company}.` : undefined,
  };
}

export default async function ApplyPage({ params }: Props) {
  const { slug } = await params;
  const job = getJob(slug);
  if (!job) notFound();

  return (
    <>
      <Navbar />
      <main className="flex-grow py-16 md:py-20 px-6 pt-[112px] md:pt-[132px] relative overflow-hidden">
        {/* Atmospheric background */}
        <div className="absolute top-0 right-0 -z-10 translate-x-1/2 -translate-y-1/4 opacity-10">
          <div className="w-[600px] h-[600px] bg-secondary rounded-full blur-[120px]"></div>
        </div>
        <div className="absolute bottom-0 left-0 -z-10 -translate-x-1/4 translate-y-1/4 opacity-10">
          <div className="w-[500px] h-[500px] bg-primary rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-[720px] mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1 mb-6 text-xs font-bold text-on-surface-variant">
            <Link className="hover:text-primary" href="/jobs">
              Job Search
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <Link className="hover:text-primary" href={`/jobs/${job.slug}`}>
              {job.title}
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-on-surface">Application Form</span>
          </div>

          {/* Page header */}
          <div className="mb-10">
            <h1 className="font-extrabold text-[36px] md:text-[48px] leading-[1.1] tracking-[-0.02em] text-primary mb-2">
              Join the Team
            </h1>
            <p className="text-lg leading-relaxed text-on-surface-variant">
              Applying for <span className="font-bold text-secondary">{job.title}</span> at {job.company}.
            </p>
          </div>

          <ApplicationForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
