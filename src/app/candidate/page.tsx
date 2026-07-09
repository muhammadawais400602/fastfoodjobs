import Link from "next/link";
import CandidateShell from "@/components/candidate/CandidateShell";
import Stepper from "@/components/candidate/Stepper";
import { getSession } from "@/lib/auth";
import { getCandidate, getCandidateApplications } from "@/lib/candidate";

export const dynamic = "force-dynamic";

export default async function CandidateDashboard() {
  const session = await getSession();
  const [apps, profile] = await Promise.all([
    getCandidateApplications(session!.email),
    getCandidate(session!.id),
  ]);
  const interviews = apps.filter((a) => a.status === "interview").length;

  const cards = [
    { label: "Jobs Applied", value: apps.length, icon: "work" },
    { label: "Interview Invites", value: interviews, icon: "event_available" },
    { label: "Saved Jobs", value: profile?.savedJobs.length ?? 0, icon: "bookmark" },
  ];

  return (
    <CandidateShell active="Dashboard" title="My Career Path" subtitle="Track your progress and manage your journey.">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {cards.map((c) => (
          <div key={c.label} className="bg-white p-6 rounded-xl border border-[#e4bebc] shadow-[0px_4px_20px_rgba(29,53,87,0.05)]">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs font-semibold text-[#586158] uppercase tracking-wider">{c.label}</p>
              <span className="material-symbols-outlined text-primary/30">{c.icon}</span>
            </div>
            <span className="text-[32px] font-bold text-primary">{c.value}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold">My Applications</h3>
        <Link href="/candidate/applications" className="text-primary text-sm font-semibold hover:underline">
          View all
        </Link>
      </div>

      {apps.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-[#e4bebc]">
          <p className="text-[#586158] mb-4">You haven&apos;t applied to any jobs yet.</p>
          <Link href="/candidate/jobs" className="inline-block bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold">
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {apps.slice(0, 5).map((a) => (
            <div key={a.id} className="bg-white p-6 rounded-xl border border-[#e4bebc] shadow-[0px_4px_20px_rgba(29,53,87,0.05)]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                <h4 className="text-lg font-bold">
                  {a.jobTitle} {a.restaurant && <span className="text-[#586158] font-medium">@ {a.restaurant}</span>}
                </h4>
                <span className="text-xs font-semibold text-[#586158]">Applied {new Date(a.createdAt).toLocaleDateString()}</span>
              </div>
              <Stepper status={a.status} />
              {a.status === "interview" && (
                <div className="mt-4 p-3 bg-[#e7eeff] rounded-lg flex items-center justify-between">
                  <p className="text-sm font-semibold">Interview stage — check your messages for details.</p>
                  <Link href="/candidate/messages" className="text-primary font-bold text-sm hover:underline">
                    Open chat
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </CandidateShell>
  );
}
