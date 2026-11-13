"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const TABS = [
  { slug: "", label: "Konten" },
  { slug: "formulir", label: "Formulir klien" },
  { slug: "tamu", label: "Tamu & kirim" },
  { slug: "ucapan", label: "RSVP & ucapan" },
  { slug: "pengaturan", label: "Pengaturan" },
];

export function InvitationTabs({ id }: { id: string }) {
  const pathname = usePathname();
  const base = `/undangan/${id}`;

  return (
    <nav aria-label="Bagian undangan" className="no-scrollbar -mx-4 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0">
      <ul className="flex gap-1">
        {TABS.map((tab) => {
          const href = tab.slug ? `${base}/${tab.slug}` : base;
          const isActive = pathname === href;
          return (
            <li key={tab.slug}>
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "-mb-px block whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition",
                  isActive ? "border-clay text-ink" : "border-transparent text-muted hover:text-ink",
                )}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
