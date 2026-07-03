export const MAX_RECURRING_OCCURRENCES = 60;

export type RecurringFrequency = "DAILY" | "WEEKLY";
export type RecurringEndType = "occurrences" | "date";
export type WeekdayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export const WEEKDAY_KEYS: WeekdayKey[] = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
];

const WEEKDAY_TO_JS: Record<WeekdayKey, number> = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
};

const JS_TO_WEEKDAY: Record<number, WeekdayKey> = {
  0: "sun",
  1: "mon",
  2: "tue",
  3: "wed",
  4: "thu",
  5: "fri",
  6: "sat",
};

export type RecurringShiftConfig = {
  enabled: boolean;
  frequency: RecurringFrequency;
  repeatDays: WeekdayKey[];
  endType: RecurringEndType;
  occurrenceCount: string;
  endDate: string;
};

export const emptyRecurringShiftConfig: RecurringShiftConfig = {
  enabled: false,
  frequency: "WEEKLY",
  repeatDays: [],
  endType: "occurrences",
  occurrenceCount: "4",
  endDate: "",
};

export type RecurringShiftPayload = {
  frequency: RecurringFrequency;
  repeatDays?: WeekdayKey[];
  endType: RecurringEndType;
  occurrenceCount?: number;
  endDate?: string;
};

export type RecurringPreviewLabels = {
  daily: string;
  everyDay: string;
  everyPrefix: string;
  conjunction: string;
  untilDate: string;
  occurrenceCount: string;
  willCreate: string;
  shifts: string;
  shift: string;
  weekdayLabels: Record<WeekdayKey, string>;
};

function parseDateOnly(dateStr: string) {
  if (!dateStr.trim()) {
    return null;
  }

  const [year, month, day] = dateStr.split("-").map(Number);

  if (!year || !month || !day) {
    return null;
  }

  const parsed = new Date(year, month - 1, day);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  parsed.setHours(0, 0, 0, 0);
  return parsed;
}

function startOfDay(date: Date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function applyTimeFromTemplate(date: Date, template: Date) {
  const result = new Date(date);
  result.setHours(
    template.getHours(),
    template.getMinutes(),
    template.getSeconds(),
    0
  );
  return result;
}

function computeOccurrenceEndTime(
  occurrenceStart: Date,
  templateStart: Date,
  templateEnd: Date
) {
  const durationMs = templateEnd.getTime() - templateStart.getTime();
  return new Date(occurrenceStart.getTime() + durationMs);
}

function shouldIncludeDate(
  cursor: Date,
  anchor: Date,
  config: Pick<RecurringShiftConfig, "frequency" | "repeatDays">
) {
  if (cursor < anchor) {
    return false;
  }

  if (config.frequency === "DAILY") {
    return true;
  }

  const weekday = JS_TO_WEEKDAY[cursor.getDay()];
  return config.repeatDays.includes(weekday);
}

export function buildRecurringOccurrenceStarts(
  templateStart: Date,
  config: Pick<
    RecurringShiftConfig,
    "frequency" | "repeatDays" | "endType" | "occurrenceCount" | "endDate"
  >
) {
  const starts: Date[] = [];
  const anchor = startOfDay(templateStart);
  const endLimitDate =
    config.endType === "date" ? parseDateOnly(config.endDate) : null;
  const requestedCount =
    config.endType === "occurrences"
      ? Number.parseInt(config.occurrenceCount, 10)
      : MAX_RECURRING_OCCURRENCES;
  const targetCount = Math.min(
    Number.isInteger(requestedCount) && requestedCount > 0
      ? requestedCount
      : MAX_RECURRING_OCCURRENCES,
    MAX_RECURRING_OCCURRENCES
  );

  const cursor = new Date(anchor);
  let daysScanned = 0;

  while (
    starts.length < MAX_RECURRING_OCCURRENCES &&
    daysScanned < 366 * 2
  ) {
    if (endLimitDate && cursor > endLimitDate) {
      break;
    }

    if (config.endType === "occurrences" && starts.length >= targetCount) {
      break;
    }

    if (shouldIncludeDate(cursor, anchor, config)) {
      starts.push(applyTimeFromTemplate(cursor, templateStart));
    }

    cursor.setDate(cursor.getDate() + 1);
    daysScanned += 1;
  }

  return starts;
}

export function buildRecurringOccurrences(
  templateStart: Date,
  templateEnd: Date,
  config: Pick<
    RecurringShiftConfig,
    "frequency" | "repeatDays" | "endType" | "occurrenceCount" | "endDate"
  >
) {
  return buildRecurringOccurrenceStarts(templateStart, config).map(
    (startTime) => ({
      startTime,
      endTime: computeOccurrenceEndTime(startTime, templateStart, templateEnd),
    })
  );
}

export function countRecurringOccurrences(
  templateStart: Date,
  config: Pick<
    RecurringShiftConfig,
    "frequency" | "repeatDays" | "endType" | "occurrenceCount" | "endDate"
  >
) {
  return buildRecurringOccurrenceStarts(templateStart, config).length;
}

function isWeekdayKey(value: string): value is WeekdayKey {
  return WEEKDAY_KEYS.includes(value as WeekdayKey);
}

export function parseRecurringShiftPayload(
  value: unknown
):
  | { enabled: false }
  | { enabled: true; data: RecurringShiftPayload; errors?: never }
  | { enabled: true; errors: string[]; data?: never } {
  if (typeof value === "undefined" || value === null) {
    return { enabled: false };
  }

  if (typeof value !== "object") {
    return { enabled: true, errors: ["recurring must be an object"] };
  }

  const payload = value as Record<string, unknown>;
  const errors: string[] = [];

  const frequencyRaw =
    typeof payload.frequency === "string" ? payload.frequency.trim() : "";
  const frequency =
    frequencyRaw === "DAILY" || frequencyRaw === "WEEKLY"
      ? frequencyRaw
      : null;

  if (!frequency) {
    errors.push("recurring.frequency must be DAILY or WEEKLY");
  }

  const endTypeRaw =
    typeof payload.endType === "string" ? payload.endType.trim() : "";
  const endType =
    endTypeRaw === "occurrences" || endTypeRaw === "date" ? endTypeRaw : null;

  if (!endType) {
    errors.push("recurring.endType must be occurrences or date");
  }

  let repeatDays: WeekdayKey[] | undefined;
  if (frequency === "WEEKLY") {
    if (!Array.isArray(payload.repeatDays) || payload.repeatDays.length === 0) {
      errors.push("recurring.repeatDays must include at least one weekday");
    } else {
      repeatDays = payload.repeatDays
        .filter((entry): entry is string => typeof entry === "string")
        .map((entry) => entry.trim().toLowerCase())
        .filter(isWeekdayKey);

      if (repeatDays.length === 0) {
        errors.push("recurring.repeatDays must include valid weekdays");
      }
    }
  }

  let occurrenceCount: number | undefined;
  if (endType === "occurrences") {
    occurrenceCount = Number(payload.occurrenceCount);

    if (
      !Number.isInteger(occurrenceCount) ||
      occurrenceCount < 1 ||
      occurrenceCount > MAX_RECURRING_OCCURRENCES
    ) {
      errors.push(
        `recurring.occurrenceCount must be an integer between 1 and ${MAX_RECURRING_OCCURRENCES}`
      );
    }
  }

  let endDate: string | undefined;
  if (endType === "date") {
    endDate =
      typeof payload.endDate === "string" ? payload.endDate.trim() : "";

    if (!parseDateOnly(endDate)) {
      errors.push("recurring.endDate must be a valid date");
    }
  }

  if (errors.length > 0 || !frequency || !endType) {
    return { enabled: true, errors };
  }

  return {
    enabled: true,
    data: {
      frequency,
      repeatDays,
      endType,
      occurrenceCount,
      endDate,
    },
  };
}

export function validateRecurringShiftForm(input: {
  startDate: string;
  startTime: string;
  endTime: string;
  locationName: string;
  address: string;
  city: string;
  state: string;
  hourlyRate: string;
  recurring: RecurringShiftConfig;
}) {
  if (!input.recurring.enabled) {
    return null;
  }

  if (!input.startDate.trim()) {
    return "Start date is required for recurring shifts.";
  }

  if (!input.startTime.trim() || !input.endTime.trim()) {
    return "Start time and end time are required for recurring shifts.";
  }

  if (!input.locationName.trim() && !input.address.trim()) {
    return "Location is required for recurring shifts.";
  }

  if (!input.city.trim() || !input.state.trim()) {
    return "City and state are required for recurring shifts.";
  }

  const rate = Number(input.hourlyRate);
  if (!Number.isFinite(rate) || rate <= 0) {
    return "Pay rate is required for recurring shifts.";
  }

  if (
    input.recurring.frequency !== "DAILY" &&
    input.recurring.frequency !== "WEEKLY"
  ) {
    return "Select a repeat frequency.";
  }

  if (
    input.recurring.frequency === "WEEKLY" &&
    input.recurring.repeatDays.length === 0
  ) {
    return "Select at least one repeat day.";
  }

  if (input.recurring.endType === "occurrences") {
    const count = Number.parseInt(input.recurring.occurrenceCount, 10);

    if (
      !Number.isInteger(count) ||
      count < 1 ||
      count > MAX_RECURRING_OCCURRENCES
    ) {
      return `Occurrence count must be between 1 and ${MAX_RECURRING_OCCURRENCES}.`;
    }
  }

  if (input.recurring.endType === "date") {
    const endDate = parseDateOnly(input.recurring.endDate);
    const startDate = parseDateOnly(input.startDate);

    if (!endDate) {
      return "Select an end date for the recurring schedule.";
    }

    if (startDate && endDate < startDate) {
      return "End date must be on or after the start date.";
    }
  }

  return null;
}

function formatWeekdayList(
  repeatDays: WeekdayKey[],
  labels: RecurringPreviewLabels
) {
  const names = repeatDays.map((day) => labels.weekdayLabels[day]);

  if (names.length === 0) {
    return "";
  }

  if (names.length === 1) {
    return names[0];
  }

  if (names.length === 2) {
    return `${names[0]}${labels.conjunction}${names[1]}`;
  }

  const last = names.at(-1);
  const rest = names.slice(0, -1).join(", ");
  return `${rest},${labels.conjunction}${last}`;
}

export function formatRecurringShiftPreview(
  config: RecurringShiftConfig,
  templateStart: Date | null,
  labels: RecurringPreviewLabels
) {
  if (!config.enabled || !templateStart) {
    return "";
  }

  const count = countRecurringOccurrences(templateStart, config);

  if (count === 0) {
    return "";
  }

  const shiftWord = count === 1 ? labels.shift : labels.shifts;
  let cadence = "";

  if (config.frequency === "DAILY") {
    cadence = labels.daily;
  } else {
    const weekdays = formatWeekdayList(config.repeatDays, labels);
    cadence = `${labels.everyPrefix}${weekdays}`;
  }

  let suffix = "";

  if (config.endType === "date" && config.endDate.trim()) {
    const endDate = parseDateOnly(config.endDate);

    if (endDate) {
      suffix = labels.untilDate.replace(
        "{date}",
        endDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      );
    }
  }

  return `${labels.willCreate.replace("{count}", String(count)).replace("{shiftWord}", shiftWord)} ${cadence}${suffix ? ` ${suffix}` : ""}.`.replace(
    /\s+/g,
    " "
  );
}

export function recurringConfigToPayload(
  config: RecurringShiftConfig
): RecurringShiftPayload | null {
  if (!config.enabled) {
    return null;
  }

  const occurrenceCount =
    config.endType === "occurrences"
      ? Number.parseInt(config.occurrenceCount, 10)
      : undefined;

  return {
    frequency: config.frequency,
    repeatDays:
      config.frequency === "WEEKLY" ? config.repeatDays : undefined,
    endType: config.endType,
    occurrenceCount,
    endDate: config.endType === "date" ? config.endDate : undefined,
  };
}

export function recurringPayloadToConfig(
  payload: RecurringShiftPayload
): RecurringShiftConfig {
  return {
    enabled: true,
    frequency: payload.frequency,
    repeatDays: payload.repeatDays ?? [],
    endType: payload.endType,
    occurrenceCount:
      payload.endType === "occurrences"
        ? String(payload.occurrenceCount ?? 1)
        : "4",
    endDate: payload.endDate ?? "",
  };
}

export function getJsWeekdayFromKey(day: WeekdayKey) {
  return WEEKDAY_TO_JS[day];
}
