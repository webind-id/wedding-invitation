"use client";

import { useEffect, type ReactNode } from "react";

interface SkeletonProps {
  /** Tiruan UI asli; teksnya hanya dipakai untuk mengukur bentuk shimmer (tidak terlihat). */
  children: ReactNode;
  /** Diumumkan pembaca layar selama memuat. */
  label?: string;
  /** Ulang baris templat sebanyak n (untuk daftar). */
  count?: number;
  countGap?: number;
  className?: string;
}

/**
 * Kerangka loading berbasis phantom-ui: membungkus tiruan UI asli dan menggambar shimmer
 * tepat di posisi tiap elemen. Komponen Lit hanya dimuat di browser (butuh API DOM);
 * sebelum itu, isinya sudah disembunyikan oleh phantom-ui/ssr.css di root layout.
 */
export function Skeleton({ children, label = "Memuat…", count, countGap, className }: SkeletonProps) {
  useEffect(() => {
    import("@aejkatappaja/phantom-ui").catch(() => {
      // Gagal memuat komponen: tiruan tetap tersembunyi oleh ssr.css, halaman asli tetap datang.
    });
  }, []);

  return (
    <phantom-ui
      loading
      animation="shimmer"
      background-color="rgba(29, 28, 26, 0.07)"
      shimmer-color="rgba(255, 253, 249, 0.85)"
      fallback-radius={6}
      loading-label={label}
      count={count}
      count-gap={countGap}
      className={className ?? "block"}
    >
      {children}
    </phantom-ui>
  );
}
