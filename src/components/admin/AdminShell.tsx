import Link from "next/link";
import { getSession } from "@/lib/auth";
import LogoutButton from "@/components/admin/LogoutButton";

const nav = [
  { label: "Dashboard", icon: "dashboard", href: "/admin" },
  { label: "Job Listings", icon: "work", href: "/admin/listings" },
  { label: "Applications", icon: "group", href: "/admin/applications" },
  { label: "Messages", icon: "mail", href: "/admin/messages" },
  { label: "Team Management", icon: "groups", href: "/admin/team" },
  { label: "Settings", icon: "settings", href: "/admin/settings" },
];

export default async function AdminShell({
  active,
  title,
  subtitle,
  actions,
  children,
}: {
  active: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#001b3c]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-[260px] bg-[#183153] shadow-lg z-50 flex flex-col py-6">
        <div className="px-6 mb-10">
          <h1 className="text-2xl font-extrabold text-white leading-none">FastFoodJobs</h1>
          <p className="text-white/50 text-[10px] uppercase tracking-widest mt-1">Recruitment Portal</p>
        </div>
        <nav className="flex-1 space-y-1">
          {nav.map((item) => {
            const isActive = item.label === active;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={
                  isActive
                    ? "flex items-center gap-3 px-6 py-3 bg-[#b7102a]/15 text-white border-l-4 border-[#b7102a] font-bold"
                    : "flex items-center gap-3 px-6 py-3 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                }
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="text-sm font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="px-6 pt-6 mt-auto border-t border-white/10">
          <p className="text-white text-sm font-semibold truncate">{session?.restaurant ?? "Restaurant"}</p>
          <p className="text-white/50 text-[10px] uppercase tracking-widest truncate">{session?.email}</p>
          <LogoutButton />
        </div>
      </aside>

      {/* Main */}
      <div className="ml-[260px]">
        <header className="sticky top-0 z-40 bg-[#f9f9ff] border-b border-[#e4bebc] h-16 flex items-center justify-between px-6">
          <span className="text-sm font-semibold text-[#586158]">{title}</span>
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-[#586158]">notifications</span>
            <span className="material-symbols-outlined text-[#586158]">help</span>
            <div className="h-8 w-px bg-[#e4bebc]" />
            <span className="text-sm font-semibold text-[#b7102a]">{session?.restaurant}</span>
          </div>
        </header>

        <main className="p-8 max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-[32px] font-bold leading-tight">{title}</h2>
              {subtitle && <p className="text-[#586158] mt-1">{subtitle}</p>}
            </div>
            {actions}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
