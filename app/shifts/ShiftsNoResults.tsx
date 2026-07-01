"use client";

import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { Button } from "@/components/ui";
import {
  MobilePrimaryButton,
  MobileSectionCard,
  MobileSettingsRow,
} from "@/components/ui/mobile";
import { ShiftsIcon } from "@/components/nav/icons";

type ShiftsNoResultsProps = {
  onClearFilters: () => void;
  onViewAllOpenShifts: () => void;
};

export function ShiftsNoResults({
  onClearFilters,
  onViewAllOpenShifts,
}: ShiftsNoResultsProps) {
  const { t } = useLandingLanguage();
  const copy = t.browse.shifts;

  return (
    <>
      <MobileSectionCard className="py-6 text-center md:hidden">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-300">
          <ShiftsIcon className="h-5 w-5" />
        </div>
        <h2 className="text-base font-bold text-fo-text">{copy.noMatch.title}</h2>
        <p className="mx-auto mt-1.5 max-w-md text-sm leading-relaxed text-fo-text-muted">
          {copy.noMatch.description}
        </p>
        <div className="mt-4 space-y-2">
          <MobilePrimaryButton onClick={onViewAllOpenShifts}>
            {copy.actions.viewOpenShifts}
          </MobilePrimaryButton>
          <MobileSettingsRow
            label={copy.actions.clearFilters}
            onClick={onClearFilters}
          />
        </div>
      </MobileSectionCard>

      <div className="fo-glass-card hidden rounded-lg border border-white/10 px-4 py-8 text-center sm:px-6 sm:py-10 md:block">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-300">
          <ShiftsIcon className="h-6 w-6" />
        </div>

        <h2 className="text-lg font-bold text-fo-text">{copy.noMatch.title}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-fo-text-muted">
          {copy.noMatch.description}
        </p>

        <div className="mt-6 flex flex-col justify-center gap-2.5 sm:flex-row">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onClearFilters}
            className="w-full sm:w-auto"
          >
            {copy.actions.clearFilters}
          </Button>
          <Button
            type="button"
            size="md"
            onClick={onViewAllOpenShifts}
            className="w-full sm:w-auto"
          >
            {copy.actions.viewAllOpen}
          </Button>
        </div>
      </div>
    </>
  );
}
