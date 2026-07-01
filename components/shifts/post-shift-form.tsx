"use client";

import { useRef } from "react";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import {
  POST_SHIFT_CERTIFICATION_OPTIONS,
  type PostShiftFormValues,
} from "@/lib/shift-create-form";
import { US_STATES } from "@/lib/license-options";
import {
  getDateLocale,
  getShiftWorkTypeSelectOptions,
} from "@/lib/i18n/ui-labels";
import { LicenseRequirementsPicker } from "@/components/shifts/license-requirements-picker";
import { RequirementsMultiSelectPicker } from "@/components/shifts/requirements-multi-select-picker";
import { cn } from "@/lib/cn";

const fieldClassName =
  "min-h-11 w-full rounded-lg border border-fo-border bg-fo-bg/80 px-3 py-2.5 text-sm text-fo-text placeholder:text-fo-text-subtle focus:border-fo-primary-bright/50 focus:outline-none focus:ring-2 focus:ring-fo-primary-bright/20";

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <rect
        x="2.5"
        y="3.5"
        width="11"
        height="10"
        rx="1.2"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M5 2.5v2M11 2.5v2M2.5 6.5h11"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M8 5v3.2l2 1.2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function formatShiftFormDate(value: string, locale: string) {
  if (!value) {
    return "";
  }

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return "";
  }

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

function formatShiftFormTime(value: string, locale: string) {
  if (!value) {
    return "";
  }

  const [hours, minutes] = value.split(":").map(Number);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return "";
  }

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function ShiftDateTimeField({
  id,
  type,
  value,
  onChange,
  placeholder,
  icon,
  locale,
}: {
  id: string;
  type: "date" | "time";
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon: "calendar" | "clock";
  locale: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const display =
    type === "date"
      ? formatShiftFormDate(value, locale)
      : formatShiftFormTime(value, locale);
  const Icon = icon === "calendar" ? CalendarIcon : ClockIcon;

  function openPicker() {
    const input = inputRef.current;
    if (!input) {
      return;
    }

    input.focus({ preventScroll: true });

    if (typeof input.showPicker === "function") {
      try {
        input.showPicker();
      } catch {
        // showPicker can throw if the browser blocks it.
      }
    }
  }

  return (
    <label
      htmlFor={id}
      className={cn(
        "relative block w-full max-w-full min-w-0 cursor-pointer rounded-2xl border border-fo-border bg-fo-bg/80 box-border transition touch-manipulation",
        "focus-within:border-fo-primary-bright/50 focus-within:ring-2 focus-within:ring-fo-primary-bright/20"
      )}
      onClick={openPicker}
    >
      <div className="pointer-events-none flex min-h-11 w-full max-w-full min-w-0 items-center gap-4 px-4">
        <Icon className="h-4 w-4 shrink-0 text-fo-text-subtle" />
        <span
          className={cn(
            "min-w-0 flex-1 truncate text-sm",
            display ? "text-fo-text" : "text-fo-text-subtle"
          )}
        >
          {display || placeholder}
        </span>
      </div>
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onClick={openPicker}
        className="absolute inset-0 z-10 h-full w-full max-w-full min-w-0 cursor-pointer opacity-[0.001]"
      />
    </label>
  );
}

function SectionCard({
  number,
  title,
  children,
  className,
  contentClassName,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <section
      className={cn(
        "fo-glass-card rounded-xl border border-white/10 p-4 sm:p-5",
        className
      )}
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-200">
          {number}
        </span>
        <h2 className="text-base font-semibold text-fo-text">{title}</h2>
      </div>
      <div className={cn("space-y-4", contentClassName)}>{children}</div>
    </section>
  );
}

function RequiredLabel({
  children,
  htmlFor,
}: {
  children: string;
  htmlFor?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-fo-text-muted">
      {children}
      <span className="ml-0.5 text-red-400" aria-hidden="true">
        *
      </span>
    </label>
  );
}

function OptionalLabel({
  children,
  htmlFor,
}: {
  children: string;
  htmlFor?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-fo-text-muted">
      {children}
    </label>
  );
}

type PostShiftFormProps = {
  form: PostShiftFormValues;
  onChange: (next: PostShiftFormValues) => void;
  otherRequirementsPlaceholder?: string;
};

export function PostShiftForm({
  form,
  onChange,
  otherRequirementsPlaceholder,
}: PostShiftFormProps) {
  const { t, language } = useLandingLanguage();
  const sf = t.shiftForm;
  const locale = getDateLocale(language);
  const workTypeOptions = getShiftWorkTypeSelectOptions(t);
  const resolvedOtherRequirementsPlaceholder =
    otherRequirementsPlaceholder ?? sf.placeholders.otherRequirementsPost;

  function updateField<K extends keyof PostShiftFormValues>(
    key: K,
    value: PostShiftFormValues[K]
  ) {
    onChange({ ...form, [key]: value });
  }

  function adjustPositions(delta: number) {
    updateField(
      "positionsNeeded",
      Math.max(1, form.positionsNeeded + delta)
    );
  }

  return (
    <div className="space-y-4">
      <SectionCard number={1} title={sf.sections.shiftDetails}>
        <div className="space-y-2">
          <RequiredLabel htmlFor="title">{sf.fields.shiftTitle}</RequiredLabel>
          <input
            id="title"
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
            className={fieldClassName}
            placeholder={sf.placeholders.shiftTitleExample}
          />
        </div>

        <div className="space-y-2">
          <RequiredLabel htmlFor="workType">{sf.fields.typeOfPost}</RequiredLabel>
          <select
            id="workType"
            value={form.workType}
            onChange={(event) => updateField("workType", event.target.value)}
            className={fieldClassName}
          >
            <option value="">{sf.placeholders.selectPostType}</option>
            {workTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <OptionalLabel htmlFor="description">{sf.fields.description}</OptionalLabel>
          <textarea
            id="description"
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            className={cn(fieldClassName, "min-h-28 resize-y")}
            placeholder={sf.placeholders.descriptionLong}
          />
        </div>

        <p className="text-xs leading-relaxed text-fo-text-muted">
          {sf.hints.shiftDetails}
        </p>
      </SectionCard>

      <SectionCard
        number={2}
        title={sf.sections.dateTime}
        className="fo-shift-datetime-section min-w-0"
        contentClassName="w-full max-w-full min-w-0"
      >
        <div className="grid w-full min-w-0 max-w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3">
          <div className="w-full max-w-full min-w-0 space-y-2">
            <RequiredLabel htmlFor="startDate">{sf.fields.startDate}</RequiredLabel>
            <ShiftDateTimeField
              id="startDate"
              type="date"
              value={form.startDate}
              onChange={(startDate) => updateField("startDate", startDate)}
              placeholder={sf.placeholders.selectDate}
              icon="calendar"
              locale={locale}
            />
          </div>
          <div className="w-full max-w-full min-w-0 space-y-2">
            <RequiredLabel htmlFor="startTime">{sf.fields.startTime}</RequiredLabel>
            <ShiftDateTimeField
              id="startTime"
              type="time"
              value={form.startTime}
              onChange={(startTime) => updateField("startTime", startTime)}
              placeholder={sf.placeholders.selectTime}
              icon="clock"
              locale={locale}
            />
          </div>
          <div className="w-full max-w-full min-w-0 space-y-2">
            <RequiredLabel htmlFor="endTime">{sf.fields.endTime}</RequiredLabel>
            <ShiftDateTimeField
              id="endTime"
              type="time"
              value={form.endTime}
              onChange={(endTime) => updateField("endTime", endTime)}
              placeholder={sf.placeholders.selectTime}
              icon="clock"
              locale={locale}
            />
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
          <label className="flex items-start gap-3 opacity-60">
            <input type="checkbox" disabled className="mt-1 rounded border-fo-border" />
            <span>
              <span className="block text-sm font-medium text-fo-text">
                {sf.recurring.title}
              </span>
              <span className="mt-0.5 block text-xs text-fo-text-muted">
                {sf.recurring.description}
              </span>
            </span>
          </label>
        </div>
      </SectionCard>

      <SectionCard number={3} title={sf.sections.location}>
        <div className="space-y-2">
          <RequiredLabel htmlFor="locationName">{sf.fields.locationName}</RequiredLabel>
          <input
            id="locationName"
            value={form.locationName}
            onChange={(event) => updateField("locationName", event.target.value)}
            className={fieldClassName}
            placeholder={sf.placeholders.locationName}
          />
        </div>

        <div className="space-y-2">
          <RequiredLabel htmlFor="address">{sf.fields.address}</RequiredLabel>
          <input
            id="address"
            value={form.address}
            onChange={(event) => updateField("address", event.target.value)}
            className={fieldClassName}
            placeholder={sf.placeholders.address}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <RequiredLabel htmlFor="city">{sf.fields.city}</RequiredLabel>
            <input
              id="city"
              value={form.city}
              onChange={(event) => updateField("city", event.target.value)}
              className={fieldClassName}
              placeholder={sf.placeholders.city}
            />
          </div>
          <div className="space-y-2">
            <RequiredLabel htmlFor="state">{sf.fields.state}</RequiredLabel>
            <select
              id="state"
              value={form.state}
              onChange={(event) => updateField("state", event.target.value)}
              className={fieldClassName}
            >
              <option value="">{sf.placeholders.selectState}</option>
              {US_STATES.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <RequiredLabel htmlFor="zipCode">{sf.fields.zipCode}</RequiredLabel>
            <input
              id="zipCode"
              value={form.zipCode}
              onChange={(event) => updateField("zipCode", event.target.value)}
              className={fieldClassName}
              placeholder={sf.placeholders.zipCode}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard number={4} title={sf.sections.payRequirements}>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <RequiredLabel htmlFor="hourlyRate">{sf.fields.payRate}</RequiredLabel>
            <input
              id="hourlyRate"
              type="number"
              min="0"
              step="0.01"
              value={form.hourlyRate}
              onChange={(event) => updateField("hourlyRate", event.target.value)}
              className={fieldClassName}
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <RequiredLabel htmlFor="currency">{sf.fields.currency}</RequiredLabel>
            <select
              id="currency"
              value={form.currency}
              onChange={(event) => updateField("currency", event.target.value)}
              className={fieldClassName}
            >
              <option value="USD">USD</option>
            </select>
          </div>
          <div className="space-y-2">
            <RequiredLabel>{sf.fields.openPositions}</RequiredLabel>
            <div className="inline-flex min-h-11 w-full items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-2">
              <button
                type="button"
                onClick={() => adjustPositions(-1)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-lg font-semibold text-fo-text transition hover:bg-white/[0.06]"
                aria-label={sf.actions.decreasePositions}
              >
                −
              </button>
              <span className="min-w-8 flex-1 text-center text-base font-semibold text-fo-text">
                {form.positionsNeeded}
              </span>
              <button
                type="button"
                onClick={() => adjustPositions(1)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-lg font-semibold text-fo-text transition hover:bg-white/[0.06]"
                aria-label={sf.actions.increasePositions}
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <RequiredLabel htmlFor="licenseRequirements">
              {sf.fields.licenseRequirements}
            </RequiredLabel>
            <p className="text-xs leading-relaxed text-fo-text-muted">
              {sf.hints.licenseRequirements}
            </p>
            <LicenseRequirementsPicker
              selected={form.licenseRequirements}
              onChange={(licenseRequirements) =>
                updateField("licenseRequirements", licenseRequirements)
              }
            />
          </div>

          <div className="space-y-2">
            <OptionalLabel htmlFor="certificationRequirements">
              {sf.fields.certifications}
            </OptionalLabel>
            <p className="text-xs leading-relaxed text-fo-text-muted">
              {sf.hints.certificationRequirements}
            </p>
            <RequirementsMultiSelectPicker
              options={POST_SHIFT_CERTIFICATION_OPTIONS}
              selected={form.certificationRequirements}
              onChange={(certificationRequirements) =>
                updateField("certificationRequirements", certificationRequirements)
              }
              allowCustom
              customLabel={sf.placeholders.customCertification}
              customPlaceholder={sf.placeholders.customCertificationPlaceholder}
            />
          </div>
        </div>

        <div className="space-y-2">
          <OptionalLabel htmlFor="otherRequirements">{sf.fields.otherRequirements}</OptionalLabel>
          <textarea
            id="otherRequirements"
            value={form.otherRequirements}
            onChange={(event) =>
              updateField("otherRequirements", event.target.value)
            }
            className={cn(fieldClassName, "min-h-24 resize-y")}
            placeholder={resolvedOtherRequirementsPlaceholder}
          />
        </div>
      </SectionCard>
    </div>
  );
}
