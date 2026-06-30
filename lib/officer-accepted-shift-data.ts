import type { ShiftStatus, ShiftTimeType } from "@/app/generated/prisma/enums";
import type { Prisma } from "@/app/generated/prisma/client";

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

/** Explicit select for officer accepted/upcoming shift lists. */
export const officerAcceptedShiftListSelect = {
  id: true,
  shift: {
    select: {
      id: true,
      title: true,
      hourlyRate: true,
      location: true,
      city: true,
      state: true,
      startTime: true,
      endTime: true,
      shiftTimeType: true,
      requirements: true,
      otherRequirements: true,
      specialRequirements: true,
      status: true,
      reportingInstructions: true,
      company: {
        select: {
          companyName: true,
          contactName: true,
          phone: true,
          email: true,
          user: {
            select: {
              email: true,
            },
          },
        },
      },
    },
  },
} satisfies Prisma.ApplicationSelect;

export type OfficerAcceptedShiftApplicationRecord = Prisma.ApplicationGetPayload<{
  select: typeof officerAcceptedShiftListSelect;
}>;

function displayCompanyEmail(
  companyEmail: string | null | undefined,
  userEmail: string
) {
  return companyEmail || userEmail;
}

export function mapOfficerAcceptedShiftApplication(
  application: OfficerAcceptedShiftApplicationRecord
): OfficerAcceptedShiftData {
  return {
    id: application.id,
    shift: {
      id: application.shift.id,
      title: application.shift.title,
      hourlyRate: application.shift.hourlyRate.toString(),
      location: application.shift.location,
      city: application.shift.city,
      state: application.shift.state,
      startTime: application.shift.startTime.toISOString(),
      endTime: application.shift.endTime.toISOString(),
      shiftTimeType: application.shift.shiftTimeType,
      requirements: application.shift.requirements,
      otherRequirements: application.shift.otherRequirements,
      specialRequirements: application.shift.specialRequirements,
      status: application.shift.status,
      reportingInstructions: application.shift.reportingInstructions,
    },
    company: {
      companyName: application.shift.company.companyName,
      contactName: application.shift.company.contactName,
      phone: application.shift.company.phone,
      email: displayCompanyEmail(
        application.shift.company.email,
        application.shift.company.user.email
      ),
    },
  };
}

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
