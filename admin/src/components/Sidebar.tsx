"use client";

import { BookOpen, Globe, LayoutDashboard, LayoutTemplate, LogOut, Mails } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/masuk/actions";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/", label: "Ringkasan", icon: LayoutDashboard, exact: true },
  { href: "/undangan", label: "Undangan", icon: Mails, exact: false },
  { href: "/template", label: "Template", icon: LayoutTemplate, exact: false },
  { href: "/domain", label: "Domain", icon: Globe, exact: false },
  { href: "/panduan", label: "Panduan", icon: BookOpen, exact: false },
];

export function Sidebar({ username }: { username: string }) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 z-30 flex items-center gap-2 border-b border-white/10 bg-ink px-4 py-3 text-paper lg:h-screen lg:flex-col lg:items-stretch lg:gap-0 lg:border-b-0 lg:px-4 lg:py-6">
      <Link href="/" className="mr-auto font-display text-xl italic lg:mb-8 lg:mr-0 lg:px-3">
        Kudo<span className="text-clay">.</span>
      </Link>

      <nav aria-label="Navigasi utama" className="flex gap-1 lg:flex-col">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-paper/60 transition hover:bg-white/5 hover:text-paper",
                isActive && "bg-white/10 text-paper",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          );
        })}
      </nav>

      <form action={logout} className="lg:mt-auto lg:border-t lg:border-white/10 lg:pt-4">
        <p className="hidden px-3 text-xs text-paper/40 lg:block">Masuk sebagai</p>
        <p className="hidden truncate px-3 text-sm font-semibold lg:block">{username}</p>
        <button
          type="submit"
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-paper/60 hover:bg-white/5 hover:text-paper lg:mt-2 lg:w-full"
        >
          <LogOut className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">Keluar</span>
        </button>
      </form>
    </aside>
  );
}
