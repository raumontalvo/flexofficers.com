export type ShiftPayload = {
  title?: unknown;
  description?: unknown;
  location?: unknown;
  startTime?: unknown;
  endTime?: unknown;
  hourlyRate?: unknown;
  requiredLicense?: unknown;
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

  const requiredLicense =
    typeof payload.requiredLicense === "string"
      ? payload.requiredLicense.trim()
      : "";
  if (!requiredLicense) {
    errors.push("requiredLicense is required");
  }

  if (
    typeof payload.description !== "undefined" &&
    typeof payload.description !== "string"
  ) {
    errors.push("description must be a string");
  }
  const description =
    typeof payload.description === "string" ? payload.description : undefined;

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
      hourlyRate,
      startTime,
      endTime,
      requiredLicense,
      positionsNeeded: positionsNeededRaw,
    },
  };
}
