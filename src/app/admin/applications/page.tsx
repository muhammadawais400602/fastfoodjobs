import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { getApplications, positionFromSlug } from "@/lib/data";

export const dynamic = "force-dynamic";

const statusStyle: Record<string, string> = {
  new: "bg-[#b7102a]/10 text-[#b7102a]",
  reviewed: "bg-blue-50 text-blue-700",
  interview: "bg-[#286182]/10 text-[#286182]",
  hire: "bg-green-100 text-green-800",
  reject: "bg-[#ffdad6] text-[#93000a]",
};

export default async function ApplicationsPage() {
  const applications = await getApplications();

  return (
    <AdminShell active="Applications" title="Applications" subtitle={`${applications.length} total applicants`}>
      <div className="bg-white rounded-xl border border-[#e4bebc] shadow-[0px_4px_20px_rgba(29,53,87,0.05)] overflow-hidden">
        {applications.length === 0 ? (
          <p className="px-6 py-16 text-center text-[#586158]">No applications have come in yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f0f3ff] text-[#586158] uppercase text-xs font-semibold text-left">
                  <th className="px-6 py-4">Applicant</th>
                  <th className="px-6 py-4">Position</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Date Applied</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e4bebc]">
                {applications.map((a) => (
                  <tr key={a._id} className="hover:bg-[#f0f3ff] transition-colors">
                    <td className="px-6 py-4 font-medium">{a.fullName}</td>
                    <td className="px-6 py-4 text-[#586158]">{positionFromSlug(a.jobSlug)}</td>
                    <td className="px-6 py-4 text-sm text-[#586158]">{a.email}</td>
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
