import {
  ShiftStatus,
  ShiftVisibility,
} from "@/app/generated/prisma/enums";
import { getRemainingOpenPositions } from "@/lib/shift-fill-status";

type PublicJobShiftEligibility = {
  status: ShiftStatus;
  visibility: ShiftVisibility;
  startTime: Date;
};

type PublicJobShiftPositions = {
  positionsNeeded: number;
  applications: { id: string }[];
};

export function isShiftEligibleForPublicJobPage(
  shift: PublicJobShiftEligibility,
  now: Date = new Date()
) {
  return (
    shift.visibility === ShiftVisibility.PUBLIC &&
    shift.status === ShiftStatus.OPEN &&
    shift.startTime > now
  );
}

export function getPublicJobShiftOpenPositions(shift: PublicJobShiftPositions) {
  return getRemainingOpenPositions(
    shift.positionsNeeded,
    shift.applications.length
  );
}
