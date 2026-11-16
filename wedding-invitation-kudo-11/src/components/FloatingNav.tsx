"use client";

import { Calendar, Gift, Heart, Home, Image as ImageIcon, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

const NAV_ITEMS = [
  { id: "hero", label: "Awal", icon: Home },
  { id: "couple", label: "Mempelai", icon: Heart },
  { id: "events", label: "Acara", icon: Calendar },
  { id: "gallery", label: "Galeri", icon: ImageIcon },
  { id: "gifts", label: "Kado", icon: Gift },
  { id: "rsvp", label: "Ucapan", icon: MessageSquare },
];

export function FloatingNav() {
  const [activeId, setActiveId] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveId(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      aria-label="Navigasi Menu Undangan"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-fit rounded-full border border-gold/25 bg-night-900/85 px-3 py-1.5 shadow-glow-sm backdrop-blur-md"
    >
      <ul className="flex items-center gap-1 sm:gap-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeId === item.id;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => scrollTo(item.id)}
                aria-label={`Loncat ke bagian ${item.label}`}
                className={cn(
                  "flex items-center gap-1 rounded-full px-2.5 py-1.5 font-sans text-xs transition-all duration-200",
                  isActive
                    ? "bg-ember font-medium text-night-950 shadow-glow-sm"
                    : "text-moon-muted hover:bg-night-700 hover:text-moon",
                )}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden />
                <span className="hidden md:inline text-[0.72rem]">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
