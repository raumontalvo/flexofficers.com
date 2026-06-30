import type { Prisma } from "@/app/generated/prisma/client";
import { companyAcceptedOfficerSelect } from "@/lib/officer-fields";

/**
 * Minimal Application columns for nested queries.
 * Avoids selecting reminder-tracking fields when migrations are pending.
 */
export const applicationIdOnlySelect = {
  id: true,
} satisfies Prisma.ApplicationSelect;

export const applicationIdStatusSelect = {
  id: true,
  status: true,
} satisfies Prisma.ApplicationSelect;

export const applicationListCoreSelect = {
  id: true,
  status: true,
  appliedAt: true,
} satisfies Prisma.ApplicationSelect;

export const officerApplicationShiftSelect = {
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
  company: {
    select: {
      companyName: true,
    },
  },
} satisfies Prisma.ShiftSelect;

export const officerApplicationListSelect = {
  ...applicationListCoreSelect,
  shift: {
    select: officerApplicationShiftSelect,
  },
} satisfies Prisma.ApplicationSelect;

export const companyWorkforceShiftSelect = {
  id: true,
  title: true,
  location: true,
  city: true,
  state: true,
  startTime: true,
  endTime: true,
  positionsNeeded: true,
  status: true,
  hourlyRate: true,
} satisfies Prisma.ShiftSelect;

export const officerBrowseShiftSelect = {
  id: true,
  title: true,
  hourlyRate: true,
  location: true,
  city: true,
  state: true,
  startTime: true,
  endTime: true,
  createdAt: true,
  positionsNeeded: true,
  workType: true,
  shiftTimeType: true,
  armedRequirement: true,
  requirements: true,
  otherRequirements: true,
  specialRequirements: true,
  status: true,
  company: {
    select: {
      companyName: true,
    },
  },
} satisfies Prisma.ShiftSelect;

export const companyWorkforceApplicationSelect = {
  id: true,
  shift: {
    select: companyWorkforceShiftSelect,
  },
  officer: {
    select: companyAcceptedOfficerSelect,
  },
} satisfies Prisma.ApplicationSelect;

export const acceptedApplicationCountSelect = applicationIdOnlySelect;
