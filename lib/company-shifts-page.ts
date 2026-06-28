import { ShiftStatus } from "@/app/generated/prisma/enums";
import {
  type CompanyShiftRecord,
  getShiftApplicantCount,
  getShiftFilledCount,
  isActiveCompanyShiftStatus,
} from "@/lib/company-dashboard-data";
import { formatShiftCityState } from "@/lib/format-shift";

export type CompanyShiftsPageTab = "all" | "open" | "filled" | "cancelled";

export const COMPANY_SHIFTS_PAGE_SIZE = 7;

export type SerializedCompanyShiftRow = {
  id: string;
  title: string;
  location: string;
  locationLabel: string;
  locationSubtext: string;
  city: string | null;
  state: string | null;
  startTime: string;
  endTime: string;
  hourlyRate: string;
  status: ShiftStatus;
  positionsNeeded: number;
  filledCount: number;
  applicantCount: number;
};

export type CompanyShiftRowRecord = CompanyShiftRecord & {
  hourlyRate: { toString: () => string };
};

export function getShiftLocationParts(
  shift: Pick<CompanyShiftRecord, "location" | "city" | "state">
) {
  const [locationNamePart, addressPart] = shift.location
    .split("|")
    .map((part) => part.trim());
  const locationName = shift.location.includes("|") ? locationNamePart : "";
  const cityState = formatShiftCityState(shift);

  const locationLabel = locationName || cityState || shift.location;
  const locationSubtext = locationName
    ? cityState || addressPart || ""
    : cityState !== shift.location
      ? ""
      : "";

  return { locationLabel, locationSubtext };
}

export function formatShiftDurationLabel(startTime: Date, endTime: Date) {
  const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

  if (!Number.isFinite(hours) || hours <= 0) {
    return null;
  }

  const rounded = Number.isInteger(hours) ? hours : Math.round(hours * 10) / 10;

  return `(${rounded}h)`;
}

export function formatShiftTableDate(date: Date) {
  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function serializeCompanyShiftRow(
  shift: CompanyShiftRowRecord
): SerializedCompanyShiftRow {
  const { locationLabel, locationSubtext } = getShiftLocationParts(shift);

  return {
    id: shift.id,
    title: shift.title,
    location: shift.location,
    locationLabel,
    locationSubtext,
    city: shift.city,
    state: shift.state,
    startTime: shift.startTime.toISOString(),
    endTime: shift.endTime.toISOString(),
    hourlyRate: shift.hourlyRate.toString(),
    status: shift.status,
    positionsNeeded: shift.positionsNeeded,
    filledCount: getShiftFilledCount(shift),
    applicantCount: getShiftApplicantCount(shift),
  };
}

export function getCompanyShiftsTabCounts(shifts: SerializedCompanyShiftRow[]) {
  return {
    all: shifts.length,
    open: shifts.filter((shift) => isActiveCompanyShiftStatus(shift.status))
      .length,
    filled: shifts.filter((shift) => shift.status === ShiftStatus.FILLED).length,
    cancelled: shifts.filter(
      (shift) => shift.status === ShiftStatus.CANCELLED
    ).length,
  };
}

export function filterCompanyShiftsByTab(
  shifts: SerializedCompanyShiftRow[],
  tab: CompanyShiftsPageTab
) {
  switch (tab) {
    case "open":
      return shifts.filter((shift) => isActiveCompanyShiftStatus(shift.status));
    case "filled":
      return shifts.filter((shift) => shift.status === ShiftStatus.FILLED);
    case "cancelled":
      return shifts.filter((shift) => shift.status === ShiftStatus.CANCELLED);
    case "all":
    default:
      return shifts;
  }
}

export function searchCompanyShifts(
  shifts: SerializedCompanyShiftRow[],
  query: string
) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return shifts;
  }

  return shifts.filter((shift) => {
    const haystack = [
      shift.title,
      shift.location,
      shift.locationLabel,
      shift.locationSubtext,
      shift.city,
      shift.state,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
}

export function paginateCompanyShifts<T>(
  items: T[],
  page: number,
  pageSize: number
) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const startIndex = (safePage - 1) * pageSize;

  return {
    items: items.slice(startIndex, startIndex + pageSize),
    page: safePage,
    pageSize,
    totalItems: items.length,
    totalPages,
    startIndex: items.length === 0 ? 0 : startIndex + 1,
    endIndex: Math.min(startIndex + pageSize, items.length),
  };
}

export function getFillProgressVariant(
  filledCount: number,
  positionsNeeded: number
) {
  if (filledCount <= 0) {
    return "empty" as const;
  }

  if (filledCount >= positionsNeeded) {
    return "full" as const;
  }

  return "partial" as const;
}
