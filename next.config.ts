import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  // Next.js 16 uses Turbopack by default; Serwist needs webpack for the SW build
  turbopack: {},
  // Allow dev resource requests from local network devices (Tailscale, LAN, etc.)
  allowedDevOrigins: ["100.67.2.207"],
};

export default withSerwist(nextConfig);
