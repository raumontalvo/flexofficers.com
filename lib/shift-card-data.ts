import type {
  ShiftArmedRequirement,
  ShiftStatus,
  ShiftTimeType,
  ShiftWorkType,
} from "@/app/generated/prisma/enums";

export type ShiftCardData = {
  id: string;
  title: string;
  hourlyRate: string;
  companyName: string | null;
  location: string;
  city?: string | null;
  state?: string | null;
  startTime: string;
  endTime: string;
  createdAt: string;
  positionsNeeded: number;
  filledCount: number;
  workType?: ShiftWorkType | null;
  shiftTimeType?: ShiftTimeType | null;
  armedRequirement?: ShiftArmedRequirement | null;
  requirements?: string[];
  otherRequirements?: string | null;
  specialRequirements: string;
  status: ShiftStatus;
};
