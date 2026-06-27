import {
  buildShiftSpecialRequirements,
  normalizeShiftRequirements,
  toShiftArmedRequirement,
  toShiftTimeType,
  toShiftWorkType,
} from "@/lib/shift-form-options";

export type ShiftPayload = {
  title?: unknown;
  description?: unknown;
  location?: unknown;
  city?: unknown;
  state?: unknown;
  startTime?: unknown;
  endTime?: unknown;
  hourlyRate?: unknown;
  workType?: unknown;
  shiftTimeType?: unknown;
  armedRequirement?: unknown;
  requirements?: unknown;
  otherRequirements?: unknown;
  reportingInstructions?: unknown;
  positionsNeeded?: unknown;
};

export function parseShiftPayload(payload: ShiftPayload) {
  const errors: string[] = [];

  const title = typeof payload.title === "string" ? payload.title.trim() : "";
  if (!title) {
    errors.push("title is required");
  }

  const location =
    typeof payload.location === "string" ? payload.location.trim() : "";
  if (!location) {
    errors.push("location is required");
  }

  const city = typeof payload.city === "string" ? payload.city.trim() : "";
  if (!city) {
    errors.push("city is required");
  }

  const state = typeof payload.state === "string" ? payload.state.trim() : "";
  if (!state) {
    errors.push("state is required");
  } else if (!/^[A-Z]{2}$/.test(state.toUpperCase())) {
    errors.push("state must be a 2-letter code");
  }

  const workTypeRaw =
    typeof payload.workType === "string" ? payload.workType.trim() : "";
  const workType = toShiftWorkType(workTypeRaw);
  if (!workType) {
    errors.push("workType is required");
  }

  const shiftTimeTypeRaw =
    typeof payload.shiftTimeType === "string"
      ? payload.shiftTimeType.trim()
      : "";
  const shiftTimeType = toShiftTimeType(shiftTimeTypeRaw);
  if (!shiftTimeType) {
    errors.push("shiftTimeType is required");
  }

  const armedRequirementRaw =
    typeof payload.armedRequirement === "string"
      ? payload.armedRequirement.trim()
      : "";
  const armedRequirement = toShiftArmedRequirement(armedRequirementRaw);
  if (!armedRequirement) {
    errors.push("armedRequirement is required");
  }

  const requirements = normalizeShiftRequirements(payload.requirements);

  let otherRequirements: string | undefined;
  if (
    typeof payload.otherRequirements === "undefined" ||
    payload.otherRequirements === null ||
    payload.otherRequirements === ""
  ) {
    otherRequirements = undefined;
  } else if (typeof payload.otherRequirements !== "string") {
    errors.push("otherRequirements must be a string");
  } else {
    otherRequirements = payload.otherRequirements.trim() || undefined;
  }

  if (requirements.length === 0 && !otherRequirements) {
    errors.push("at least one requirement is required");
  }

  if (
    typeof payload.description !== "undefined" &&
    typeof payload.description !== "string"
  ) {
    errors.push("description must be a string");
  }
  const description =
    typeof payload.description === "string" ? payload.description : undefined;

  let reportingInstructions: string | undefined;
  if (
    typeof payload.reportingInstructions === "undefined" ||
    payload.reportingInstructions === null ||
    payload.reportingInstructions === ""
  ) {
    reportingInstructions = undefined;
  } else if (typeof payload.reportingInstructions !== "string") {
    errors.push("reportingInstructions must be a string");
  } else {
    reportingInstructions = payload.reportingInstructions.trim() || undefined;
  }

  const hourlyRate = Number(payload.hourlyRate);
  if (!Number.isFinite(hourlyRate) || hourlyRate <= 0) {
    errors.push("hourlyRate must be a number greater than 0");
  }

  const positionsNeededRaw =
    typeof payload.positionsNeeded === "undefined" ||
    payload.positionsNeeded === ""
      ? 1
      : Number(payload.positionsNeeded);

  if (!Number.isInteger(positionsNeededRaw) || positionsNeededRaw <= 0) {
    errors.push("positionsNeeded must be a positive integer");
  }

  const startTime = new Date(String(payload.startTime ?? ""));
  if (Number.isNaN(startTime.getTime())) {
    errors.push("startTime must be a valid date-time");
  }

  const endTime = new Date(String(payload.endTime ?? ""));
  if (Number.isNaN(endTime.getTime())) {
    errors.push("endTime must be a valid date-time");
  }

  if (
    !Number.isNaN(startTime.getTime()) &&
    !Number.isNaN(endTime.getTime()) &&
    endTime <= startTime
  ) {
    errors.push("endTime must be after startTime");
  }

  if (errors.length > 0) {
    return { errors };
  }

  return {
    data: {
      title,
      description,
      location,
      city,
      state: state.toUpperCase(),
      hourlyRate,
      startTime,
      endTime,
      workType: workType!,
      shiftTimeType: shiftTimeType!,
      armedRequirement: armedRequirement!,
      requirements,
      otherRequirements,
      specialRequirements: buildShiftSpecialRequirements({
        requirements,
        otherRequirements,
      }),
      reportingInstructions,
      positionsNeeded: positionsNeededRaw,
    },
  };
}
