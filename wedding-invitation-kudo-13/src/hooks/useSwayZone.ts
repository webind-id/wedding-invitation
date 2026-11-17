"use client";

import { useEffect, type RefObject } from "react";

/**
 * Pohon & ranting hanya bergoyang saat bagiannya terlihat: kelas `is-swaying` ditambahkan pada
 * elemen saat masuk layar dan dilepas saat keluar (animasi `.sway-*` di globals.css berhenti),
 * agar ponsel tidak terus menggambar ulang SVG besar yang tak terlihat.
 * prefers-reduced-motion: tidak pernah bergoyang.
 */
export function useSwayZone(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([entry]) => el.classList.toggle("is-swaying", entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => {
      io.disconnect();
      el.classList.remove("is-swaying");
    };
  }, [ref]);
}
