import { getSession } from "@/lib/auth";
import PortalSidebar from "@/components/PortalSidebar";

const nav = [
  { label: "Dashboard", icon: "dashboard", href: "/candidate" },
  { label: "Job Listings", icon: "work", href: "/candidate/jobs" },
  { label: "Applications", icon: "description", href: "/candidate/applications" },
  { label: "Messages", icon: "mail", href: "/candidate/messages" },
  { label: "Saved Jobs", icon: "bookmark", href: "/candidate/saved" },
  { label: "Settings", icon: "settings", href: "/candidate/settings" },
];

export default async function CandidateShell({
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
      <PortalSidebar
        brand="FastFoodJobs Pro"
        brandSub="Candidate Portal"
        nav={nav}
        active={active}
        footerTitle={session?.name ?? ""}
        footerSub={session?.email ?? ""}
        headerTitle={title}
        headerRight={session?.name ?? ""}
      />

      <div className="lg:ml-[260px]">
        <main className="p-4 md:p-6 lg:p-8 max-w-[1440px] mx-auto animate-fade-in-up">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 md:mb-8">
            <div>
              <h2 className="text-2xl md:text-[32px] font-bold leading-tight">{title}</h2>
              {subtitle && <p className="text-[#586158] mt-1 text-sm md:text-base">{subtitle}</p>}
            </div>
            {actions}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
