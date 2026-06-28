export type CompanyProfileMeta = {
  services: string[];
  officerBenefits: string[];
  workEnvironment: string[];
  businessHours: string | null;
  licenseIssueDate: string | null;
  licenseExpirationDate: string | null;
  industry: string | null;
  companySize: string | null;
  established: string | null;
};

const META_BLOCK_REGEX = /\n?\[fo-meta\]([\s\S]*?)\[\/fo-meta\]$/;

export const EMPTY_COMPANY_PROFILE_META: CompanyProfileMeta = {
  services: [],
  officerBenefits: [],
  workEnvironment: [],
  businessHours: null,
  licenseIssueDate: null,
  licenseExpirationDate: null,
  industry: null,
  companySize: null,
  established: null,
};

export function stripCompanyProfileMeta(description: string | null | undefined) {
  if (!description?.trim()) {
    return null;
  }

  const stripped = description.replace(META_BLOCK_REGEX, "").trim();
  return stripped || null;
}

export function parseCompanyProfileMeta(
  description: string | null | undefined
): CompanyProfileMeta {
  if (!description) {
    return { ...EMPTY_COMPANY_PROFILE_META };
  }

  const match = description.match(META_BLOCK_REGEX);

  if (!match?.[1]) {
    return { ...EMPTY_COMPANY_PROFILE_META };
  }

  try {
    const parsed = JSON.parse(match[1]) as Partial<CompanyProfileMeta>;

    return {
      services: Array.isArray(parsed.services)
        ? parsed.services.filter((item): item is string => typeof item === "string")
        : [],
      officerBenefits: Array.isArray(parsed.officerBenefits)
        ? parsed.officerBenefits.filter(
            (item): item is string => typeof item === "string"
          )
        : [],
      workEnvironment: Array.isArray(parsed.workEnvironment)
        ? parsed.workEnvironment.filter(
            (item): item is string => typeof item === "string"
          )
        : [],
      businessHours:
        typeof parsed.businessHours === "string" ? parsed.businessHours : null,
      licenseIssueDate:
        typeof parsed.licenseIssueDate === "string"
          ? parsed.licenseIssueDate
          : null,
      licenseExpirationDate:
        typeof parsed.licenseExpirationDate === "string"
          ? parsed.licenseExpirationDate
          : null,
      industry: typeof parsed.industry === "string" ? parsed.industry : null,
      companySize:
        typeof parsed.companySize === "string" ? parsed.companySize : null,
      established:
        typeof parsed.established === "string" ? parsed.established : null,
    };
  } catch {
    return { ...EMPTY_COMPANY_PROFILE_META };
  }
}

export function embedCompanyProfileMeta(
  description: string | null | undefined,
  meta: CompanyProfileMeta
) {
  const cleanDescription = stripCompanyProfileMeta(description) ?? "";

  return `${cleanDescription}\n[fo-meta]${JSON.stringify(meta)}[/fo-meta]`.trim();
}

export function splitKnownAndCustomSelections(
  values: string[],
  options: readonly string[]
) {
  const allowed = new Set<string>(options);
  const known: string[] = [];
  const custom: string[] = [];

  for (const value of values) {
    const trimmed = value.trim();
    if (!trimmed) {
      continue;
    }

    if (allowed.has(trimmed)) {
      known.push(trimmed);
    } else {
      custom.push(trimmed);
    }
  }

  return { known, custom };
}
