import type { ShiftCardData } from "@/lib/shift-card-data";

export type ShiftRequirementSource = Pick<
  ShiftCardData,
  "requirements" | "otherRequirements" | "specialRequirements"
>;

export function parseShiftRequirementChips(value: string, max = 5): string[] {
  if (!value.trim()) {
    return [];
  }

  const chips = value
    .split(/[,;\n]+/)
    .map((entry) => entry.trim())
    .filter(Boolean);

  return [...new Set(chips)].slice(0, max);
}

export function getShiftRequirementChips(
  shift: ShiftRequirementSource,
  max = 5
): string[] {
  const chips = [...(shift.requirements ?? [])];

  if (shift.otherRequirements?.trim()) {
    chips.push(shift.otherRequirements.trim());
  }

  if (chips.length > 0) {
    return [...new Set(chips)].slice(0, max);
  }

  return parseShiftRequirementChips(shift.specialRequirements, max);
}
