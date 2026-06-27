import type { ShiftStatus, ShiftTimeType } from "@/app/generated/prisma/enums";

export type AcceptedShiftTab = "upcoming" | "completed" | "cancelled";

export type OfficerAcceptedShiftData = {
  id: string;
  shift: {
    id: string;
    title: string;
    hourlyRate: string;
    location: string;
    city: string | null;
    state: string | null;
    startTime: string;
    endTime: string;
    shiftTimeType: ShiftTimeType | null;
    requirements: string[];
    otherRequirements: string | null;
    specialRequirements: string;
    status: ShiftStatus;
    reportingInstructions: string | null;
  };
  company: {
    companyName: string;
    contactName: string | null;
    phone: string | null;
    email: string;
  };
};

export const ACCEPTED_SHIFT_TABS: {
  value: AcceptedShiftTab;
  label: string;
}[] = [
  { value: "upcoming", label: "Upcoming" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function getAcceptedShiftTab(
  shiftStatus: ShiftStatus,
  endTime: string
): AcceptedShiftTab {
  if (shiftStatus === "CANCELLED") {
    return "cancelled";
  }

  if (shiftStatus === "COMPLETED") {
    return "completed";
  }

  if (new Date(endTime) < new Date()) {
    return "completed";
  }

  return "upcoming";
}

export function formatCompletedDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatAcceptedShiftsPaginationRange(
  rangeStart: number,
  rangeEnd: number,
  total: number
) {
  if (total === 0) {
    return "Showing 0 accepted shifts";
  }

  return `Showing ${rangeStart}–${rangeEnd} of ${total} accepted shifts`;
}

export function hasCompanyContact(company: OfficerAcceptedShiftData["company"]) {
  return Boolean(
    company.contactName?.trim() ||
      company.phone?.trim() ||
      company.email?.trim()
  );
}
