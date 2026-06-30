import type { Prisma } from "@/app/generated/prisma/client";
import { ApplicationStatus } from "@/app/generated/prisma/enums";
import { buildJobPageSlug, parseShiftIdPrefixFromJobSlug } from "@/lib/job-page-slug";
import {
  isShiftEligibleForPublicJobPage,
} from "@/lib/public-job-shift";
import { buildPublicShiftSitemapWhere } from "@/lib/sitemap-data";
import { prisma } from "@/lib/prisma";

export const publicJobShiftSelect = {
  id: true,
  title: true,
  description: true,
  location: true,
  city: true,
  state: true,
  hourlyRate: true,
  startTime: true,
  endTime: true,
  workType: true,
  requirements: true,
  otherRequirements: true,
  specialRequirements: true,
  positionsNeeded: true,
  status: true,
  visibility: true,
  createdAt: true,
  updatedAt: true,
  applications: {
    where: {
      status: ApplicationStatus.ACCEPTED,
    },
    select: {
      id: true,
    },
  },
  company: {
    select: {
      companyName: true,
      city: true,
      state: true,
    },
  },
} satisfies Prisma.ShiftSelect;

export type PublicJobShiftRecord = Prisma.ShiftGetPayload<{
  select: typeof publicJobShiftSelect;
}>;

export { isShiftEligibleForPublicJobPage } from "@/lib/public-job-shift";
export { getPublicJobShiftOpenPositions } from "@/lib/public-job-shift";

export async function findPublicJobShiftBySlug(
  slug: string,
  now: Date = new Date()
) {
  const idPrefix = parseShiftIdPrefixFromJobSlug(slug);

  if (!idPrefix) {
    return null;
  }

  const shift = await prisma.shift.findFirst({
    where: {
      id: {
        startsWith: idPrefix,
      },
      ...buildPublicShiftSitemapWhere(now),
    },
    select: publicJobShiftSelect,
  });

  if (!shift || !isShiftEligibleForPublicJobPage(shift, now)) {
    return null;
  }

  const canonicalSlug = buildJobPageSlug(shift);

  return {
    shift,
    canonicalSlug,
    slugMatches: canonicalSlug === slug,
  };
}
