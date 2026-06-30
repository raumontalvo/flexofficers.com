import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FlexOfficers",
    short_name: "FlexOfficers",
    description:
      "Security staffing marketplace connecting licensed security officers with security companies.",
    start_url: "/",
    display: "standalone",
    background_color: "#050816",
    theme_color: "#2563eb",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
