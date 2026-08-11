// src/app/manifest.ts
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Octa Receipt Generator",
    short_name: "OctaReceipt",
    description: "Official Receipt & Invoice Management Application for Octavian Dynamics Enterprises Ltd",
    start_url: "/",
    display: "standalone",
    background_color: "#09090B", // Brand Black
    theme_color: "#DC2626",      // Brand Red
    icons: [
      {
        src: "/img/Octa-logo.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/img/Octa-logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}