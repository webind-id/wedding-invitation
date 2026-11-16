/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig = {
  poweredByHeader: false,
  // Server mandiri (.next/standalone) untuk image Docker; Vercel tetap berjalan seperti biasa.
  output: "standalone",
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // Foto contoh kini .webp. Undangan lama di database masih bisa menyimpan path
  // /images/*.jpg (isi awal dari sample.ts) — layani dengan berkas .webp yang sama.
  async rewrites() {
    return [{ source: "/images/:name.jpg", destination: "/images/:name.webp" }];
  },
};

export default nextConfig;
