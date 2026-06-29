import type { Prisma } from "@/app/generated/prisma/client";
import { ShiftStatus, ShiftVisibility } from "@/app/generated/prisma/enums";
import { officerSearchCardSelect } from "@/lib/officer-fields";
import { serializeOfficerSearchResult } from "@/lib/company-officers-page";

export const companyStaffMemberSelect = {
  id: true,
  addedAt: true,
  officer: {
    select: {
      ...officerSearchCardSelect,
      user: {
        select: {
          email: true,
        },
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

export function buildOfficerBrowseShiftsWhere(_officerId: string | null) {
  return {
    status: ShiftStatus.OPEN,
    visibility: ShiftVisibility.PUBLIC,
  } satisfies Prisma.ShiftWhereInput;
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
