import AdminShell from "@/components/admin/AdminShell";
import AddTeamMember from "@/components/admin/AddTeamMember";
import { getTeam } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const team = await getTeam();
  const onShift = team.filter((t) => t.status === "on_shift").length;

  const stats = [
    { label: "Total Staff", value: team.length },
    { label: "On Shift", value: onShift },
    { label: "Off Duty", value: team.length - onShift },
  ];

  return (
    <AdminShell
      active="Team Management"
      title="Team Roster"
      subtitle="Manage your kitchen and floor staff."
      actions={<AddTeamMember />}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white p-6 rounded-xl border border-[#e4bebc] shadow-[0px_4px_20px_rgba(29,53,87,0.05)]">
            <span className="text-xs text-[#586158] uppercase font-semibold tracking-wider">{s.label}</span>
            <p className="text-[32px] font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-[#e4bebc] shadow-[0px_4px_20px_rgba(29,53,87,0.05)] overflow-hidden">
        <div className="px-6 py-4 bg-[#f0f3ff] border-b border-[#e4bebc]">
          <h3 className="text-sm font-semibold">Employee Directory</h3>
        </div>
        {team.length === 0 ? (
          <p className="px-6 py-16 text-center text-[#586158]">
            No team members yet. Click <span className="font-semibold">Add Team Member</span> to start your roster.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#f0f3ff]">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-[#586158] uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#586158] uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#586158] uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#586158] uppercase tracking-wider">Shift</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#586158] uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e4bebc]">
                {team.map((m) => (
                  <tr key={m._id} className="hover:bg-[#f0f3ff] transition-colors">
                    <td className="px-6 py-4 font-medium">{m.name}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-[#b7102a]/5 text-[#b7102a] rounded-full text-xs font-semibold">{m.role}</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <p>{m.email || "—"}</p>
                      <p className="text-[#586158]">{m.phone}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#586158]">{m.shift || "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[11px] font-bold uppercase tracking-wider ${m.status === "on_shift" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                        {m.status === "on_shift" ? "On Shift" : "Off Duty"}
                      </span>
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
