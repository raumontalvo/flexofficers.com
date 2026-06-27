import type { Prisma } from "@/app/generated/prisma/client";

export const officerLicenseSelect = {
  id: true,
  licenseType: true,
  licenseNumber: true,
  issuingState: true,
  expirationDate: true,
} satisfies Prisma.LicenseSelect;

export type OfficerLicenseRecord = Prisma.LicenseGetPayload<{
  select: typeof officerLicenseSelect;
}>;

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
  availability: true,
  certifications: true,
  experienceCategories: true,
  introduction: true,
  bio: true,
  licenseCertificationAccepted: true,
  createdAt: true,
  updatedAt: true,
  licenses: {
    select: officerLicenseSelect,
    orderBy: {
      createdAt: "asc" as const,
    },
  },
} satisfies Prisma.OfficerSelect;

export type OfficerProfileRecord = Prisma.OfficerGetPayload<{
  select: typeof officerProfileSelect;
}>;

export const officerProfilePageUserSelect = {
  id: true,
  email: true,
  officer: {
    select: officerProfileSelect,
  },
} satisfies Prisma.UserSelect;

export type OfficerProfilePageUserRecord = Prisma.UserGetPayload<{
  select: typeof officerProfilePageUserSelect;
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
  licenses: {
    select: officerLicenseSelect,
    orderBy: {
      createdAt: "asc" as const,
    },
  },
} satisfies Prisma.OfficerSelect;

export type OfficerSearchCardRecord = Prisma.OfficerGetPayload<{
  select: typeof officerSearchCardSelect;
}>;

export const companyAcceptedOfficerSelect = {
  id: true,
  firstName: true,
  lastName: true,
  profilePhotoUrl: true,
  city: true,
  state: true,
  phone: true,
  armedStatuses: true,
  experienceYears: true,
  certifications: true,
  experienceCategories: true,
  introduction: true,
  licenses: {
    select: officerLicenseSelect,
    orderBy: {
      createdAt: "asc" as const,
    },
  },
  user: {
    select: {
      email: true,
    },
  },
} satisfies Prisma.OfficerSelect;

export type CompanyAcceptedOfficerRecord = Prisma.OfficerGetPayload<{
  select: typeof companyAcceptedOfficerSelect;
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
  licenses: {
    select: officerLicenseSelect,
    orderBy: {
      createdAt: "asc" as const,
    },
  },
} satisfies Prisma.OfficerSelect;

export type OfficerApplicantRecord = Prisma.OfficerGetPayload<{
  select: typeof officerApplicantSelect;
}>;

export const officerWithUserSelect = {
  id: true,
  userId: true,
  firstName: true,
  lastName: true,
  armedStatuses: true,
  licenses: {
    select: officerLicenseSelect,
    orderBy: {
      createdAt: "asc" as const,
    },
  },
  user: {
    select: {
      id: true,
      clerkId: true,
      email: true,
    },
  },
} satisfies Prisma.OfficerSelect;

export const companyDashboardSelect = {
  id: true,
  userId: true,
  companyName: true,
  contactName: true,
  phone: true,
  email: true,
  website: true,
  address: true,
  logoUrl: true,
  city: true,
  state: true,
  description: true,
  licenseType: true,
  licenseNumber: true,
  licenseState: true,
  verified: true,
  subscriptionStatus: true,
  subscriptionCurrentPeriodEnd: true,
  stripeCustomerId: true,
  stripeSubscriptionId: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.CompanySelect;

export const dashboardUserSelect = {
  id: true,
  email: true,
  role: true,
  officer: {
    select: {
      id: true,
      phone: true,
      armedStatuses: true,
      experienceCategories: true,
      experienceYears: true,
      licenses: {
        select: officerLicenseSelect,
        orderBy: {
          createdAt: "asc" as const,
        },
      },
    },
  },
  company: {
    select: companyDashboardSelect,
  },
} satisfies Prisma.UserSelect;

export const adminOfficerLicenseSelect = {
  id: true,
  firstName: true,
  lastName: true,
  city: true,
  state: true,
  updatedAt: true,
  user: {
    select: {
      email: true,
    },
  },
  licenses: {
    select: officerLicenseSelect,
    orderBy: {
      createdAt: "asc" as const,
    },
  },
} satisfies Prisma.OfficerSelect;

export type AdminOfficerLicenseRecord = Prisma.OfficerGetPayload<{
  select: typeof adminOfficerLicenseSelect;
}>;
