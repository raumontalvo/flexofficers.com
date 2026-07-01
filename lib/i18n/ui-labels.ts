import type { AppTranslations } from "@/lib/app-i18n";
import { interpolate } from "@/lib/app-i18n";
import { CompanyAccessStatus } from "@/app/generated/prisma/enums";
import {
  canCompanyPostNewShifts,
  getEffectiveAccessStatus,
  type CompanyAccessFields,
} from "@/lib/company-access";
import type { ApplicationStatusFilter } from "@/lib/officer-application-data";
import type { AcceptedShiftTab } from "@/lib/officer-accepted-shift-data";
import type { NotificationTab } from "@/lib/officer-notification-data";
import type { CompanyNotificationTab } from "@/lib/company-notification-data";
import type { CompanyShiftsPageTab } from "@/lib/company-shifts-page";
import type { CompanyApplicantsTab } from "@/lib/company-applications-page";
import type { InviteTab } from "@/lib/officer-invite-data";
import type {
  ShiftBrowseFilters,
  ShiftSortOption,
  WorkTypeFilter,
} from "@/lib/shift-browse-filters";
import type { UpcomingShiftFilter, UpcomingShiftSort } from "@/lib/officer-upcoming-shift-data";
import { hasMoreShiftFilters } from "@/lib/shift-browse-filters";

export function getApplicationStatusTabs(t: AppTranslations) {
  const tabs = t.browse.applications.tabs;
  return [
    { value: "" as ApplicationStatusFilter, label: tabs.all },
    { value: "PENDING" as const, label: tabs.pending },
    { value: "ACCEPTED" as const, label: tabs.accepted },
    { value: "REJECTED" as const, label: tabs.rejected },
    { value: "WITHDRAWN" as const, label: tabs.withdrawn },
  ];
}

export function getAcceptedShiftTabs(t: AppTranslations) {
  const tabs = t.browse.acceptedShifts.tabs;
  return [
    { value: "upcoming" as AcceptedShiftTab, label: tabs.upcoming },
    { value: "completed" as const, label: tabs.completed },
    { value: "cancelled" as const, label: tabs.cancelled },
  ];
}

export function formatApplicationsPagination(
  t: AppTranslations,
  start: number,
  end: number,
  total: number
) {
  if (total === 0) {
    return t.browse.pagination.showingApplicationsZero;
  }

  return interpolate(t.browse.pagination.showingApplications, { start, end, total });
}

export function formatAcceptedShiftsPagination(
  t: AppTranslations,
  start: number,
  end: number,
  total: number
) {
  if (total === 0) {
    return t.browse.pagination.showingAcceptedShiftsZero;
  }

  return interpolate(t.browse.pagination.showingAcceptedShifts, { start, end, total });
}

export function formatNotificationsPagination(
  t: AppTranslations,
  start: number,
  end: number,
  total: number
) {
  if (total === 0) {
    return t.browse.pagination.showingNotificationsZero;
  }

  return interpolate(t.browse.pagination.showingNotifications, { start, end, total });
}

export function getApplicationStatusLabel(t: AppTranslations, status: string) {
  const labels = t.status.application;
  return labels[status as keyof typeof labels] ?? status.replaceAll("_", " ");
}

export function getShiftStatusLabel(t: AppTranslations, status: string) {
  const labels = t.status.shift;
  return labels[status as keyof typeof labels] ?? status.replaceAll("_", " ");
}

export function getDateLocale(language: string) {
  return language === "es" ? "es-US" : "en-US";
}

export function getNotificationTabs(t: AppTranslations) {
  const tabs = t.browse.notifications.tabs;
  return [
    { value: "all" as NotificationTab, label: tabs.all },
    { value: "unread" as const, label: tabs.unread },
    { value: "applications" as const, label: tabs.applications },
    { value: "shifts" as const, label: tabs.shifts },
    { value: "system" as const, label: tabs.system },
  ];
}

export function getCompanyNotificationTabs(t: AppTranslations) {
  const tabs = t.browse.notifications.tabs;
  return [
    { value: "all" as CompanyNotificationTab, label: tabs.all },
    { value: "unread" as const, label: tabs.unread },
    {
      value: "applicants" as const,
      label: t.browse.companyApplicants.tabs.applicants,
    },
    { value: "shifts" as const, label: tabs.shifts },
    { value: "system" as const, label: tabs.system },
  ];
}

export function getTranslatedCompanyPostingBlockMessage(
  t: AppTranslations,
  company: CompanyAccessFields,
  now: Date = new Date()
) {
  if (canCompanyPostNewShifts(company, now)) {
    return null;
  }

  const effectiveStatus = getEffectiveAccessStatus(company, now);
  const messages = t.browse.companyShifts.blockMessage;

  if (effectiveStatus === CompanyAccessStatus.EXPIRED) {
    if (!company.trialStartedAt) {
      return messages.profileIncomplete;
    }

    return messages.trialExpired;
  }

  return messages.subscriptionRequired;
}

export function formatCompanyAccessStatusLabel(
  t: AppTranslations,
  status: CompanyAccessStatus
) {
  const labels = t.billing.status;
  switch (status) {
    case CompanyAccessStatus.ACTIVE:
      return labels.active;
    case CompanyAccessStatus.TRIAL:
      return labels.trial;
    case CompanyAccessStatus.EXPIRED:
    default:
      return labels.expired;
  }
}

export function getShiftWorkTypeOptions(t: AppTranslations) {
  const wt = t.filters.workType;
  return [
    { value: "" as WorkTypeFilter, label: wt.all },
    { value: "Gig" as const, label: wt.gig },
    { value: "Full-Time" as const, label: wt.fullTime },
    { value: "Part-Time" as const, label: wt.partTime },
  ];
}

export function getShiftSortOptions(t: AppTranslations) {
  const sort = t.filters.sort;
  return [
    { value: "newest" as ShiftSortOption, label: sort.newest },
    { value: "highest-pay" as const, label: sort.highestPay },
    { value: "earliest-start" as const, label: sort.earliestStart },
  ];
}

function formatFilterDate(value: string, locale: string) {
  const parsed = new Date(`${value}T12:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatLocationSummary(filters: ShiftBrowseFilters) {
  const city = filters.city.trim();
  const state = filters.state.trim();

  if (city && state) {
    return `${city}, ${state}`;
  }

  if (city) {
    return city;
  }

  if (state) {
    return state;
  }

  return null;
}

function getWorkTypeFilterLabel(t: AppTranslations, value: string) {
  switch (value) {
    case "Gig":
      return t.filters.workType.gig;
    case "Full-Time":
      return t.filters.workType.fullTime;
    case "Part-Time":
      return t.filters.workType.partTime;
    default:
      return t.filters.summary.allTypes;
  }
}

export function formatShiftFilterChipsSummary(
  t: AppTranslations,
  filters: ShiftBrowseFilters,
  locale: string
) {
  const summary = t.filters.summary;
  const location = formatLocationSummary(filters) ?? summary.anyLocation;
  const datePart = filters.date.trim()
    ? formatFilterDate(filters.date.trim(), locale)
    : summary.anyDate;
  const payPart = filters.minHourlyRate.trim()
    ? `$${filters.minHourlyRate.trim()}+/hr`
    : summary.anyPay;
  const workTypePart = filters.workType.trim()
    ? getWorkTypeFilterLabel(t, filters.workType.trim())
    : summary.allTypes;

  const parts = [location, datePart, payPart, workTypePart];

  if (hasMoreShiftFilters(filters)) {
    parts.push(summary.moreFilters);
  }

  return parts.join(" • ");
}

export function formatOpenShiftCount(t: AppTranslations, count: number) {
  if (count === 1) {
    return t.browse.shifts.results.oneOpenShift;
  }

  return interpolate(t.browse.shifts.results.manyOpenShifts, { count });
}

export function formatOpenShiftsPagination(
  t: AppTranslations,
  start: number,
  end: number,
  total: number
) {
  if (total === 0) {
    return t.browse.pagination.showingOpenShiftsZero;
  }

  return interpolate(t.browse.pagination.showingOpenShifts, { start, end, total });
}

export function formatCompanyShiftsPagination(
  t: AppTranslations,
  start: number,
  end: number,
  total: number
) {
  return interpolate(t.browse.pagination.showingShifts, { start, end, total });
}

export function getCompanyShiftsTabs(t: AppTranslations) {
  const tabs = t.browse.companyShifts.tabs;
  return [
    { id: "all" as CompanyShiftsPageTab, label: tabs.all },
    { id: "open" as const, label: tabs.open },
    { id: "filled" as const, label: tabs.filled },
    { id: "cancelled" as const, label: tabs.cancelled },
  ];
}

export function getCompanyApplicantsTabs(t: AppTranslations) {
  const tabs = t.browse.companyApplicants.tabs;
  return [
    { id: "all" as CompanyApplicantsTab, label: tabs.all, mobileLabel: tabs.applicants },
    { id: "pending" as const, label: tabs.pending },
    { id: "accepted" as const, label: tabs.accepted },
    { id: "rejected" as const, label: tabs.rejected },
  ];
}

export function getInviteTabs(t: AppTranslations) {
  const tabs = t.browse.invites.tabs;
  return [
    { value: "all" as InviteTab, label: tabs.all },
    { value: "pending" as const, label: tabs.pending },
    { value: "accepted" as const, label: tabs.accepted },
    { value: "declined" as const, label: tabs.declined },
  ];
}

export function getUpcomingShiftFilterOptions(t: AppTranslations) {
  const filters = t.browse.upcomingShifts.filters;
  return [
    { value: "" as UpcomingShiftFilter, label: filters.all },
    { value: "next7" as const, label: filters.next7Days },
    { value: "thisMonth" as const, label: filters.thisMonth },
  ];
}

export function getUpcomingShiftSortOptions(t: AppTranslations) {
  const sort = t.browse.upcomingShifts.sort;
  return [
    { value: "soonest" as UpcomingShiftSort, label: sort.soonest },
    { value: "latest" as const, label: sort.latest },
  ];
}

export function formatShiftPositionsOpen(
  t: AppTranslations,
  open: number,
  total: number,
  variant: "open" | "stillOpen" | "available" = "open"
) {
  return interpolate(t.shiftDetail.positions[variant], { open, total });
}

export function formatShiftEstimatedEarnings(
  t: AppTranslations,
  pay: string | null
) {
  if (!pay) {
    return null;
  }

  return interpolate(t.shiftDetail.estimatedEarnings, { pay });
}
