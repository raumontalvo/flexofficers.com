import type {
  ShiftArmedRequirement,
  ShiftTimeType,
  ShiftWorkType,
} from "@/app/generated/prisma/enums";

export const SHIFT_WORK_TYPE_OPTIONS = [
  { value: "Gig", label: "Gig", db: "GIG" as const },
  { value: "Full-Time", label: "Full-Time", db: "FULL_TIME" as const },
  { value: "Part-Time", label: "Part-Time", db: "PART_TIME" as const },
] as const;

export const SHIFT_TIME_TYPE_OPTIONS = [
  { value: "Day Shift", label: "Day Shift", db: "DAY_SHIFT" as const },
  { value: "Night Shift", label: "Night Shift", db: "NIGHT_SHIFT" as const },
  { value: "Overnight", label: "Overnight", db: "OVERNIGHT" as const },
] as const;

export const SHIFT_ARMED_OPTIONS = [
  { value: "Armed", label: "Armed", db: "ARMED" as const },
  { value: "Unarmed", label: "Unarmed", db: "UNARMED" as const },
  { value: "Either", label: "Either", db: "EITHER" as const },
] as const;

export const SHIFT_REQUIREMENT_OPTIONS = [
  "D License",
  "G License",
  "K9",
  "Firearms",
  "CPR",
  "AED",
] as const;

export type ShiftWorkTypeFormValue =
  (typeof SHIFT_WORK_TYPE_OPTIONS)[number]["value"];
export type ShiftTimeTypeFormValue =
  (typeof SHIFT_TIME_TYPE_OPTIONS)[number]["value"];
export type ShiftArmedFormValue = (typeof SHIFT_ARMED_OPTIONS)[number]["value"];

const workTypeToDb = Object.fromEntries(
  SHIFT_WORK_TYPE_OPTIONS.map((option) => [option.value, option.db])
) as Record<ShiftWorkTypeFormValue, ShiftWorkType>;

const workTypeFromDb = Object.fromEntries(
  SHIFT_WORK_TYPE_OPTIONS.map((option) => [option.db, option.value])
) as Record<ShiftWorkType, ShiftWorkTypeFormValue>;

const timeTypeToDb = Object.fromEntries(
  SHIFT_TIME_TYPE_OPTIONS.map((option) => [option.value, option.db])
) as Record<ShiftTimeTypeFormValue, ShiftTimeType>;

const timeTypeFromDb = Object.fromEntries(
  SHIFT_TIME_TYPE_OPTIONS.map((option) => [option.db, option.value])
) as Record<ShiftTimeType, ShiftTimeTypeFormValue>;

const armedToDb = Object.fromEntries(
  SHIFT_ARMED_OPTIONS.map((option) => [option.value, option.db])
) as Record<ShiftArmedFormValue, ShiftArmedRequirement>;

const armedFromDb = Object.fromEntries(
  SHIFT_ARMED_OPTIONS.map((option) => [option.db, option.value])
) as Record<ShiftArmedRequirement, ShiftArmedFormValue>;

export function toShiftWorkType(value: string): ShiftWorkType | null {
  return workTypeToDb[value as ShiftWorkTypeFormValue] ?? null;
}

export function fromShiftWorkType(
  value: ShiftWorkType | null | undefined
): ShiftWorkTypeFormValue | "" {
  if (!value) {
    return "";
  }

  return workTypeFromDb[value] ?? "";
}

export function toShiftTimeType(value: string): ShiftTimeType | null {
  return timeTypeToDb[value as ShiftTimeTypeFormValue] ?? null;
}

export function fromShiftTimeType(
  value: ShiftTimeType | null | undefined
): ShiftTimeTypeFormValue | "" {
  if (!value) {
    return "";
  }

  return timeTypeFromDb[value] ?? "";
}

export function toShiftArmedRequirement(
  value: string
): ShiftArmedRequirement | null {
  return armedToDb[value as ShiftArmedFormValue] ?? null;
}

export function fromShiftArmedRequirement(
  value: ShiftArmedRequirement | null | undefined
): ShiftArmedFormValue | "" {
  if (!value) {
    return "";
  }

  return armedFromDb[value] ?? "";
}

export function buildShiftSpecialRequirements(input: {
  requirements: string[];
  otherRequirements?: string | null;
}) {
  const parts = [
    ...input.requirements.map((entry) => entry.trim()).filter(Boolean),
    input.otherRequirements?.trim() ?? "",
  ].filter(Boolean);

  return parts.join(", ");
}

export function normalizeShiftRequirements(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  const allowed = new Set<string>(SHIFT_REQUIREMENT_OPTIONS);

  return [
    ...new Set(
      value
        .filter((entry): entry is string => typeof entry === "string")
        .map((entry) => entry.trim())
        .filter((entry) => allowed.has(entry))
    ),
  ];
}
