"use client";

import {
  POST_SHIFT_CERTIFICATION_OPTIONS,
  type PostShiftFormValues,
} from "@/lib/shift-create-form";
import { US_STATES } from "@/lib/license-options";
import { SHIFT_WORK_TYPE_OPTIONS } from "@/lib/shift-form-options";
import { LicenseRequirementsPicker } from "@/components/shifts/license-requirements-picker";
import { RequirementsMultiSelectPicker } from "@/components/shifts/requirements-multi-select-picker";
import { cn } from "@/lib/cn";

const fieldClassName =
  "min-h-11 w-full rounded-lg border border-fo-border bg-fo-bg/80 px-3 py-2.5 text-sm text-fo-text placeholder:text-fo-text-subtle focus:border-fo-primary-bright/50 focus:outline-none focus:ring-2 focus:ring-fo-primary-bright/20";

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

function SectionCard({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="fo-glass-card rounded-xl border border-white/10 p-4 sm:p-5">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-200">
          {number}
        </span>
        <h2 className="text-base font-semibold text-fo-text">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
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
  otherRequirementsPlaceholder = "e.g. 2+ years experience, customer service, etc.",
}: PostShiftFormProps) {
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
      <SectionCard number={1} title="Shift Details">
        <div className="space-y-2">
          <RequiredLabel htmlFor="title">Shift Title</RequiredLabel>
          <input
            id="title"
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
            className={fieldClassName}
            placeholder="e.g. Mall Security Officer"
          />
        </div>

        <div className="space-y-2">
          <RequiredLabel htmlFor="workType">Type of Post</RequiredLabel>
          <select
            id="workType"
            value={form.workType}
            onChange={(event) => updateField("workType", event.target.value)}
            className={fieldClassName}
          >
            <option value="">Select type of post</option>
            {SHIFT_WORK_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <OptionalLabel htmlFor="description">Description</OptionalLabel>
          <textarea
            id="description"
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            className={cn(fieldClassName, "min-h-28 resize-y")}
            placeholder="Add any important details about the shift, duties, or requirements..."
          />
        </div>

        <p className="text-xs leading-relaxed text-fo-text-muted">
          A clear title helps officers know what to expect. Include parking
          info, dress code, specific instructions, etc.
        </p>
      </SectionCard>

      <SectionCard number={2} title="Date & Time">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <RequiredLabel htmlFor="startDate">Start Date</RequiredLabel>
            <input
              id="startDate"
              type="date"
              value={form.startDate}
              onChange={(event) => updateField("startDate", event.target.value)}
              className={fieldClassName}
            />
          </div>
          <div className="space-y-2">
            <RequiredLabel htmlFor="startTime">Start Time</RequiredLabel>
            <input
              id="startTime"
              type="time"
              value={form.startTime}
              onChange={(event) => updateField("startTime", event.target.value)}
              className={fieldClassName}
            />
          </div>
          <div className="space-y-2">
            <RequiredLabel htmlFor="endTime">End Time</RequiredLabel>
            <input
              id="endTime"
              type="time"
              value={form.endTime}
              onChange={(event) => updateField("endTime", event.target.value)}
              className={fieldClassName}
            />
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
          <label className="flex items-start gap-3 opacity-60">
            <input type="checkbox" disabled className="mt-1 rounded border-fo-border" />
            <span>
              <span className="block text-sm font-medium text-fo-text">
                Recurring Shift
              </span>
              <span className="mt-0.5 block text-xs text-fo-text-muted">
                This shift repeats on specific days. Coming soon.
              </span>
            </span>
          </label>
        </div>
      </SectionCard>

      <SectionCard number={3} title="Location">
        <div className="space-y-2">
          <RequiredLabel htmlFor="locationName">Location Name</RequiredLabel>
          <input
            id="locationName"
            value={form.locationName}
            onChange={(event) => updateField("locationName", event.target.value)}
            className={fieldClassName}
            placeholder="e.g. Gulf Coast Town Center"
          />
        </div>

        <div className="space-y-2">
          <RequiredLabel htmlFor="address">Address</RequiredLabel>
          <input
            id="address"
            value={form.address}
            onChange={(event) => updateField("address", event.target.value)}
            className={fieldClassName}
            placeholder="Street address"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <RequiredLabel htmlFor="city">City</RequiredLabel>
            <input
              id="city"
              value={form.city}
              onChange={(event) => updateField("city", event.target.value)}
              className={fieldClassName}
              placeholder="City"
            />
          </div>
          <div className="space-y-2">
            <RequiredLabel htmlFor="state">State</RequiredLabel>
            <select
              id="state"
              value={form.state}
              onChange={(event) => updateField("state", event.target.value)}
              className={fieldClassName}
            >
              <option value="">Select state</option>
              {US_STATES.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <RequiredLabel htmlFor="zipCode">Zip Code</RequiredLabel>
            <input
              id="zipCode"
              value={form.zipCode}
              onChange={(event) => updateField("zipCode", event.target.value)}
              className={fieldClassName}
              placeholder="Zip code"
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard number={4} title="Pay & Requirements">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <RequiredLabel htmlFor="hourlyRate">Pay Rate</RequiredLabel>
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
            <RequiredLabel htmlFor="currency">Currency</RequiredLabel>
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
            <RequiredLabel>Open Positions</RequiredLabel>
            <div className="inline-flex min-h-11 w-full items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-2">
              <button
                type="button"
                onClick={() => adjustPositions(-1)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-lg font-semibold text-fo-text transition hover:bg-white/[0.06]"
                aria-label="Decrease open positions"
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
                aria-label="Increase open positions"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <RequiredLabel htmlFor="licenseRequirements">
              License Requirements
            </RequiredLabel>
            <p className="text-xs leading-relaxed text-fo-text-muted">
              Select one or more license types required for this shift.
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
              Certifications
            </OptionalLabel>
            <p className="text-xs leading-relaxed text-fo-text-muted">
              Select one or more certifications required for this shift.
            </p>
            <RequirementsMultiSelectPicker
              options={POST_SHIFT_CERTIFICATION_OPTIONS}
              selected={form.certificationRequirements}
              onChange={(certificationRequirements) =>
                updateField("certificationRequirements", certificationRequirements)
              }
              allowCustom
              customLabel="Add a custom certification"
              customPlaceholder="e.g. De-escalation Training"
            />
          </div>
        </div>

        <div className="space-y-2">
          <OptionalLabel htmlFor="otherRequirements">Other Requirements</OptionalLabel>
          <textarea
            id="otherRequirements"
            value={form.otherRequirements}
            onChange={(event) =>
              updateField("otherRequirements", event.target.value)
            }
            className={cn(fieldClassName, "min-h-24 resize-y")}
            placeholder={otherRequirementsPlaceholder}
          />
        </div>
      </SectionCard>
    </div>
  );
}
