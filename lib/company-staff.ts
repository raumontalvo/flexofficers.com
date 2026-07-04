import type { Prisma } from "@/app/generated/prisma/client";
import {
  ApplicationStatus,
  ShiftStatus,
  ShiftVisibility,
} from "@/app/generated/prisma/enums";
import { officerSearchCardSelect, officerUserSummarySelect } from "@/lib/officer-fields";
import { serializeOfficerSearchResult } from "@/lib/company-officers-page";

export const companyStaffMemberSelect = {
  id: true,
  addedAt: true,
  officer: {
    select: {
      ...officerSearchCardSelect,
      user: {
        select: officerUserSummarySelect,
      },
    },
  },
} satisfies Prisma.CompanyStaffSelect;

export type CompanyStaffMemberRecord = Prisma.CompanyStaffGetPayload<{
  select: typeof companyStaffMemberSelect;
}>;

export function serializeCompanyStaffMember(record: CompanyStaffMemberRecord) {
  return {
    id: record.id,
    officerId: record.officer.id,
    addedAt: record.addedAt.toISOString(),
    officer: serializeOfficerSearchResult(record.officer),
  };
}

export type SerializedCompanyStaffMember = ReturnType<
  typeof serializeCompanyStaffMember
>;

export function buildOfficerBrowseShiftsWhere(
  officerId?: string | null
): Prisma.ShiftWhereInput {
  const base: Prisma.ShiftWhereInput = {
    status: ShiftStatus.OPEN,
    visibility: ShiftVisibility.PUBLIC,
  };

  if (!officerId) {
    return base;
  }

  // Hide shifts where this officer already has a committed relationship: an
  // accepted application, an in-progress clock-in, or a completed clock-out.
  // This keeps completed assignments out of open shifts and stops the officer
  // from re-applying to a shift they already worked or are assigned to.
  return {
    ...base,
    applications: {
      none: {
        officerId,
        OR: [
          { status: ApplicationStatus.ACCEPTED },
          { clockInAt: { not: null } },
          { clockOutAt: { not: null } },
        ],
      },
    },
  };
}

export function getShiftVisibilityLabel(visibility: ShiftVisibility) {
  return visibility === ShiftVisibility.STAFF_ONLY
    ? "Private — Staff only"
    : "Public post";
}

export function searchCompanyStaff(
  staff: SerializedCompanyStaffMember[],
  query: string
) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return staff;
  }

  return staff.filter((member) => {
    const { officer } = member;
    const haystack = [
      officer.firstName,
      officer.lastName,
      officer.fullName,
      officer.city,
      officer.state,
      officer.cityStateLabel,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
}
