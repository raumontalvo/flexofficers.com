type ShiftJobPostingInput = {
  title: string;
  description: string | null;
  createdAt: Date | string;
  startTime: Date | string;
  hourlyRate: { toString: () => string } | string | number;
  companyName: string;
  city: string | null;
  state: string | null;
  companyCity: string | null;
  companyState: string | null;
  pageUrl?: string;
};

function toIsoString(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function parseHourlyRate(
  hourlyRate: ShiftJobPostingInput["hourlyRate"]
): number | null {
  const raw =
    typeof hourlyRate === "object" && hourlyRate !== null && "toString" in hourlyRate
      ? hourlyRate.toString()
      : String(hourlyRate);
  const parsed = Number.parseFloat(raw);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

function resolveCity(input: ShiftJobPostingInput) {
  return input.city?.trim() || input.companyCity?.trim() || "Unspecified";
}

function resolveState(input: ShiftJobPostingInput) {
  return input.state?.trim() || input.companyState?.trim() || "Unspecified";
}

export function buildShiftJobPostingJsonLd(input: ShiftJobPostingInput) {
  const hourlyRate = parseHourlyRate(input.hourlyRate);

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: input.title.trim() || "Security Officer Shift",
    description:
      input.description?.trim() ||
      "Security shift opportunity posted on FlexOfficers.",
    datePosted: toIsoString(input.createdAt),
    validThrough: toIsoString(input.startTime),
    employmentType: "CONTRACTOR",
    ...(input.pageUrl ? { url: input.pageUrl } : {}),
    hiringOrganization: {
      "@type": "Organization",
      name: input.companyName.trim() || "Security Company",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: resolveCity(input),
        addressRegion: resolveState(input),
        addressCountry: "US",
      },
    },
    ...(hourlyRate !== null
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: "USD",
            value: {
              "@type": "QuantitativeValue",
              value: hourlyRate,
              unitText: "HOUR",
            },
          },
        }
      : {}),
  };
}
