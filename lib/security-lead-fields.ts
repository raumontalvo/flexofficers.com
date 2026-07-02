import type { Prisma } from "@/app/generated/prisma/client";

export const securityLeadBrowseSelect = {
  id: true,
  serviceNeeded: true,
  city: true,
  state: true,
  dateNeeded: true,
  startTime: true,
  endTime: true,
  budgetOffer: true,
  urgency: true,
  officersNeeded: true,
  status: true,
  paymentStatus: true,
  createdAt: true,
  _count: {
    select: {
      applications: true,
    },
  },
} satisfies Prisma.SecurityLeadSelect;

export const securityLeadClientCardSelect = {
  id: true,
  serviceNeeded: true,
  city: true,
  state: true,
  dateNeeded: true,
  budgetOffer: true,
  status: true,
  paymentStatus: true,
  _count: {
    select: {
      applications: true,
    },
  },
} satisfies Prisma.SecurityLeadSelect;

export const securityLeadDetailSelect = {
  id: true,
  clientId: true,
  contactName: true,
  companyName: true,
  contactEmail: true,
  contactPhone: true,
  serviceNeeded: true,
  city: true,
  state: true,
  address: true,
  dateNeeded: true,
  startTime: true,
  endTime: true,
  officersNeeded: true,
  budgetOffer: true,
  description: true,
  urgency: true,
  postType: true,
  status: true,
  paymentStatus: true,
  createdAt: true,
} satisfies Prisma.SecurityLeadSelect;

export const leadApplicationCompanySelect = {
  id: true,
  companyName: true,
  city: true,
  state: true,
  phone: true,
  email: true,
  logoUrl: true,
  licenseNumber: true,
  licenseState: true,
  verified: true,
  description: true,
  website: true,
} satisfies Prisma.CompanySelect;

export const leadApplicationListSelect = {
  id: true,
  message: true,
  status: true,
  createdAt: true,
  company: {
    select: leadApplicationCompanySelect,
  },
} satisfies Prisma.SecurityLeadApplicationSelect;

export const companyLeadApplicationListSelect = {
  id: true,
  message: true,
  status: true,
  createdAt: true,
  securityLead: {
    select: {
      id: true,
      serviceNeeded: true,
      city: true,
      state: true,
      dateNeeded: true,
      startTime: true,
      endTime: true,
      budgetOffer: true,
      urgency: true,
      status: true,
    },
  },
} satisfies Prisma.SecurityLeadApplicationSelect;
