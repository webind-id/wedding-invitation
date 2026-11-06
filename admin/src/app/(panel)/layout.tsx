import { requireAdmin } from "@/lib/auth";
import { Sidebar } from "@/components/Sidebar";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[15rem_1fr]">
      <Sidebar username={admin.username} />
      <div className="min-w-0 px-4 pb-16 pt-6 sm:px-8 lg:pt-10">{children}</div>
    </div>
  );
}
