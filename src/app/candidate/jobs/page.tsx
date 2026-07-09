import CandidateShell from "@/components/candidate/CandidateShell";
import JobsBrowser from "@/components/candidate/JobsBrowser";
import { getSession } from "@/lib/auth";
import { getCandidate } from "@/lib/candidate";
import { getAllActiveJobs } from "@/lib/public";

export const dynamic = "force-dynamic";

export default async function CandidateJobs() {
  const session = await getSession();
  const [jobs, profile] = await Promise.all([getAllActiveJobs(), getCandidate(session!.id)]);

  return (
    <CandidateShell active="Job Listings" title="Find Your Next Shift" subtitle={`${jobs.length} open positions`}>
      <JobsBrowser jobs={jobs} savedIds={profile?.savedJobs ?? []} />
    </CandidateShell>
  );
}
