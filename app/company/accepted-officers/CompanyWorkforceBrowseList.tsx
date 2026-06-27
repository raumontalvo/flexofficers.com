"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button, Card } from "@/components/ui";
import { ShiftWorkforceGroup } from "@/components/company/shift-workforce-group";
import { getHiddenCompanyWorkforceIds } from "@/components/company/remove-from-company-list-button";
import {
  filterWorkforceGroups,
  getWorkforceShiftTiming,
  type CompanyShiftWorkforceGroup,
  type WorkforceShiftFilter,
} from "@/lib/company-workforce-data";

const fieldClassName =
  "min-h-9 w-full rounded-lg border border-fo-border bg-fo-bg-elevated px-2.5 py-1.5 text-sm text-fo-text placeholder:text-fo-text-subtle focus:border-fo-primary-bright focus:outline-none focus:ring-2 focus:ring-fo-primary-bright/30";

type CompanyWorkforceBrowseListProps = {
  groups: CompanyShiftWorkforceGroup[];
  mode: "accepted" | "completed";
};

export function CompanyWorkforceBrowseList({
  groups,
  mode,
}: CompanyWorkforceBrowseListProps) {
  const [shiftFilter, setShiftFilter] = useState<WorkforceShiftFilter>("");
  const [officerSearch, setOfficerSearch] = useState("");
  const [hiddenVersion, setHiddenVersion] = useState(0);

  const visibleGroups = useMemo(() => {
    const hidden = new Set(getHiddenCompanyWorkforceIds());

    return groups
      .map((group) => ({
        ...group,
        officers: group.officers.filter(
          (officer) => !hidden.has(officer.applicationId)
        ),
        filledCount: group.officers.filter(
          (officer) => !hidden.has(officer.applicationId)
        ).length,
      }))
      .filter((group) => group.officers.length > 0);
  }, [groups, hiddenVersion]);

  const filteredAcceptedGroups = useMemo(
    () => filterWorkforceGroups(visibleGroups, shiftFilter, officerSearch),
    [visibleGroups, shiftFilter, officerSearch]
  );

  const completedGroups = useMemo(() => {
    const filtered = filterWorkforceGroups(visibleGroups, "completed", officerSearch);
    return filtered.filter(
      (group) =>
        getWorkforceShiftTiming(group.shift.status, group.shift.endTime) ===
        "completed"
    );
  }, [visibleGroups, officerSearch]);

  const cancelledGroups = useMemo(() => {
    const filtered = filterWorkforceGroups(visibleGroups, "", officerSearch);
    return filtered.filter(
      (group) =>
        getWorkforceShiftTiming(group.shift.status, group.shift.endTime) ===
        "cancelled"
    );
  }, [visibleGroups, officerSearch]);

  const hasAnyOfficers = visibleGroups.some((group) => group.officers.length > 0);

  function handleHidden() {
    setHiddenVersion((version) => version + 1);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-fo-text sm:text-4xl">
            {mode === "accepted" ? "Accepted Officers" : "Completed Shifts"}
          </h1>
          <p className="max-w-2xl text-base text-fo-text-muted sm:text-lg">
            {mode === "accepted"
              ? "Manage officers confirmed for your upcoming shifts."
              : "Review completed assignments and cancelled shift history."}
          </p>
        </div>

        {mode === "accepted" ? (
          <div className="w-full space-y-1 sm:w-[200px] sm:shrink-0">
            <label htmlFor="workforce-shift-filter" className="text-xs text-fo-text-muted">
              Filter by shift
            </label>
            <select
              id="workforce-shift-filter"
              value={shiftFilter}
              onChange={(e) =>
                setShiftFilter(e.target.value as WorkforceShiftFilter)
              }
              className={fieldClassName}
            >
              <option value="">All Shifts</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        ) : null}
      </div>

      <div className="space-y-1">
        <label htmlFor="workforce-officer-search" className="text-xs text-fo-text-muted">
          Search by officer name
        </label>
        <input
          id="workforce-officer-search"
          value={officerSearch}
          onChange={(e) => setOfficerSearch(e.target.value)}
          className={fieldClassName}
          placeholder="Officer name"
        />
      </div>

      {mode === "accepted" && !hasAnyOfficers ? (
        <Card variant="muted" className="py-10 text-center">
          <p className="text-lg font-semibold text-fo-text">
            You do not have any accepted officers yet.
          </p>
          <p className="mt-2 text-sm text-fo-text-muted">
            When you accept applicants, they will appear here grouped by shift.
          </p>
          <Link href="/company/applications" className="mt-6 inline-block">
            <Button type="button" size="md">
              Review Applicants
            </Button>
          </Link>
        </Card>
      ) : null}

      {mode === "accepted" && hasAnyOfficers && filteredAcceptedGroups.length === 0 ? (
        <Card variant="muted" className="py-8 text-center">
          <p className="text-base font-medium text-fo-text">
            No officers match your filters.
          </p>
        </Card>
      ) : null}

      {mode === "accepted" && filteredAcceptedGroups.length > 0 ? (
        <div className="space-y-4">
          {filteredAcceptedGroups.map((group) => (
            <ShiftWorkforceGroup key={group.shift.id} group={group} showRemove />
          ))}
        </div>
      ) : null}

      {mode === "completed" && completedGroups.length === 0 && cancelledGroups.length === 0 ? (
        <Card variant="muted" className="py-10 text-center">
          <p className="text-lg font-semibold text-fo-text">
            You have not completed any shifts yet.
          </p>
        </Card>
      ) : null}

      {mode === "completed" && completedGroups.length > 0 ? (
        <div className="space-y-4">
          {completedGroups.map((group) => (
            <ShiftWorkforceGroup
              key={group.shift.id}
              group={group}
              showRemove={false}
            />
          ))}
        </div>
      ) : null}

      {mode === "completed" ? (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-fo-text-muted">
            Cancelled
          </h2>
          {cancelledGroups.length > 0 ? (
            cancelledGroups.map((group) => (
              <ShiftWorkforceGroup
                key={group.shift.id}
                group={group}
                showRemove={false}
                showHideFromList
                cancelled
                onHidden={handleHidden}
              />
            ))
          ) : (
            <Card variant="muted" className="py-6 text-center">
              <p className="text-sm text-fo-text-muted">
                You have no cancelled assignments.
              </p>
            </Card>
          )}
        </div>
      ) : null}
    </div>
  );
}
