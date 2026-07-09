import Link from "next/link";
import CandidateShell from "@/components/candidate/CandidateShell";
import JobsBrowser from "@/components/candidate/JobsBrowser";
import { getSession } from "@/lib/auth";
import { getCandidate } from "@/lib/candidate";
import { getJobsByIds } from "@/lib/public";

export const dynamic = "force-dynamic";

export default async function CandidateSaved() {
  const session = await getSession();
  const profile = await getCandidate(session!.id);
  const jobs = await getJobsByIds(profile?.savedJobs ?? []);

  return (
    <CandidateShell active="Saved Jobs" title="Saved Jobs" subtitle="Your bookmarked roles.">
      {jobs.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-[#e4bebc]">
          <p className="text-[#586158] mb-4">No saved jobs yet. Tap the bookmark on any job to save it.</p>
          <Link href="/candidate/jobs" className="inline-block bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold">
            Browse Jobs
          </Link>
        </div>
      ) : (
        <JobsBrowser jobs={jobs} savedIds={profile?.savedJobs ?? []} />
      )}
    </CandidateShell>
  );
}
