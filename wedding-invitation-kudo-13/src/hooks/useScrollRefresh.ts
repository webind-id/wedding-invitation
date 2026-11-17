"use client";

import { useEffect, type RefObject } from "react";
import { ScrollTrigger } from "./useScrollScene";

const DEBOUNCE_MS = 200;

/**
 * Hitung ulang posisi ScrollTrigger saat tinggi konten berubah (buku tamu dimuat,
 * ucapan baru masuk, amplop hadiah dibuka) — agar parallax & reveal di bawahnya tetap tepat.
 */
export function useScrollRefresh(target: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = target.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let lastHeight = el.offsetHeight;
    const observer = new ResizeObserver(() => {
      if (el.offsetHeight === lastHeight) return;
      lastHeight = el.offsetHeight;
      clearTimeout(timer);
      timer = setTimeout(() => ScrollTrigger.refresh(), DEBOUNCE_MS);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [target]);
}
