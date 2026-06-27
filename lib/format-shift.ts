export function formatHourlyRate(rate: { toString: () => string } | number) {
  const value = typeof rate === "number" ? rate : Number(rate.toString());
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatShiftDateTime(date: Date) {
  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatShiftTime(date: Date) {
  return date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatShiftDateRange(startTime: Date, endTime: Date) {
  const sameDay = startTime.toDateString() === endTime.toDateString();

  if (sameDay) {
    const dateLabel = startTime.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    return `${dateLabel} · ${formatShiftTime(startTime)} – ${formatShiftTime(endTime)}`;
  }

  return `${formatShiftDateTime(startTime)} – ${formatShiftDateTime(endTime)}`;
}

export type ShiftScheduleParts = {
  weekday: string;
  monthDay: string;
  timeRange: string;
};

export function formatShiftScheduleParts(
  startTime: Date,
  endTime: Date
): ShiftScheduleParts {
  return {
    weekday: startTime.toLocaleString("en-US", { weekday: "short" }),
    monthDay: startTime.toLocaleString("en-US", { month: "short", day: "numeric" }),
    timeRange: `${formatShiftTime(startTime)} – ${formatShiftTime(endTime)}`,
  };
}

export function formatShiftCityState(shift: {
  city?: string | null;
  state?: string | null;
  location: string;
}) {
  const city = shift.city?.trim();
  const state = shift.state?.trim();

  if (city && state) {
    return `${city}, ${state}`;
  }

  if (city) {
    return city;
  }

  if (state) {
    return state;
  }

  return shift.location;
}

export function calculateEstimatedShiftPay(
  hourlyRate: { toString: () => string },
  startTime: Date,
  endTime: Date
): number | null {
  const rate = Number(hourlyRate.toString());
  const durationMs = endTime.getTime() - startTime.getTime();
  const hours = durationMs / (1000 * 60 * 60);

  if (!Number.isFinite(rate) || rate <= 0 || !Number.isFinite(hours) || hours <= 0) {
    return null;
  }

  return rate * hours;
}

export function formatEstimatedShiftPay(
  hourlyRate: { toString: () => string },
  startTime: Date,
  endTime: Date
) {
  const total = calculateEstimatedShiftPay(hourlyRate, startTime, endTime);

  if (total === null) {
    return null;
  }

  return formatHourlyRate(total);
}
