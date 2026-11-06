/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "same-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-Robots-Tag", value: "noindex, nofollow" },
];

const nextConfig = {
  poweredByHeader: false,
  // Halaman /panduan membaca docs/SUBDOMAIN.md saat runtime.
  outputFileTracingIncludes: { "/panduan": ["./docs/**/*"] },
  experimental: {
    // Upload foto/musik lewat server action.
    serverActions: { bodySizeLimit: "12mb" },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
