import type { MetadataRoute } from "next";
import type { Prisma } from "@/app/generated/prisma/client";
import {
  CompanyAccessStatus,
  ShiftStatus,
  ShiftVisibility,
} from "@/app/generated/prisma/enums";
import { getEffectiveAccessStatus } from "@/lib/company-access";
import {
  companyHasPublicProfile,
  sanitizeDisplayValue,
} from "@/lib/company-profile-page-data";
import { stripCompanyProfileMeta } from "@/lib/company-profile-meta";

export const SITEMAP_BASE_URL = "https://flexofficers.com";

export function buildPublicShiftSitemapWhere(
  now: Date = new Date()
): Prisma.ShiftWhereInput {
  return {
    visibility: ShiftVisibility.PUBLIC,
    status: ShiftStatus.OPEN,
    startTime: {
      gt: now,
    },
  };
}

export type SitemapCompanyRecord = {
  id: string;
  companyName: string;
  description: string | null;
  city: string | null;
  state: string | null;
  website: string | null;
  accessStatus: CompanyAccessStatus;
  trialEndsAt: Date | null;
  updatedAt: Date;
};

export function isCompanyEligibleForSitemap(
  company: SitemapCompanyRecord,
  now: Date = new Date()
) {
  if (getEffectiveAccessStatus(company, now) === CompanyAccessStatus.EXPIRED) {
    return false;
  }

  return companyHasPublicProfile({
    companyName: company.companyName,
    description: stripCompanyProfileMeta(company.description),
    city: sanitizeDisplayValue(company.city),
    state: sanitizeDisplayValue(company.state),
    website: sanitizeDisplayValue(company.website),
  });
}

export function buildStaticSitemapEntries(
  now: Date = new Date()
): MetadataRoute.Sitemap {
  return [
    {
      url: SITEMAP_BASE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITEMAP_BASE_URL}/sign-in`,
      lastModified: now,
    },
    {
      url: `${SITEMAP_BASE_URL}/sign-up`,
      lastModified: now,
    },
  ];
}

/** Future city landing pages — add entries here when published. */
export function buildFutureCitySitemapEntries(): MetadataRoute.Sitemap {
  return [
    // {
    //   url: `${SITEMAP_BASE_URL}/security-jobs-orlando`,
    //   changeFrequency: "weekly",
    //   priority: 0.7,
    // },
  ];
}

export function buildSitemapEntries(input: {
  shifts: { id: string; updatedAt: Date }[];
  companies: SitemapCompanyRecord[];
  now?: Date;
}): MetadataRoute.Sitemap {
  const now = input.now ?? new Date();

  const shiftEntries: MetadataRoute.Sitemap = input.shifts.map((shift) => ({
    url: `${SITEMAP_BASE_URL}/shifts/${shift.id}`,
    lastModified: shift.updatedAt,
    changeFrequency: "daily",
    priority: 0.9,
  }));

  const companyEntries: MetadataRoute.Sitemap = input.companies
    .filter((company) => isCompanyEligibleForSitemap(company, now))
    .map((company) => ({
      url: `${SITEMAP_BASE_URL}/companies/${company.id}`,
      lastModified: company.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  return [
    ...buildStaticSitemapEntries(now),
    ...shiftEntries,
    ...companyEntries,
    ...buildFutureCitySitemapEntries(),
  ];
}
