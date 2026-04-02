import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AfixI — Part Replacement Consultant",
    short_name: "AfixI",
    description:
      "Scan, analyze, and get AI-powered 3D printing recommendations for replacement parts.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a1a0f",
    theme_color: "#16a34a",
    orientation: "any",
    categories: ["utilities", "productivity"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
