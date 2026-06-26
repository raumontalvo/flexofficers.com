import type { ArmedStatus, ShiftStatus } from "@/app/generated/prisma/enums";

export type RecommendedShiftInput = {
  id: string;
  title: string;
  description: string | null;
  location: string;
  hourlyRate: { toString: () => string };
  startTime: Date;
  endTime: Date;
  status: ShiftStatus;
  specialRequirements: string;
  company: {
    companyName: string;
  };
};

export type OfficerMatchProfile = {
  armedStatuses: ArmedStatus[];
  experienceCategories: string[];
};

export type RankedRecommendedShift = RecommendedShiftInput & {
  matchScore: number;
};

const RECOMMENDED_SHIFT_LIMIT = 5;

function normalizeText(value: string) {
  return value.toLowerCase();
}

function scoreArmedStatusMatch(
  shiftText: string,
  armedStatuses: ArmedStatus[]
) {
  if (armedStatuses.length === 0) {
    return 0;
  }

  const normalized = normalizeText(shiftText);
  let score = 0;

  if (armedStatuses.includes("ARMED") && normalized.includes("armed")) {
    score += 12;
  }

  if (armedStatuses.includes("UNARMED") && normalized.includes("unarmed")) {
    score += 12;
  }

  return score;
}

function scoreExperienceMatch(
  shiftText: string,
  experienceCategories: string[]
) {
  if (experienceCategories.length === 0) {
    return 0;
  }

  const normalized = normalizeText(shiftText);
  let score = 0;

  experienceCategories.forEach((category) => {
    const tokens = normalizeText(category)
      .split(/[\s/]+/)
      .filter((token) => token.length > 3);

    if (normalized.includes(normalizeText(category))) {
      score += 10;
      return;
    }

    const matchedTokens = tokens.filter((token) => normalized.includes(token));

    if (matchedTokens.length > 0) {
      score += Math.min(6, matchedTokens.length * 2);
    }
  });

  return score;
}

function scoreHourlyRate(hourlyRate: { toString: () => string }) {
  const rate = Number(hourlyRate.toString());
  return Number.isFinite(rate) ? rate : 0;
}

function scoreStartTime(startTime: Date, now: Date) {
  const msUntilStart = startTime.getTime() - now.getTime();

  if (msUntilStart < 0) {
    return 0;
  }

  const daysUntilStart = msUntilStart / (1000 * 60 * 60 * 24);
  return Math.max(0, 30 - daysUntilStart);
}

export function buildShiftMatchText(shift: RecommendedShiftInput) {
  return [
    shift.title,
    shift.description ?? "",
    shift.location,
    shift.specialRequirements,
    shift.company.companyName,
  ].join(" ");
}

export function rankRecommendedShifts(
  shifts: RecommendedShiftInput[],
  officer: OfficerMatchProfile | null,
  options?: {
    limit?: number;
    now?: Date;
  }
): RankedRecommendedShift[] {
  const limit = options?.limit ?? RECOMMENDED_SHIFT_LIMIT;
  const now = options?.now ?? new Date();

  const ranked = shifts.map((shift) => {
    const shiftText = buildShiftMatchText(shift);
    let matchScore = 0;

    if (officer) {
      matchScore += scoreArmedStatusMatch(shiftText, officer.armedStatuses);
      matchScore += scoreExperienceMatch(
        shiftText,
        officer.experienceCategories
      );
    }

    matchScore += scoreHourlyRate(shift.hourlyRate) * 0.5;
    matchScore += scoreStartTime(shift.startTime, now);

    return {
      ...shift,
      matchScore,
    };
  });

  ranked.sort((left, right) => {
    if (right.matchScore !== left.matchScore) {
      return right.matchScore - left.matchScore;
    }

    if (left.startTime.getTime() !== right.startTime.getTime()) {
      return left.startTime.getTime() - right.startTime.getTime();
    }

    return (
      Number(right.hourlyRate.toString()) - Number(left.hourlyRate.toString())
    );
  });

  return ranked.slice(0, limit);
}
