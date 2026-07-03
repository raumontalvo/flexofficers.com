"use client";

import { useMemo } from "react";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import {
  buildShiftDateTimes,
  type RecurringShiftConfig,
} from "@/lib/shift-create-form";
import {
  formatRecurringShiftPreview,
  WEEKDAY_KEYS,
  type RecurringEndType,
  type RecurringFrequency,
  type WeekdayKey,
} from "@/lib/recurring-shifts";
import { cn } from "@/lib/cn";

const fieldClassName =
  "min-h-11 w-full rounded-lg border border-fo-border bg-fo-bg/80 px-3 py-2.5 text-sm text-fo-text placeholder:text-fo-text-subtle focus:border-fo-primary-bright/50 focus:outline-none focus:ring-2 focus:ring-fo-primary-bright/20";

const dayButtonClassName =
  "min-h-10 rounded-lg border px-2 text-xs font-semibold transition";

type RecurringShiftOptionsProps = {
  startDate: string;
  startTime: string;
  endTime: string;
  recurring: RecurringShiftConfig;
  onChange: (next: RecurringShiftConfig) => void;
};

export function RecurringShiftOptions({
  startDate,
  startTime,
  endTime,
  recurring,
  onChange,
}: RecurringShiftOptionsProps) {
  const { t } = useLandingLanguage();
  const copy = t.shiftForm.recurring;

  const templateStart = useMemo(() => {
    const { startTime: builtStart } = buildShiftDateTimes({
      startDate,
      startTime,
      endTime,
    });
    return builtStart;
  }, [endTime, startDate, startTime]);

  const preview = formatRecurringShiftPreview(recurring, templateStart, {
    daily: copy.previewDaily,
    everyDay: copy.previewEveryDay,
    everyPrefix: copy.previewEveryPrefix,
    conjunction: copy.previewConjunction,
    untilDate: copy.previewUntilDate,
    occurrenceCount: copy.previewOccurrenceCount,
    willCreate: copy.previewWillCreate,
    shifts: copy.previewShifts,
    shift: copy.previewShift,
    weekdayLabels: copy.weekdays,
  });

  function updateRecurring<K extends keyof RecurringShiftConfig>(
    key: K,
    value: RecurringShiftConfig[K]
  ) {
    onChange({ ...recurring, [key]: value });
  }

  function toggleRepeatDay(day: WeekdayKey) {
    const repeatDays = recurring.repeatDays.includes(day)
      ? recurring.repeatDays.filter((entry) => entry !== day)
      : [...recurring.repeatDays, day];

    updateRecurring("repeatDays", repeatDays);
  }

  return (
    <div className="space-y-4 rounded-lg border border-white/10 bg-white/[0.03] p-3 sm:p-4">
      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={recurring.enabled}
          onChange={(event) => updateRecurring("enabled", event.target.checked)}
          className="mt-1 rounded border-fo-border"
        />
        <span>
          <span className="block text-sm font-medium text-fo-text">
            {copy.title}
          </span>
          <span className="mt-0.5 block text-xs text-fo-text-muted">
            {copy.description}
          </span>
        </span>
      </label>

      {recurring.enabled ? (
        <div className="space-y-4 border-t border-white/[0.06] pt-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-fo-text-muted">
              {copy.frequencyLabel}
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {(["DAILY", "WEEKLY"] as RecurringFrequency[]).map((frequency) => {
                const selected = recurring.frequency === frequency;
                const label =
                  frequency === "DAILY" ? copy.frequencyDaily : copy.frequencyWeekly;

                return (
                  <button
                    key={frequency}
                    type="button"
                    onClick={() => updateRecurring("frequency", frequency)}
                    className={cn(
                      dayButtonClassName,
                      selected
                        ? "border-fo-primary-bright/40 bg-fo-primary/10 text-fo-primary-hover"
                        : "border-white/10 bg-white/[0.02] text-fo-text-muted hover:bg-white/[0.04] hover:text-fo-text"
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {recurring.frequency === "WEEKLY" ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-fo-text-muted">
                {copy.repeatDaysLabel}
              </p>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                {WEEKDAY_KEYS.map((day) => {
                  const selected = recurring.repeatDays.includes(day);

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleRepeatDay(day)}
                      className={cn(
                        dayButtonClassName,
                        selected
                          ? "border-fo-primary-bright/40 bg-fo-primary/10 text-fo-primary-hover"
                          : "border-white/10 bg-white/[0.02] text-fo-text-muted hover:bg-white/[0.04] hover:text-fo-text"
                      )}
                    >
                      {copy.weekdaysShort[day]}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="space-y-3">
            <p className="text-sm font-medium text-fo-text-muted">
              {copy.endConditionLabel}
            </p>

            <div className="space-y-3">
              <label className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-3">
                <input
                  type="radio"
                  name="recurring-end-type"
                  checked={recurring.endType === "occurrences"}
                  onChange={() => updateRecurring("endType", "occurrences")}
                  className="mt-1"
                />
                <span className="min-w-0 flex-1 space-y-2">
                  <span className="block text-sm font-medium text-fo-text">
                    {copy.endAfterOccurrences}
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={recurring.occurrenceCount}
                    onChange={(event) =>
                      updateRecurring("occurrenceCount", event.target.value)
                    }
                    disabled={recurring.endType !== "occurrences"}
                    className={cn(fieldClassName, "disabled:opacity-50")}
                  />
                </span>
              </label>

              <label className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-3">
                <input
                  type="radio"
                  name="recurring-end-type"
                  checked={recurring.endType === "date"}
                  onChange={() => updateRecurring("endType", "date" satisfies RecurringEndType)}
                  className="mt-1"
                />
                <span className="min-w-0 flex-1 space-y-2">
                  <span className="block text-sm font-medium text-fo-text">
                    {copy.endOnDate}
                  </span>
                  <input
                    type="date"
                    value={recurring.endDate}
                    onChange={(event) =>
                      updateRecurring("endDate", event.target.value)
                    }
                    disabled={recurring.endType !== "date"}
                    className={cn(fieldClassName, "disabled:opacity-50")}
                  />
                </span>
              </label>
            </div>
          </div>

          {preview ? (
            <p className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-xs leading-relaxed text-blue-100">
              {preview}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
