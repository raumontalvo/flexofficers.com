import {
  ShiftStatus,
  ShiftVisibility,
} from "@/app/generated/prisma/enums";

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
  const filledCount = shift.applications.length;
  return Math.max(shift.positionsNeeded - filledCount, 0);
}
