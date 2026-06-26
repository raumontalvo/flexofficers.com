import type { Prisma } from "@/app/generated/prisma/client";

/** Explicit Officer columns for Prisma select/include — matches current schema. */
export const officerProfileSelect = {
  id: true,
  userId: true,
  firstName: true,
  lastName: true,
  phone: true,
  city: true,
  state: true,
  profilePhotoUrl: true,
  armedStatuses: true,
  experienceYears: true,
  licenseExpirationDate: true,
  availability: true,
  certifications: true,
  experienceCategories: true,
  introduction: true,
  bio: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.OfficerSelect;

export type OfficerProfileRecord = Prisma.OfficerGetPayload<{
  select: typeof officerProfileSelect;
}>;

export const officerSearchCardSelect = {
  id: true,
  firstName: true,
  lastName: true,
  profilePhotoUrl: true,
  city: true,
  armedStatuses: true,
  experienceYears: true,
  certifications: true,
  availability: true,
  experienceCategories: true,
  introduction: true,
  phone: true,
} satisfies Prisma.OfficerSelect;

export type OfficerSearchCardRecord = Prisma.OfficerGetPayload<{
  select: typeof officerSearchCardSelect;
}>;

export const officerApplicantSelect = {
  firstName: true,
  lastName: true,
  profilePhotoUrl: true,
  city: true,
  armedStatuses: true,
  experienceYears: true,
  certifications: true,
  experienceCategories: true,
  introduction: true,
} satisfies Prisma.OfficerSelect;

export type OfficerApplicantRecord = Prisma.OfficerGetPayload<{
  select: typeof officerApplicantSelect;
}>;
