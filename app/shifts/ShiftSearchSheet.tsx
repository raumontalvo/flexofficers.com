"use client";

import { useEffect, useState } from "react";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import {
  MobileBottomSheet,
  MobilePrimaryButton,
} from "@/components/ui/mobile";
import { cn } from "@/lib/cn";
import {
  getDateLocale,
  getShiftWorkTypeOptions,
} from "@/lib/i18n/ui-labels";
import { US_STATES } from "@/lib/license-options";
import {
  emptyShiftBrowseFilters,
  hasMoreShiftFilters,
  type ShiftBrowseFilters,
} from "@/lib/shift-browse-filters";

const mobileFieldClassName =
  "min-h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-fo-text placeholder:text-fo-text-subtle focus:border-fo-primary-bright/50 focus:outline-none focus:ring-2 focus:ring-fo-primary-bright/20";

function FilterLabel({ children, htmlFor }: { children: string; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-medium text-fo-text-muted">
      {children}
    </label>
  );
}

function MoreFilterToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "w-full rounded-lg border px-3 py-2 text-left text-xs font-medium transition",
        checked
          ? "border-fo-primary-bright/40 bg-fo-primary/10 text-fo-primary-hover"
          : "border-white/10 bg-white/[0.02] text-fo-text-muted hover:bg-white/[0.04] hover:text-fo-text"
      )}
    >
      {label}
    </button>
  );
}

type ShiftSearchSheetProps = {
  open: boolean;
  filters: ShiftBrowseFilters;
  onClose: () => void;
  onApply: (filters: ShiftBrowseFilters) => void;
};

export function ShiftSearchSheet({
  open,
  filters,
  onClose,
  onApply,
}: ShiftSearchSheetProps) {
  const { t, language } = useLandingLanguage();
  const shiftFilters = t.filters.shifts;
  const shiftOptions = t.filters.shiftOptions;
  const workTypeOptions = getShiftWorkTypeOptions(t);
  const [draft, setDraft] = useState<ShiftBrowseFilters>(filters);
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  useEffect(() => {
    if (open) {
      setDraft(filters);
      setShowMoreFilters(hasMoreShiftFilters(filters));
    }
  }, [open, filters]);

  function updateDraft<K extends keyof ShiftBrowseFilters>(
    key: K,
    value: ShiftBrowseFilters[K]
  ) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function handleApply() {
    onApply(draft);
    onClose();
  }

  function handleClear() {
    const cleared = { ...emptyShiftBrowseFilters };
    setDraft(cleared);
    onApply(cleared);
    onClose();
  }

  return (
    <MobileBottomSheet open={open} onClose={onClose} title={t.browse.shifts.searchTitle}>
      <div className="space-y-2.5">
        <div className="grid grid-cols-1 gap-2 min-[400px]:grid-cols-2">
          <div className="space-y-1">
            <FilterLabel htmlFor="shift-sheet-city">{shiftFilters.city}</FilterLabel>
            <input
              id="shift-sheet-city"
              value={draft.city}
              onChange={(e) => updateDraft("city", e.target.value)}
              className={mobileFieldClassName}
              placeholder={shiftFilters.enterCity}
            />
          </div>
          <div className="space-y-1">
            <FilterLabel htmlFor="shift-sheet-state">{shiftFilters.state}</FilterLabel>
            <select
              id="shift-sheet-state"
              value={draft.state}
              onChange={(e) => updateDraft("state", e.target.value)}
              className={mobileFieldClassName}
              aria-label={shiftFilters.state}
            >
              <option value="">{shiftFilters.allStates}</option>
              {US_STATES.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <FilterLabel htmlFor="shift-sheet-date">{shiftFilters.date}</FilterLabel>
          <input
            id="shift-sheet-date"
            type="date"
            value={draft.date}
            onChange={(e) => updateDraft("date", e.target.value)}
            className={mobileFieldClassName}
            lang={getDateLocale(language)}
          />
        </div>

        <div className="space-y-1">
          <FilterLabel htmlFor="shift-sheet-rate">{shiftFilters.minPay}</FilterLabel>
          <input
            id="shift-sheet-rate"
            type="number"
            min="0"
            step="0.01"
            value={draft.minHourlyRate}
            onChange={(e) => updateDraft("minHourlyRate", e.target.value)}
            className={mobileFieldClassName}
            placeholder={shiftFilters.minPay}
          />
        </div>

        <div className="space-y-1">
          <FilterLabel htmlFor="shift-sheet-work-type">{shiftFilters.workType}</FilterLabel>
          <select
            id="shift-sheet-work-type"
            value={draft.workType}
            onChange={(e) =>
              updateDraft("workType", e.target.value as ShiftBrowseFilters["workType"])
            }
            className={mobileFieldClassName}
          >
            {workTypeOptions.map((option) => (
              <option key={option.value || "all"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={() => setShowMoreFilters((open) => !open)}
          className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left transition hover:bg-white/[0.05]"
        >
          <span className="text-sm font-medium text-fo-text">{shiftFilters.moreFilters}</span>
          <span className="text-sm text-fo-text-subtle" aria-hidden="true">
            {showMoreFilters ? "▼" : "→"}
          </span>
        </button>

        {showMoreFilters ? (
          <div className="space-y-1.5 rounded-xl border border-white/10 bg-white/[0.02] p-2">
            <MoreFilterToggle
              label={shiftOptions.armed}
              checked={draft.armed}
              onChange={(armed) => updateDraft("armed", armed)}
            />
            <MoreFilterToggle
              label={shiftOptions.unarmed}
              checked={draft.unarmed}
              onChange={(unarmed) => updateDraft("unarmed", unarmed)}
            />
            <MoreFilterToggle
              label={shiftOptions.dayShift}
              checked={draft.dayShift}
              onChange={(dayShift) => updateDraft("dayShift", dayShift)}
            />
            <MoreFilterToggle
              label={shiftOptions.nightShift}
              checked={draft.nightShift}
              onChange={(nightShift) => updateDraft("nightShift", nightShift)}
            />
            <MoreFilterToggle
              label={shiftOptions.overnight}
              checked={draft.overnight}
              onChange={(overnight) => updateDraft("overnight", overnight)}
            />
          </div>
        ) : null}

        <div className="space-y-2 border-t border-white/[0.06] pt-4">
          <MobilePrimaryButton onClick={handleApply}>
            {shiftFilters.applySearch}
          </MobilePrimaryButton>
          <button
            type="button"
            onClick={handleClear}
            className="flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium text-fo-text-muted transition hover:bg-white/[0.04] hover:text-fo-text"
          >
            {shiftFilters.clearFilters}
          </button>
        </div>
      </div>
    </MobileBottomSheet>
  );
}
