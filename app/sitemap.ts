import type { MetadataRoute } from "next";
import {
  buildPublicShiftSitemapWhere,
  buildSitemapEntries,
} from "@/lib/sitemap-data";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const [shifts, companies] = await Promise.all([
    prisma.shift.findMany({
      where: buildPublicShiftSitemapWhere(now),
      select: {
        id: true,
        title: true,
        city: true,
        state: true,
        location: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    }),
    prisma.company.findMany({
      select: {
        id: true,
        companyName: true,
        description: true,
        city: true,
        state: true,
        website: true,
        accessStatus: true,
        trialEndsAt: true,
        updatedAt: true,
      },
    }),
  ]);

  return buildSitemapEntries({ shifts, companies, now });
}
