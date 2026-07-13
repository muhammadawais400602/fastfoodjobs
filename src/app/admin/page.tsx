import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { getApplications, getPostings, positionOf } from "@/lib/data";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

const statusStyle: Record<string, string> = {
  new: "bg-[#b7102a]/10 text-[#b7102a]",
  reviewed: "bg-blue-50 text-blue-700",
  interview: "bg-[#286182]/10 text-[#286182]",
  hire: "bg-green-100 text-green-800",
  reject: "bg-[#ffdad6] text-[#93000a]",
};

export default async function DashboardPage() {
  const session = await getSession();
  const [applications, postings] = await Promise.all([
    getApplications(session!.restaurant),
    getPostings(session!.restaurant),
  ]);
  const activeListings = postings.filter((p) => p.status === "active").length;
  const newApplicants = applications.filter((a) => a.status === "new").length;
  const recent = applications.slice(0, 5);

  const cards = [
    { label: "Active Listings", value: activeListings, icon: "list_alt", tint: "bg-[#b7102a]/10 text-[#b7102a]" },
    { label: "New Applicants", value: newApplicants, icon: "person_add", tint: "bg-[#286182]/10 text-[#286182]" },
    { label: "Total Applicants", value: applications.length, icon: "group", tint: "bg-[#586158]/10 text-[#586158]" },
  ];

  return (
    <AdminShell active="Dashboard" title="Recruitment Overview" subtitle="Manage your workforce and talent pipeline.">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 stagger-children">
        {cards.map((c) => (
          <div key={c.label} className="bg-white p-6 rounded-xl border border-[#e4bebc] shadow-[0px_4px_20px_rgba(29,53,87,0.05)] card-lift">
            <div className={`inline-flex p-3 rounded-lg mb-4 ${c.tint}`}>
              <span className="material-symbols-outlined">{c.icon}</span>
            </div>
            <p className="text-xs font-semibold text-[#586158] uppercase tracking-wider">{c.label}</p>
            <h3 className="text-[32px] font-bold mt-1">{c.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-[#e4bebc] shadow-[0px_4px_20px_rgba(29,53,87,0.05)] overflow-hidden">
        <div className="px-6 py-5 border-b border-[#e4bebc] flex justify-between items-center">
          <h4 className="text-2xl font-bold">Recent Applicants</h4>
          <Link href="/admin/applications" className="text-[#b7102a] text-sm font-semibold hover:underline">
            View All
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="px-6 py-12 text-center text-[#586158]">No applications yet.</p>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="bg-[#f0f3ff] text-[#586158] uppercase text-xs font-semibold text-left">
                <th className="px-6 py-4">Applicant</th>
                <th className="px-6 py-4">Position</th>
                <th className="px-6 py-4">Date Applied</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e4bebc]">
              {recent.map((a) => (
                <tr key={a._id} className="hover:bg-[#f0f3ff] transition-colors">
                  <td className="px-6 py-4 font-medium">{a.fullName}</td>
                  <td className="px-6 py-4 text-[#586158]">{positionOf(a)}</td>
                  <td className="px-6 py-4 text-sm text-[#586158]">{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${statusStyle[a.status] ?? statusStyle.new}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/applications/${a._id}`} className="text-[#b7102a] hover:underline text-sm font-semibold">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
