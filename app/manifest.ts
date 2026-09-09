import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Open Human",
    short_name: "Open Human",
    description:
      "The open-source manual for being human. Panduan sumber terbuka untuk memahami manusia.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f2e9",
    theme_color: "#173a31",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
