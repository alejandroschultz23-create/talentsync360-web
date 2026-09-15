import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    const privateHeaders = [
      { key: "Cache-Control", value: "private, no-store" },
      { key: "Referrer-Policy", value: "no-referrer" },
      { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
    ];
    return [
      {
        source: "/talents/evidence-review/access/:path*",
        headers: privateHeaders,
      },
      {
        source: "/talents/evidence-review/profile",
        headers: privateHeaders,
      },
      {
        source: "/talents/evidence-review/profile/:path*",
        headers: privateHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/empresas',
        destination: '/companies',
        permanent: true,
      },
      {
        source: '/contacto',
        destination: '/contact',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
