// src/app/manifest.ts
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Octa Receipt Generator",
    short_name: "OctaReceipt",
    description: "Official Receipt & Invoice Management Application for Octavian Dynamics Enterprises Ltd",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#09090B",      // Brand Black
    icons: [
      {
        src: "/img/octalogo.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/img/octalogo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}