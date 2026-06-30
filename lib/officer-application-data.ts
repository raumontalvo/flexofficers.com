import type {
  ApplicationStatus,
  ShiftStatus,
  ShiftTimeType,
} from "@/app/generated/prisma/enums";
import type { Prisma } from "@/app/generated/prisma/client";
import { officerApplicationListSelect } from "@/lib/application-fields";

export type OfficerApplicationData = {
  id: string;
  status: ApplicationStatus;
  appliedAt: string;
  shift: {
    id: string;
    title: string;
    hourlyRate: string;
    companyName: string | null;
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
  };
};

export type OfficerApplicationRecord = Prisma.ApplicationGetPayload<{
  select: typeof officerApplicationListSelect;
}>;

export function mapOfficerApplication(
  application: OfficerApplicationRecord
): OfficerApplicationData {
  return {
    id: application.id,
    status: application.status,
    appliedAt: application.appliedAt.toISOString(),
    shift: {
      id: application.shift.id,
      title: application.shift.title,
      hourlyRate: application.shift.hourlyRate.toString(),
      companyName: application.shift.company.companyName,
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
    },
  };
}

export type ApplicationStatusFilter =
  | ""
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "WITHDRAWN";

export const APPLICATION_STATUS_TABS: {
  value: ApplicationStatusFilter;
  label: string;
}[] = [
  { value: "", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "REJECTED", label: "Rejected" },
  { value: "WITHDRAWN", label: "Withdrawn" },
];

export function formatAppliedDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatApplicationsPaginationRange(
  rangeStart: number,
  rangeEnd: number,
  total: number
) {
  if (total === 0) {
    return "Showing 0 applications";
  }

  return `Showing ${rangeStart}–${rangeEnd} of ${total} applications`;
}
