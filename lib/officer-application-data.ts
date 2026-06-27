import type {
  ApplicationStatus,
  ShiftStatus,
  ShiftTimeType,
} from "@/app/generated/prisma/enums";

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
