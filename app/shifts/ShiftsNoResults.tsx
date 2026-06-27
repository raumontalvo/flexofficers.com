import { Button } from "@/components/ui";
import { ShiftsIcon } from "@/components/nav/icons";

type ShiftsNoResultsProps = {
  onClearFilters: () => void;
  onViewAllOpenShifts: () => void;
};

export function ShiftsNoResults({
  onClearFilters,
  onViewAllOpenShifts,
}: ShiftsNoResultsProps) {
  return (
    <div className="fo-glass-card rounded-lg border border-white/10 px-4 py-8 text-center sm:px-6 sm:py-10">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-300">
        <ShiftsIcon className="h-6 w-6" />
      </div>

      <h2 className="text-lg font-bold text-fo-text">No Matching Shifts</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-fo-text-muted">
        We couldn&apos;t find any open shifts matching your search.
      </p>

      <div className="mt-6 flex flex-col justify-center gap-2.5 sm:flex-row">
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={onClearFilters}
          className="w-full sm:w-auto"
        >
          Clear Filters
        </Button>
        <Button
          type="button"
          size="md"
          onClick={onViewAllOpenShifts}
          className="w-full sm:w-auto"
        >
          View All Open Shifts
        </Button>
      </div>
    </div>
  );
}
