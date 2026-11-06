"use client";

import { useEffect, useState } from "react";
import { timeLeftUntil, type TimeLeft } from "@/lib/datetime";

/** Hitung mundur per detik. null pada render pertama agar SSR & hydration cocok. */
export function useCountdown(targetIso: string): TimeLeft | null {
  const [left, setLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const target = new Date(targetIso).getTime();
    const tick = () => setLeft(timeLeftUntil(target, Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  return left;
}
