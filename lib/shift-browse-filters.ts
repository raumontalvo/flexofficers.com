import type { ShiftCardData } from "@/lib/shift-card-data";

export const WORK_TYPE_OPTIONS = [
  { value: "", label: "All" },
  { value: "Gig", label: "Gig" },
  { value: "Full-Time", label: "Full-Time" },
  { value: "Part-Time", label: "Part-Time" },
] as const;

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "highest-pay", label: "Highest Pay" },
  { value: "earliest-start", label: "Earliest Start" },
] as const;

export type WorkTypeFilter = (typeof WORK_TYPE_OPTIONS)[number]["value"];
export type ShiftSortOption = (typeof SORT_OPTIONS)[number]["value"];

export type ShiftBrowseFilters = {
  city: string;
  state: string;
  date: string;
  minHourlyRate: string;
  workType: WorkTypeFilter;
  armed: boolean;
  unarmed: boolean;
  dayShift: boolean;
  nightShift: boolean;
  overnight: boolean;
};

export const emptyShiftBrowseFilters: ShiftBrowseFilters = {
  city: "",
  state: "",
  date: "",
  minHourlyRate: "",
  workType: "",
  armed: false,
  unarmed: false,
  dayShift: false,
  nightShift: false,
  overnight: false,
};

export function hasActiveShiftFilters(filters: ShiftBrowseFilters) {
  return (
    filters.city.trim().length > 0 ||
    filters.state.trim().length > 0 ||
    filters.date.trim().length > 0 ||
    filters.minHourlyRate.trim().length > 0 ||
    filters.workType.trim().length > 0 ||
    filters.armed ||
    filters.unarmed ||
    filters.dayShift ||
    filters.nightShift ||
    filters.overnight
  );
}

export function clearPrimaryShiftFilters(
  filters: ShiftBrowseFilters
): ShiftBrowseFilters {
  return {
    ...filters,
    city: "",
    state: "",
    date: "",
    minHourlyRate: "",
    workType: "",
  };
}

export const SHIFT_FILTER_SUMMARY_PLACEHOLDER =
  "Search by city, state, date, pay, and work type";

export const SHIFT_FILTER_CHIPS_DEFAULT =
  "Any location • Any date • Any pay • All types";

export function hasMoreShiftFilters(filters: ShiftBrowseFilters) {
  return (
    filters.armed ||
    filters.unarmed ||
    filters.dayShift ||
    filters.nightShift ||
    filters.overnight
  );
}

function formatFilterDate(value: string) {
  const parsed = new Date(`${value}T12:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-US", {
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

export function formatShiftFilterSummary(filters: ShiftBrowseFilters) {
  const parts: string[] = [];

  const location = formatLocationSummary(filters);
  if (location) {
    parts.push(location);
  }

  if (filters.date.trim()) {
    parts.push(formatFilterDate(filters.date.trim()));
  }

  if (filters.minHourlyRate.trim()) {
    parts.push(`$${filters.minHourlyRate.trim()}+/hr`);
  }

  if (filters.workType.trim()) {
    parts.push(filters.workType);
  }

  if (hasMoreShiftFilters(filters)) {
    parts.push("More filters");
  }

  return parts.length > 0 ? parts.join(" • ") : null;
}

export function formatShiftFilterChipsSummary(filters: ShiftBrowseFilters) {
  const location = formatLocationSummary(filters) ?? "Any location";
  const datePart = filters.date.trim()
    ? formatFilterDate(filters.date.trim())
    : "Any date";
  const payPart = filters.minHourlyRate.trim()
    ? `$${filters.minHourlyRate.trim()}+/hr`
    : "Any pay";
  const workTypePart = filters.workType.trim() || "All types";

  const parts = [location, datePart, payPart, workTypePart];

  if (hasMoreShiftFilters(filters)) {
    parts.push("More filters");
  }

  return parts.join(" • ");
}

export function formatOpenShiftCount(count: number) {
  if (count === 1) {
    return "1 Open Shift";
  }

  return `${count} Open Shifts`;
}

export function formatPaginationRange(
  rangeStart: number,
  rangeEnd: number,
  total: number
) {
  if (total === 0) {
    return "Showing 0 open shifts";
  }

  return `Showing ${rangeStart}–${rangeEnd} of ${total} open shifts`;
}

function shiftHaystack(shift: ShiftCardData) {
  return [
    shift.title,
    shift.companyName ?? "",
    shift.location,
    shift.city ?? "",
    shift.state ?? "",
    shift.specialRequirements,
  ]
    .join(" ")
    .toLowerCase();
}

function locationMatchesCity(shift: ShiftCardData, city: string) {
  const normalized = city.toLowerCase();
  return (
    (shift.city?.toLowerCase().includes(normalized) ?? false) ||
    shift.location.toLowerCase().includes(normalized)
  );
}

function locationMatchesState(shift: ShiftCardData, stateCode: string) {
  if (shift.state?.toUpperCase() === stateCode.toUpperCase()) {
    return true;
  }

  return shift.location.toUpperCase().includes(stateCode.toUpperCase());
}

function matchesWorkType(shift: ShiftCardData, workType: WorkTypeFilter) {
  if (!workType) {
    return true;
  }

  if (shift.workType) {
    const workTypeMap = {
      GIG: "Gig",
      FULL_TIME: "Full-Time",
      PART_TIME: "Part-Time",
    } as const;

    return workTypeMap[shift.workType] === workType;
  }

  const haystack = shiftHaystack(shift);

  switch (workType) {
    case "Gig":
      return /gig|contract|temporary|short[- ]term/.test(haystack);
    case "Full-Time":
      return /full[- ]time/.test(haystack);
    case "Part-Time":
      return /part[- ]time/.test(haystack);
    default:
      return true;
  }
}

function getShiftStartHour(iso: string) {
  return new Date(iso).getHours();
}

function isOvernightShift(startTime: string, endTime: string) {
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (end <= start) {
    return false;
  }

  return (
    end.getDate() !== start.getDate() ||
    end.getMonth() !== start.getMonth() ||
    end.getFullYear() !== start.getFullYear() ||
    getShiftStartHour(startTime) >= 22
  );
}

function matchesScheduleFilters(
  shift: ShiftCardData,
  filters: ShiftBrowseFilters
) {
  const scheduleFiltersActive =
    filters.dayShift || filters.nightShift || filters.overnight;

  if (!scheduleFiltersActive) {
    return true;
  }

  if (shift.shiftTimeType) {
    const matchesDay = filters.dayShift && shift.shiftTimeType === "DAY_SHIFT";
    const matchesNight =
      filters.nightShift && shift.shiftTimeType === "NIGHT_SHIFT";
    const matchesOvernight =
      filters.overnight && shift.shiftTimeType === "OVERNIGHT";

    return matchesDay || matchesNight || matchesOvernight;
  }

  const startHour = getShiftStartHour(shift.startTime);
  const haystack = shiftHaystack(shift);

  const matchesDay =
    filters.dayShift &&
    ((startHour >= 6 && startHour < 18) || /day shift/.test(haystack));
  const matchesNight =
    filters.nightShift &&
    ((startHour >= 18 && startHour < 23) || /night shift/.test(haystack));
  const matchesOvernight =
    filters.overnight &&
    (isOvernightShift(shift.startTime, shift.endTime) ||
      /overnight/.test(haystack));

  return matchesDay || matchesNight || matchesOvernight;
}

function matchesArmedFilters(shift: ShiftCardData, filters: ShiftBrowseFilters) {
  if (!filters.armed && !filters.unarmed) {
    return true;
  }

  if (shift.armedRequirement) {
    const matchesArmed =
      filters.armed &&
      (shift.armedRequirement === "ARMED" || shift.armedRequirement === "EITHER");
    const matchesUnarmed =
      filters.unarmed &&
      (shift.armedRequirement === "UNARMED" ||
        shift.armedRequirement === "EITHER");

    if (filters.armed && filters.unarmed) {
      return matchesArmed || matchesUnarmed;
    }

    return matchesArmed || matchesUnarmed;
  }

  const haystack = shiftHaystack(shift);
  const mentionsArmed = /\barmed\b/.test(haystack);
  const mentionsUnarmed = /\bunarmed\b/.test(haystack);

  if (filters.armed && filters.unarmed) {
    return mentionsArmed || mentionsUnarmed;
  }

  if (filters.armed) {
    return mentionsArmed;
  }

  return mentionsUnarmed;
}

export function filterBrowseShifts(
  shifts: ShiftCardData[],
  filters: ShiftBrowseFilters
) {
  const city = filters.city.trim();
  const minRate = filters.minHourlyRate.trim()
    ? Number(filters.minHourlyRate)
    : null;

  return shifts.filter((shift) => {
    if (city && !locationMatchesCity(shift, city)) {
      return false;
    }

    if (filters.state && !locationMatchesState(shift, filters.state)) {
      return false;
    }

    if (filters.date && shift.startTime.slice(0, 10) !== filters.date) {
      return false;
    }

    if (minRate !== null && Number.isFinite(minRate)) {
      if (Number(shift.hourlyRate) < minRate) {
        return false;
      }
    }

    if (!matchesWorkType(shift, filters.workType)) {
      return false;
    }

    if (!matchesArmedFilters(shift, filters)) {
      return false;
    }

    if (!matchesScheduleFilters(shift, filters)) {
      return false;
    }

    return true;
  });
}

export function sortBrowseShifts(
  shifts: ShiftCardData[],
  sortBy: ShiftSortOption
) {
  const sorted = [...shifts];

  switch (sortBy) {
    case "highest-pay":
      sorted.sort(
        (left, right) => Number(right.hourlyRate) - Number(left.hourlyRate)
      );
      break;
    case "earliest-start":
      sorted.sort(
        (left, right) =>
          new Date(left.startTime).getTime() - new Date(right.startTime).getTime()
      );
      break;
    case "newest":
    default:
      sorted.sort(
        (left, right) =>
          new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
      );
      break;
  }

  return sorted;
}
