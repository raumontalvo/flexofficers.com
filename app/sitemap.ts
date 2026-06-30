import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://flexofficers.com",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://flexofficers.com/sign-in",
      lastModified: new Date(),
    },
    {
      url: "https://flexofficers.com/sign-up",
      lastModified: new Date(),
    },
  ];
}
