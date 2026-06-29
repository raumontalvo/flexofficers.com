"use client";

import { useEffect, useState } from "react";
import {
  MobileBottomSheet,
  MobilePrimaryButton,
} from "@/components/ui/mobile";
import { cn } from "@/lib/cn";
import { US_STATES } from "@/lib/license-options";
import {
  emptyShiftBrowseFilters,
  hasMoreShiftFilters,
  type ShiftBrowseFilters,
  WORK_TYPE_OPTIONS,
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
    <MobileBottomSheet open={open} onClose={onClose} title="Search Shifts">
      <div className="space-y-2.5">
        <div className="grid grid-cols-1 gap-2 min-[400px]:grid-cols-2">
          <div className="space-y-1">
            <FilterLabel htmlFor="shift-sheet-city">City</FilterLabel>
            <input
              id="shift-sheet-city"
              value={draft.city}
              onChange={(e) => updateDraft("city", e.target.value)}
              className={mobileFieldClassName}
              placeholder="Enter city"
            />
          </div>
          <div className="space-y-1">
            <FilterLabel htmlFor="shift-sheet-state">State</FilterLabel>
            <select
              id="shift-sheet-state"
              value={draft.state}
              onChange={(e) => updateDraft("state", e.target.value)}
              className={mobileFieldClassName}
              aria-label="State"
            >
              <option value="">All States</option>
              {US_STATES.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <FilterLabel htmlFor="shift-sheet-date">Date</FilterLabel>
          <input
            id="shift-sheet-date"
            type="date"
            value={draft.date}
            onChange={(e) => updateDraft("date", e.target.value)}
            className={mobileFieldClassName}
          />
        </div>

        <div className="space-y-1">
          <FilterLabel htmlFor="shift-sheet-rate">Min Pay</FilterLabel>
          <input
            id="shift-sheet-rate"
            type="number"
            min="0"
            step="0.01"
            value={draft.minHourlyRate}
            onChange={(e) => updateDraft("minHourlyRate", e.target.value)}
            className={mobileFieldClassName}
            placeholder="Min $/hr"
          />
        </div>

        <div className="space-y-1">
          <FilterLabel htmlFor="shift-sheet-work-type">Work Type</FilterLabel>
          <select
            id="shift-sheet-work-type"
            value={draft.workType}
            onChange={(e) =>
              updateDraft("workType", e.target.value as ShiftBrowseFilters["workType"])
            }
            className={mobileFieldClassName}
          >
            {WORK_TYPE_OPTIONS.map((option) => (
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
          <span className="text-sm font-medium text-fo-text">More Filters</span>
          <span className="text-sm text-fo-text-subtle" aria-hidden="true">
            {showMoreFilters ? "▼" : "→"}
          </span>
        </button>

        {showMoreFilters ? (
          <div className="space-y-1.5 rounded-xl border border-white/10 bg-white/[0.02] p-2">
            <MoreFilterToggle
              label="Armed"
              checked={draft.armed}
              onChange={(armed) => updateDraft("armed", armed)}
            />
            <MoreFilterToggle
              label="Unarmed"
              checked={draft.unarmed}
              onChange={(unarmed) => updateDraft("unarmed", unarmed)}
            />
            <MoreFilterToggle
              label="Day Shift"
              checked={draft.dayShift}
              onChange={(dayShift) => updateDraft("dayShift", dayShift)}
            />
            <MoreFilterToggle
              label="Night Shift"
              checked={draft.nightShift}
              onChange={(nightShift) => updateDraft("nightShift", nightShift)}
            />
            <MoreFilterToggle
              label="Overnight"
              checked={draft.overnight}
              onChange={(overnight) => updateDraft("overnight", overnight)}
            />
          </div>
        ) : null}

        <div className="space-y-2 border-t border-white/[0.06] pt-4">
          <MobilePrimaryButton onClick={handleApply}>Apply Search</MobilePrimaryButton>
          <button
            type="button"
            onClick={handleClear}
            className="flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium text-fo-text-muted transition hover:bg-white/[0.04] hover:text-fo-text"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </MobileBottomSheet>
  );
}
