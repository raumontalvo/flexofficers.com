import type { ArmedStatus } from "@/app/generated/prisma/enums";
import type { OfficerLicenseSnapshot } from "@/lib/officer-licenses";
import { hasAtLeastOneLicense } from "@/lib/officer-licenses";

type OfficerProfileSnapshot = {
  phone?: string | null;
  armedStatuses?: ArmedStatus[];
  experienceCategories?: string[];
  experienceYears?: number | null;
  licenses?: readonly OfficerLicenseSnapshot[] | null;
} | null;

export type ProfileCompletionField = {
  id: string;
  label: string;
  complete: boolean;
};

export function getOfficerProfileCompletionFields(
  officer: OfficerProfileSnapshot
): ProfileCompletionField[] {
  return [
    {
      id: "phone",
      label: "Add your phone number",
      complete: Boolean(officer?.phone?.trim()),
    },
    {
      id: "armedStatuses",
      label: "Select armed and/or unarmed",
      complete: (officer?.armedStatuses?.length ?? 0) > 0,
    },
    {
      id: "experienceCategories",
      label: "Add experience categories",
      complete: (officer?.experienceCategories?.length ?? 0) > 0,
    },
    {
      id: "experienceYears",
      label: "Add your years of experience",
      complete:
        officer?.experienceYears !== null &&
        officer?.experienceYears !== undefined,
    },
    {
      id: "licenses",
      label: "Add at least one license",
      complete: hasAtLeastOneLicense(officer?.licenses),
    },
  ];
}

export function getIncompleteProfileLabels(
  officer: OfficerProfileSnapshot
): string[] {
  return getOfficerProfileCompletionFields(officer)
    .filter((field) => !field.complete)
    .map((field) => field.label);
}

export function getProfileCompletionPercent(
  officer: OfficerProfileSnapshot
): number {
  const fields = getOfficerProfileCompletionFields(officer);

  if (fields.length === 0) {
    return 0;
  }

  const completeCount = fields.filter((field) => field.complete).length;
  return Math.round((completeCount / fields.length) * 100);
}
