import { describe, expect, it } from "vitest";
import { CompanyAccessStatus } from "@/app/generated/prisma/enums";
import {
  buildPublicShiftSitemapWhere,
  buildSitemapEntries,
  buildStaticSitemapEntries,
  isCompanyEligibleForSitemap,
  SITEMAP_BASE_URL,
} from "@/lib/sitemap-data";

const now = new Date("2026-06-26T12:00:00.000Z");

describe("sitemap data", () => {
  it("limits public shift queries to open, public, upcoming shifts", () => {
    expect(buildPublicShiftSitemapWhere(now)).toEqual({
      visibility: "PUBLIC",
      status: "OPEN",
      startTime: {
        gt: now,
      },
    });
  });

  it("includes static marketing routes", () => {
    const entries = buildStaticSitemapEntries(now);

    expect(entries).toEqual([
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
    ]);
  });

  it("accepts active companies with completed public profiles", () => {
    expect(
      isCompanyEligibleForSitemap(
        {
          id: "company-1",
          companyName: "United States Security",
          description: "Professional security services.",
          city: "Fort Myers",
          state: "FL",
          website: null,
          accessStatus: CompanyAccessStatus.ACTIVE,
          trialEndsAt: null,
          updatedAt: now,
        },
        now
      )
    ).toBe(true);
  });

  it("rejects expired companies and incomplete profiles", () => {
    const baseCompany = {
      id: "company-1",
      companyName: "United States Security",
      description: "Professional security services.",
      city: "Fort Myers",
      state: "FL",
      website: null,
      updatedAt: now,
    };

    expect(
      isCompanyEligibleForSitemap(
        {
          ...baseCompany,
          accessStatus: CompanyAccessStatus.EXPIRED,
          trialEndsAt: new Date("2026-06-01T00:00:00.000Z"),
        },
        now
      )
    ).toBe(false);

    expect(
      isCompanyEligibleForSitemap(
        {
          ...baseCompany,
          companyName: "Hidden Co",
          description: null,
          city: null,
          state: null,
          website: null,
          accessStatus: CompanyAccessStatus.ACTIVE,
          trialEndsAt: null,
        },
        now
      )
    ).toBe(false);
  });

  it("builds dynamic shift and company sitemap entries", () => {
    const entries = buildSitemapEntries({
      now,
      shifts: [
        {
          id: "e186c480-2f4a-4b1d-9c3e-8a7f6d5e4c3b",
          title: "Security Officer",
          city: "Lehigh Acres",
          state: "FL",
          location: "123 Main St, Lehigh Acres, FL",
          updatedAt: new Date("2026-06-25T08:00:00.000Z"),
        },
      ],
      companies: [
        {
          id: "company-1",
          companyName: "United States Security",
          description: "Professional security services.",
          city: "Fort Myers",
          state: "FL",
          website: null,
          accessStatus: CompanyAccessStatus.TRIAL,
          trialEndsAt: new Date("2026-07-02T00:00:00.000Z"),
          updatedAt: new Date("2026-06-20T08:00:00.000Z"),
        },
      ],
    });

    expect(entries).toContainEqual({
      url: `${SITEMAP_BASE_URL}/shifts/e186c480-2f4a-4b1d-9c3e-8a7f6d5e4c3b`,
      lastModified: new Date("2026-06-25T08:00:00.000Z"),
      changeFrequency: "daily",
      priority: 0.9,
    });

    expect(entries).toContainEqual({
      url: `${SITEMAP_BASE_URL}/jobs/security-officer-lehigh-acres-fl-e186c480`,
      lastModified: new Date("2026-06-25T08:00:00.000Z"),
      changeFrequency: "daily",
      priority: 0.9,
    });

    expect(entries).toContainEqual({
      url: `${SITEMAP_BASE_URL}/companies/company-1`,
      lastModified: new Date("2026-06-20T08:00:00.000Z"),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });
});
