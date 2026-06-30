import { describe, expect, it } from "vitest";
import { buildShiftJobPostingJsonLd } from "@/lib/shift-job-posting-json-ld";

describe("buildShiftJobPostingJsonLd", () => {
  it("builds JobPosting structured data with shift fields", () => {
    const jsonLd = buildShiftJobPostingJsonLd({
      title: "Night Patrol",
      description: "Overnight security coverage.",
      createdAt: "2026-06-01T12:00:00.000Z",
      startTime: "2026-06-10T08:00:00.000Z",
      hourlyRate: "32.50",
      companyName: "Acme Security",
      city: "Austin",
      state: "TX",
      companyCity: null,
      companyState: null,
    });

    expect(jsonLd).toMatchObject({
      "@context": "https://schema.org",
      "@type": "JobPosting",
      title: "Night Patrol",
      description: "Overnight security coverage.",
      datePosted: "2026-06-01T12:00:00.000Z",
      validThrough: "2026-06-10T08:00:00.000Z",
      employmentType: "CONTRACTOR",
      hiringOrganization: {
        "@type": "Organization",
        name: "Acme Security",
      },
      jobLocation: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Austin",
          addressRegion: "TX",
          addressCountry: "US",
        },
      },
      baseSalary: {
        "@type": "MonetaryAmount",
        currency: "USD",
        value: {
          "@type": "QuantitativeValue",
          value: 32.5,
          unitText: "HOUR",
        },
      },
    });
  });

  it("falls back when optional fields are missing", () => {
    const jsonLd = buildShiftJobPostingJsonLd({
      title: "  ",
      description: null,
      createdAt: "2026-06-01T12:00:00.000Z",
      startTime: "2026-06-10T08:00:00.000Z",
      hourlyRate: "invalid",
      companyName: "",
      city: null,
      state: null,
      companyCity: "Dallas",
      companyState: "TX",
    });

    expect(jsonLd.title).toBe("Security Officer Shift");
    expect(jsonLd.description).toBe(
      "Security shift opportunity posted on FlexOfficers."
    );
    expect(jsonLd.hiringOrganization.name).toBe("Security Company");
    expect(jsonLd.jobLocation.address.addressLocality).toBe("Dallas");
    expect(jsonLd.jobLocation.address.addressRegion).toBe("TX");
    expect(jsonLd.baseSalary).toBeUndefined();
  });

  it("includes the public job page url when provided", () => {
    const jsonLd = buildShiftJobPostingJsonLd({
      title: "Night Patrol",
      description: "Overnight security coverage.",
      createdAt: "2026-06-01T12:00:00.000Z",
      startTime: "2026-06-10T08:00:00.000Z",
      hourlyRate: "32.50",
      companyName: "Acme Security",
      city: "Austin",
      state: "TX",
      companyCity: null,
      companyState: null,
      pageUrl: "https://flexofficers.com/jobs/night-patrol-austin-tx-abc12345",
    });

    expect(jsonLd.url).toBe(
      "https://flexofficers.com/jobs/night-patrol-austin-tx-abc12345"
    );
  });
});
