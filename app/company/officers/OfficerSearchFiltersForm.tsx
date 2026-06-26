import Link from "next/link";
import {
  AVAILABILITY_OPTIONS,
  CERTIFICATION_OPTIONS,
  EXPERIENCE_CATEGORIES,
} from "@/lib/profile-options";
import type { OfficerSearchFilters } from "@/lib/officer-search";
import { buttonClassName, Button, Card, CardDescription, CardTitle } from "@/components/ui";
import { cn } from "@/lib/cn";

const fieldClassName =
  "min-h-12 w-full rounded-fo-button border border-fo-border bg-fo-bg-elevated px-4 py-3 text-base text-fo-text focus:border-fo-primary-bright focus:outline-none focus:ring-2 focus:ring-fo-primary-bright/30";

function FieldLabel({
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

type OfficerSearchFiltersFormProps = {
  filters: OfficerSearchFilters;
};

export function OfficerSearchFiltersForm({
  filters,
}: OfficerSearchFiltersFormProps) {
  return (
    <Card variant="elevated" className="space-y-5">
      <div>
        <CardTitle className="text-lg">Filters</CardTitle>
        <CardDescription className="mt-1">
          Narrow results by location, experience, and qualifications.
        </CardDescription>
      </div>

      <form method="get" className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <FieldLabel htmlFor="city">City</FieldLabel>
          <input
            id="city"
            name="city"
            defaultValue={filters.city ?? ""}
            className={fieldClassName}
            placeholder="Search by city"
          />
        </div>

        <div className="space-y-2">
          <FieldLabel htmlFor="armedStatuses">Armed status</FieldLabel>
          <select
            id="armedStatuses"
            name="armedStatuses"
            defaultValue={filters.armedStatuses?.[0] ?? ""}
            className={fieldClassName}
          >
            <option value="">Any</option>
            <option value="ARMED">Armed</option>
            <option value="UNARMED">Unarmed</option>
          </select>
        </div>

        <div className="space-y-2">
          <FieldLabel htmlFor="minExperienceYears">Minimum experience</FieldLabel>
          <input
            id="minExperienceYears"
            type="number"
            min="0"
            name="minExperienceYears"
            defaultValue={
              typeof filters.minExperienceYears === "number"
                ? String(filters.minExperienceYears)
                : ""
            }
            className={fieldClassName}
            placeholder="Years"
          />
        </div>

        <div className="space-y-2">
          <FieldLabel htmlFor="certification">Certification</FieldLabel>
          <select
            id="certification"
            name="certification"
            defaultValue={filters.certification ?? ""}
            className={fieldClassName}
          >
            <option value="">Any</option>
            {CERTIFICATION_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <FieldLabel htmlFor="availability">Availability</FieldLabel>
          <select
            id="availability"
            name="availability"
            defaultValue={filters.availability ?? ""}
            className={fieldClassName}
          >
            <option value="">Any</option>
            {AVAILABILITY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <FieldLabel htmlFor="experienceCategory">Experience category</FieldLabel>
          <select
            id="experienceCategory"
            name="experienceCategory"
            defaultValue={filters.experienceCategory ?? ""}
            className={fieldClassName}
          >
            <option value="">Any</option>
            {EXPERIENCE_CATEGORIES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className={cn("grid gap-3 sm:col-span-2", "sm:grid-cols-2")}>
          <Button type="submit" fullWidth className="w-full">
            Apply Filters
          </Button>

          <Link
            href="/company/officers"
            className={buttonClassName({
              variant: "secondary",
              fullWidth: true,
              className: "w-full",
            })}
          >
            Clear Filters
          </Link>
        </div>
      </form>
    </Card>
  );
}
