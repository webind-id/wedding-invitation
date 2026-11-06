"use client";

import { motion } from "framer-motion";
import { CalendarDays, Gift, Heart, Images, MessageCircleHeart, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

interface DockItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const DOCK_ITEMS: DockItem[] = [
  { id: "mempelai", label: "Mempelai", icon: Heart },
  { id: "acara", label: "Acara", icon: CalendarDays },
  { id: "galeri", label: "Galeri", icon: Images },
  { id: "hadiah", label: "Hadiah", icon: Gift },
  { id: "ucapan", label: "Ucapan", icon: MessageCircleHeart },
];

/** Bagian yang paling banyak terlihat di layar saat ini. */
function useActiveSection(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -45% 0px", threshold: [0, 0.25, 0.5] },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

const IDS = DOCK_ITEMS.map((i) => i.id);

/** Dock navigasi mengambang di bawah kolom undangan. */
export function SectionDock() {
  const active = useActiveSection(IDS);

  return (
    <motion.nav
      aria-label="Navigasi bagian undangan"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      className="pointer-events-none fixed inset-x-0 bottom-3 z-40 flex justify-center px-4 lg:left-auto lg:w-[480px]"
    >
      <ul className="pointer-events-auto flex gap-1 rounded-full bg-forest/90 p-1.5 shadow-xl ring-1 ring-linen/10 backdrop-blur-md">
        {DOCK_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "flex h-10 items-center gap-1.5 rounded-full px-3 text-linen/70 transition-all duration-300 hover:text-linen",
                  isActive && "bg-linen text-forest hover:text-forest",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                <span className={cn("text-xs font-semibold", isActive ? "inline" : "sr-only")}>{label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </motion.nav>
  );
}
