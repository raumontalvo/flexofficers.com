"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MobileBottomSheet,
  MobilePrimaryButton,
  MobileSecondaryButton,
} from "@/components/ui/mobile";
import { cn } from "@/lib/cn";
import {
  OFFICER_AVAILABILITY_FILTER_OPTIONS,
  OFFICER_BACKGROUND_FILTER_OPTIONS,
  OFFICER_CERTIFICATION_FILTER_OPTIONS,
  OFFICER_LICENSE_FILTER_OPTIONS,
} from "@/lib/company-officers-page";
import type { OfficerSearchFilters } from "@/lib/officer-search";
import { buildOfficerSearchQuery } from "@/lib/officer-search-params";
import { US_STATES } from "@/lib/license-options";

const mobileFieldClassName =
  "min-h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-fo-text placeholder:text-fo-text-subtle focus:border-fo-primary-bright/50 focus:outline-none focus:ring-2 focus:ring-fo-primary-bright/20";

type OfficerFiltersSheetProps = {
  open: boolean;
  filters: OfficerSearchFilters;
  onClose: () => void;
};

type DraftFilters = {
  firstName: string;
  lastName: string;
  city: string;
  state: string;
  backgrounds: string[];
  licenseTypes: string[];
  certifications: string[];
  availabilities: string[];
};

function FilterLabel({ children, htmlFor }: { children: string; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-medium text-fo-text-muted">
      {children}
    </label>
  );
}

function toggleValue(values: string[], value: string) {
  return values.includes(value)
    ? values.filter((entry) => entry !== value)
    : [...values, value];
}

function toDraft(filters: OfficerSearchFilters): DraftFilters {
  return {
    firstName: filters.firstName ?? "",
    lastName: filters.lastName ?? "",
    city: filters.city ?? "",
    state: filters.state ?? "",
    backgrounds: [...(filters.backgrounds ?? [])],
    licenseTypes: [...(filters.licenseTypes ?? [])],
    certifications: [...(filters.certifications ?? [])],
    availabilities: [...(filters.availabilities ?? [])],
  };
}

function FilterCheckboxGroup({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: readonly string[];
  selected: string[];
  onChange: (values: string[]) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-fo-text-muted">
        {label}
      </p>
      <div className="grid gap-1.5">
        {options.map((option) => {
          const checked = selected.includes(option);

          return (
            <button
              key={option}
              type="button"
              aria-pressed={checked}
              onClick={() => onChange(toggleValue(selected, option))}
              className={cn(
                "rounded-lg border px-3 py-2 text-left text-xs font-medium transition",
                checked
                  ? "border-fo-primary-bright/40 bg-fo-primary/10 text-fo-primary-hover"
                  : "border-white/10 bg-white/[0.02] text-fo-text-muted hover:bg-white/[0.04] hover:text-fo-text"
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function OfficerFiltersSheet({
  open,
  filters,
  onClose,
}: OfficerFiltersSheetProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<DraftFilters>(() => toDraft(filters));

  useEffect(() => {
    if (open) {
      setDraft(toDraft(filters));
    }
  }, [open, filters]);

  function applyDraft() {
    const nextFilters: OfficerSearchFilters = {};

    if (draft.firstName.trim()) {
      nextFilters.firstName = draft.firstName.trim();
    }

    if (draft.lastName.trim()) {
      nextFilters.lastName = draft.lastName.trim();
    }

    if (draft.city.trim()) {
      nextFilters.city = draft.city.trim();
    }

    if (draft.state.trim()) {
      nextFilters.state = draft.state.trim();
    }

    if (draft.backgrounds.length > 0) {
      nextFilters.backgrounds = draft.backgrounds;
    }

    if (draft.licenseTypes.length > 0) {
      nextFilters.licenseTypes = draft.licenseTypes;
    }

    if (draft.certifications.length > 0) {
      nextFilters.certifications = draft.certifications;
    }

    if (draft.availabilities.length > 0) {
      nextFilters.availabilities = draft.availabilities;
    }

    const query = buildOfficerSearchQuery(nextFilters).toString();
    router.push(query ? `/company/officers?${query}` : "/company/officers");
    onClose();
  }

  function clearDraft() {
    router.push("/company/officers");
    onClose();
  }

  return (
    <MobileBottomSheet open={open} onClose={onClose} title="Filters">
      <div className="space-y-4 pb-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <FilterLabel htmlFor="filter-first-name">First name</FilterLabel>
            <input
              id="filter-first-name"
              value={draft.firstName}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  firstName: event.target.value,
                }))
              }
              className={mobileFieldClassName}
              placeholder="First name"
            />
          </div>
          <div className="space-y-1">
            <FilterLabel htmlFor="filter-last-name">Last name</FilterLabel>
            <input
              id="filter-last-name"
              value={draft.lastName}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  lastName: event.target.value,
                }))
              }
              className={mobileFieldClassName}
              placeholder="Last name"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <FilterLabel htmlFor="filter-city">City</FilterLabel>
            <input
              id="filter-city"
              value={draft.city}
              onChange={(event) =>
                setDraft((current) => ({ ...current, city: event.target.value }))
              }
              className={mobileFieldClassName}
              placeholder="City"
            />
          </div>
          <div className="space-y-1">
            <FilterLabel htmlFor="filter-state">State</FilterLabel>
            <input
              id="filter-state"
              list="mobile-officer-state-options"
              value={draft.state}
              onChange={(event) =>
                setDraft((current) => ({ ...current, state: event.target.value }))
              }
              className={mobileFieldClassName}
              placeholder="State"
            />
            <datalist id="mobile-officer-state-options">
              {US_STATES.map((state) => (
                <option key={state.code} value={state.name} />
              ))}
              {US_STATES.map((state) => (
                <option key={`${state.code}-code`} value={state.code} />
              ))}
            </datalist>
          </div>
        </div>

        <FilterCheckboxGroup
          label="Background"
          options={OFFICER_BACKGROUND_FILTER_OPTIONS}
          selected={draft.backgrounds}
          onChange={(backgrounds) =>
            setDraft((current) => ({ ...current, backgrounds }))
          }
        />

        <FilterCheckboxGroup
          label="License types"
          options={OFFICER_LICENSE_FILTER_OPTIONS}
          selected={draft.licenseTypes}
          onChange={(licenseTypes) =>
            setDraft((current) => ({ ...current, licenseTypes }))
          }
        />

        <FilterCheckboxGroup
          label="Certifications"
          options={OFFICER_CERTIFICATION_FILTER_OPTIONS}
          selected={draft.certifications}
          onChange={(certifications) =>
            setDraft((current) => ({ ...current, certifications }))
          }
        />

        <FilterCheckboxGroup
          label="Availability"
          options={OFFICER_AVAILABILITY_FILTER_OPTIONS}
          selected={draft.availabilities}
          onChange={(availabilities) =>
            setDraft((current) => ({ ...current, availabilities }))
          }
        />

        <div className="grid grid-cols-2 gap-2 pt-1">
          <MobileSecondaryButton onClick={clearDraft}>Clear</MobileSecondaryButton>
          <MobilePrimaryButton onClick={applyDraft}>Apply Filters</MobilePrimaryButton>
        </div>
      </div>
    </MobileBottomSheet>
  );
}
