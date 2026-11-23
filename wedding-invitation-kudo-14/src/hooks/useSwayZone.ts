"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Tanaman bergoyang & kupu-kupu mengepak hanya saat bagiannya terlihat. Hook ini mengembalikan
 * kelas `"is-swaying"` (atau `""`) untuk dipasang pada className elemen itu sendiri — animasi
 * `.sway-plant` / `.kupu-wing` di globals.css berjalan hanya di bawah kelas ini, agar ponsel tidak
 * terus menggambar ulang gambar besar yang tak terlihat.
 *
 * Sengaja berupa state React, bukan `classList.add`: elemen yang className-nya berubah saat
 * render ulang (mis. Hero `played` → `parted`) akan menghapus kelas yang ditambahkan manual.
 * prefers-reduced-motion: tidak pernah bergoyang.
 */
export function useSwayZone(ref: RefObject<HTMLElement | null>): string {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);

  return isVisible ? "is-swaying" : "";
}
