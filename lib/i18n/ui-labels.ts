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
import type { ProfileWizardStepId } from "@/app/officer/profile/profile-wizard-steps";
import type { WizardFormSnapshot } from "@/app/officer/profile/profile-wizard-progress";
import {
  SHIFT_ARMED_OPTIONS,
  SHIFT_TIME_TYPE_OPTIONS,
  SHIFT_WORK_TYPE_OPTIONS,
} from "@/lib/shift-form-options";
import type { InviteStatus } from "@/app/generated/prisma/enums";
import type { NotificationKind } from "@/lib/officer-notification-data";
import type { CompanyNotificationKind } from "@/lib/company-notification-data";
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

export function formatRelativeTimeAgo(
  t: AppTranslations,
  iso: string,
  now = new Date()
) {
  const createdAt = new Date(iso);
  const diffMs = now.getTime() - createdAt.getTime();
  const timeAgo = t.browse.notifications.timeAgo;

  if (diffMs < 0) {
    return timeAgo.justNow;
  }

  const minutes = Math.floor(diffMs / (1000 * 60));
  if (minutes < 1) {
    return timeAgo.justNow;
  }
  if (minutes < 60) {
    return interpolate(timeAgo.minutesAgo, { count: minutes });
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return interpolate(timeAgo.hoursAgo, { count: hours });
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return interpolate(timeAgo.daysAgo, { count: days });
  }

  const weeks = Math.floor(days / 7);
  return interpolate(timeAgo.weeksAgo, { count: weeks });
}

export function formatInvitedTimeAgo(
  t: AppTranslations,
  invitedAt: string,
  now = new Date()
) {
  return interpolate(t.browse.invites.card.invitedPrefix, {
    time: formatRelativeTimeAgo(t, invitedAt, now),
  });
}

export function getNotificationKindLabel(t: AppTranslations, kind: NotificationKind) {
  return t.browse.notifications.kinds[kind] ?? kind;
}

export function getCompanyNotificationKindLabel(
  t: AppTranslations,
  kind: CompanyNotificationKind
) {
  return t.browse.companyNotifications.kinds[kind] ?? kind;
}

export function getNotificationActionLabel(t: AppTranslations, label: string) {
  const actions = t.browse.notifications.actions;
  if (label === "View Shift") {
    return actions.viewShift;
  }
  if (label === "View Details") {
    return actions.viewDetails;
  }
  return label;
}

export function getCompanyNotificationActionLabel(t: AppTranslations, label: string) {
  const actions = t.browse.companyNotifications.actions;
  if (label === "View Applicants") {
    return actions.viewApplicants;
  }
  if (label === "View Shifts") {
    return actions.viewShifts;
  }
  if (label === "View Details") {
    return actions.viewDetails;
  }
  return label;
}

export function getInviteStatusLabel(t: AppTranslations, status: InviteStatus) {
  return t.browse.invites.statuses[status] ?? status;
}

export function getInviteHowItWorksSteps(t: AppTranslations) {
  const steps = t.browse.invites.howItWorks;
  return [
    { title: steps.step1Title, description: steps.step1Description },
    { title: steps.step2Title, description: steps.step2Description },
    { title: steps.step3Title, description: steps.step3Description },
    { title: steps.step4Title, description: steps.step4Description },
  ];
}

export function formatStartsInLabel(t: AppTranslations, daysUntilStart: number) {
  const upcoming = t.browse.upcomingShifts;
  if (daysUntilStart <= 0) {
    return upcoming.startsToday;
  }
  if (daysUntilStart === 1) {
    return upcoming.startsTomorrow;
  }
  return interpolate(upcoming.startsInDays, { count: daysUntilStart });
}

export function translateShiftFormLabel(t: AppTranslations, englishLabel: string) {
  const opt = t.filters.shiftOptions;
  const map: Record<string, string> = {
    Gig: opt.gig,
    "Full-Time": opt.fullTime,
    "Part-Time": opt.partTime,
    "Day Shift": opt.dayShift,
    "Night Shift": opt.nightShift,
    Overnight: opt.overnight,
    Armed: opt.armed,
    Unarmed: opt.unarmed,
    Either: opt.either,
  };
  return map[englishLabel] ?? englishLabel;
}

export function getProfileWizardStepCopy(
  t: AppTranslations,
  stepId: ProfileWizardStepId
) {
  return t.profileWizard.steps[stepId];
}

export function getProfileWizardSteps(t: AppTranslations) {
  return PROFILE_WIZARD_STEP_IDS.map((id) => ({
    id,
    ...getProfileWizardStepCopy(t, id),
    icon: PROFILE_WIZARD_STEP_ICONS[id],
    required: PROFILE_WIZARD_STEP_REQUIRED[id],
  }));
}

export function getProfileWizardDescription(t: AppTranslations, stepId: ProfileWizardStepId) {
  return t.profileWizard.descriptions[stepId];
}

export function getProfileWizardTips(t: AppTranslations, stepId: ProfileWizardStepId) {
  return t.profileWizard.tips[stepId];
}

export function translateProfileOptionLabel(t: AppTranslations, value: string) {
  const options = t.profileWizard.options;
  return (
    options.experienceCategories[value] ??
    options.availability[value] ??
    options.certifications[value] ??
    value
  );
}

export function translateArmedStatusLabel(t: AppTranslations, status: "ARMED" | "UNARMED") {
  return t.profileWizard.options.armed[status];
}

export function validateWizardStepTranslated(
  t: AppTranslations,
  stepId: ProfileWizardStepId,
  form: WizardFormSnapshot
): string | null {
  const v = t.profileWizard.validation;

  switch (stepId) {
    case "basic":
      if (!form.firstName.trim()) return v.firstNameRequired;
      if (!form.lastName.trim()) return v.lastNameRequired;
      if (!form.phone.trim()) return v.phoneRequired;
      if (!form.email.trim()) return v.emailRequired;
      if (!form.city.trim()) return v.cityRequired;
      return null;
    case "experience":
      if (form.armedStatuses.length === 0) return v.armedRequired;
      if (!form.experienceYears.trim()) return v.experienceYearsRequired;
      if (Number(form.experienceYears) < 0) return v.experienceYearsMin;
      if (form.experienceCategories.length === 0) return v.experienceCategoryRequired;
      return null;
    case "licenses": {
      if (
        form.licenses.some(
          (license) => !license.licenseType.trim() || license.licenseType === "Other"
        )
      ) {
        return v.licenseTypeRequired;
      }
      for (const license of form.licenses) {
        if (!license.licenseNumber.trim()) return v.licenseNumberRequired;
        if (!license.issuingState.trim()) return v.licenseStateRequired;
        if (!license.expirationDate.trim()) return v.licenseExpirationRequired;
      }
      if (!form.licenseCertificationAccepted) return v.licenseCertRequired;
      return null;
    }
    case "certifications":
    case "availability":
      return null;
    default:
      return null;
  }
}

export function getShiftWorkTypeSelectOptions(t: AppTranslations) {
  return SHIFT_WORK_TYPE_OPTIONS.map((option) => ({
    value: option.value,
    label: translateShiftFormLabel(t, option.label),
  }));
}

export function getShiftTimeTypeSelectOptions(t: AppTranslations) {
  return SHIFT_TIME_TYPE_OPTIONS.map((option) => ({
    value: option.value,
    label: translateShiftFormLabel(t, option.label),
  }));
}

export function getShiftArmedSelectOptions(t: AppTranslations) {
  return SHIFT_ARMED_OPTIONS.map((option) => ({
    value: option.value,
    label: translateShiftFormLabel(t, option.label),
  }));
}

export function getAcceptedShiftTabBadge(t: AppTranslations, tab: AcceptedShiftTab) {
  const badges = t.acceptedShifts.card;
  switch (tab) {
    case "completed":
      return badges.completed;
    case "cancelled":
      return badges.cancelled;
    default:
      return badges.confirmed;
  }
}

const PROFILE_WIZARD_STEP_IDS = [
  "basic",
  "experience",
  "licenses",
  "certifications",
  "availability",
] as const satisfies readonly ProfileWizardStepId[];

const PROFILE_WIZARD_STEP_ICONS: Record<ProfileWizardStepId, string> = {
  basic: "👤",
  experience: "🛡️",
  licenses: "📄",
  certifications: "🏅",
  availability: "📅",
};

const PROFILE_WIZARD_STEP_REQUIRED: Record<ProfileWizardStepId, boolean> = {
  basic: true,
  experience: true,
  licenses: true,
  certifications: false,
  availability: false,
};

export function getShiftActionMessages(t: AppTranslations) {
  return t.company.shiftActions;
}

export function formatOfficerExperienceMobile(
  t: AppTranslations,
  experienceYears: number | null | undefined
) {
  const copy = t.company.officerCards;
  if (experienceYears === null || experienceYears === undefined) {
    return null;
  }

  return experienceYears === 1
    ? copy.oneYearExperienceMobile
    : interpolate(copy.yearsExperienceMobile, { count: String(experienceYears) });
}

export function formatOfficerExperienceDesktop(
  t: AppTranslations,
  experienceYears: number | null | undefined
) {
  const copy = t.company.officerCards;
  if (experienceYears === null || experienceYears === undefined) {
    return copy.experienceNotProvided;
  }

  return experienceYears === 1
    ? copy.oneYearExperience
    : interpolate(copy.yearsExperience, { count: String(experienceYears) });
}

export function formatStaffCountLabel(
  t: AppTranslations,
  filtered: number,
  total: number,
  language: string
) {
  const totalSuffix =
    language === "es" ? (total === 1 ? "" : "es") : total === 1 ? "" : "s";

  return interpolate(t.company.staff.staffCount, {
    filtered: String(filtered),
    total: String(total),
    totalSuffix,
  });
}

export function getAdminSidebarItems(t: AppTranslations) {
  const items = t.admin.items;
  return [
    { href: "/admin", label: items.dashboard, match: (pathname: string) => pathname === "/admin" },
    {
      href: "/admin/companies",
      label: items.companies,
      match: (pathname: string) => pathname.startsWith("/admin/companies"),
    },
    {
      href: "/admin/officers",
      label: items.officers,
      match: (pathname: string) => pathname.startsWith("/admin/officers"),
    },
    {
      href: "/admin/shifts",
      label: items.shifts,
      match: (pathname: string) => pathname.startsWith("/admin/shifts"),
    },
    {
      href: "/admin/applications",
      label: items.applications,
      match: (pathname: string) => pathname.startsWith("/admin/applications"),
    },
    {
      href: "/admin/reports",
      label: items.reports,
      match: (pathname: string) => pathname.startsWith("/admin/reports"),
    },
    {
      href: "/admin/audit-logs",
      label: items.auditLogs,
      match: (pathname: string) => pathname.startsWith("/admin/audit-logs"),
    },
    {
      href: "/admin/settings",
      label: items.settings,
      match: (pathname: string) => pathname.startsWith("/admin/settings"),
    },
  ] as const;
}
