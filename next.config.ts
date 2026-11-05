import path from "path";
import type { NextConfig } from "next";

const backendUrl = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080").replace(
  /\/$/,
  "",
);

/** Same-origin `/api` proxy keeps session cookies on the frontend host (fixes Chrome/Brave). */
const useSameOriginApi = process.env.NEXT_PUBLIC_USE_SAME_ORIGIN_API !== "false";

const nextConfig: NextConfig = {
  // Pin the app root so Turbopack does not walk up to tax-buddy/ and
  // fail to resolve next/package.json ("Next.js package not found").
  turbopack: {
    root: path.resolve(__dirname),
  },
  async rewrites() {
    if (!useSameOriginApi) return [];
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
