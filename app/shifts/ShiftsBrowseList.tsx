"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Card } from "@/components/ui";
import { cn } from "@/lib/cn";
import { US_STATES } from "@/lib/license-options";
import {
  clearPrimaryShiftFilters,
  emptyShiftBrowseFilters,
  filterBrowseShifts,
  formatOpenShiftCount,
  formatPaginationRange,
  sortBrowseShifts,
  SORT_OPTIONS,
  WORK_TYPE_OPTIONS,
  type ShiftBrowseFilters,
  type ShiftSortOption,
} from "@/lib/shift-browse-filters";
import type { ShiftCardData } from "@/lib/shift-card-data";
import { ShiftCard } from "./ShiftCard";
import { ShiftsNoResults } from "./ShiftsNoResults";

const PAGE_SIZE = 12;

const fieldClassName =
  "min-h-9 w-full rounded-lg border border-fo-border bg-fo-bg-elevated px-2.5 py-1.5 text-sm text-fo-text placeholder:text-fo-text-subtle focus:border-fo-primary-bright focus:outline-none focus:ring-2 focus:ring-fo-primary-bright/30";

function PrimaryFilterLabel({
  children,
  htmlFor,
}: {
  children: string;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-xs font-semibold tracking-tight text-fo-text"
    >
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
        "w-full rounded-md border px-2.5 py-1.5 text-left text-xs font-medium transition",
        checked
          ? "border-fo-primary-bright bg-fo-primary/15 text-fo-primary-hover"
          : "border-transparent bg-transparent text-fo-text-muted hover:bg-white/[0.04] hover:text-fo-text"
      )}
    >
      {label}
    </button>
  );
}

type ShiftsBrowseListProps = {
  shifts: ShiftCardData[];
};

function buildPageNumbers(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, currentPage]);

  if (currentPage > 1) pages.add(currentPage - 1);
  if (currentPage < totalPages) pages.add(currentPage + 1);

  return [...pages].sort((a, b) => a - b);
}

function hasMoreFiltersActive(filters: ShiftBrowseFilters) {
  return (
    filters.armed ||
    filters.unarmed ||
    filters.dayShift ||
    filters.nightShift ||
    filters.overnight
  );
}

export function ShiftsBrowseList({ shifts }: ShiftsBrowseListProps) {
  const listTopRef = useRef<HTMLDivElement>(null);
  const moreFiltersRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState<ShiftBrowseFilters>(emptyShiftBrowseFilters);
  const [sortBy, setSortBy] = useState<ShiftSortOption>("newest");
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!showMoreFilters) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (
        moreFiltersRef.current &&
        !moreFiltersRef.current.contains(event.target as Node)
      ) {
        setShowMoreFilters(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [showMoreFilters]);

  const filteredShifts = useMemo(
    () => sortBrowseShifts(filterBrowseShifts(shifts, filters), sortBy),
    [shifts, filters, sortBy]
  );

  const totalPages = Math.max(1, Math.ceil(filteredShifts.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const pageShifts = filteredShifts.slice(pageStart, pageStart + PAGE_SIZE);
  const rangeStart = filteredShifts.length === 0 ? 0 : pageStart + 1;
  const rangeEnd = Math.min(pageStart + PAGE_SIZE, filteredShifts.length);
  const pageNumbers = buildPageNumbers(safePage, totalPages);
  const resultsHeader = formatOpenShiftCount(filteredShifts.length);
  const paginationLabel = formatPaginationRange(
    rangeStart,
    rangeEnd,
    filteredShifts.length
  );
  const hasNoDatabaseShifts = shifts.length === 0;
  const hasNoMatchingShifts = !hasNoDatabaseShifts && filteredShifts.length === 0;

  function scrollToListTop() {
    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function updateFilters<K extends keyof ShiftBrowseFilters>(
    key: K,
    value: ShiftBrowseFilters[K]
  ) {
    setFilters((current) => ({ ...current, [key]: value }));
    setCurrentPage(1);
  }

  function handleViewAllOpenShifts() {
    setFilters(emptyShiftBrowseFilters);
    setSortBy("newest");
    setCurrentPage(1);
    setShowMoreFilters(false);
    scrollToListTop();
  }

  function handleClearFilters() {
    setFilters((current) => clearPrimaryShiftFilters(current));
    setCurrentPage(1);
    scrollToListTop();
  }

  function goToPage(page: number) {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
    scrollToListTop();
  }

  return (
    <div className="space-y-2">
      <div className="fo-glass-card rounded-lg border border-white/10 p-3">
        <div className="grid gap-3 md:grid-cols-6 lg:grid-cols-12">
          <div className="space-y-1.5 md:col-span-6 lg:col-span-5">
            <PrimaryFilterLabel>📍 Location</PrimaryFilterLabel>
            <div className="grid grid-cols-2 gap-2">
              <input
                id="shift-filter-city"
                value={filters.city}
                onChange={(e) => updateFilters("city", e.target.value)}
                className={fieldClassName}
                placeholder="Enter city"
              />
              <select
                id="shift-filter-state"
                value={filters.state}
                onChange={(e) => updateFilters("state", e.target.value)}
                className={fieldClassName}
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

          <div className="space-y-1.5 md:col-span-2 lg:col-span-2">
            <PrimaryFilterLabel htmlFor="shift-filter-date">📅 Date</PrimaryFilterLabel>
            <input
              id="shift-filter-date"
              type="date"
              value={filters.date}
              onChange={(e) => updateFilters("date", e.target.value)}
              className={fieldClassName}
            />
          </div>

          <div className="space-y-1.5 md:col-span-2 lg:col-span-2">
            <PrimaryFilterLabel htmlFor="shift-filter-rate">💵 Pay</PrimaryFilterLabel>
            <input
              id="shift-filter-rate"
              type="number"
              min="0"
              step="0.01"
              value={filters.minHourlyRate}
              onChange={(e) => updateFilters("minHourlyRate", e.target.value)}
              className={fieldClassName}
              placeholder="Min $/hr"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2 lg:col-span-3">
            <PrimaryFilterLabel htmlFor="shift-filter-work-type">
              💼 Work Type
            </PrimaryFilterLabel>
            <select
              id="shift-filter-work-type"
              value={filters.workType}
              onChange={(e) =>
                updateFilters(
                  "workType",
                  e.target.value as ShiftBrowseFilters["workType"]
                )
              }
              className={fieldClassName}
            >
              {WORK_TYPE_OPTIONS.map((option) => (
                <option key={option.value || "all"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-2 border-t border-white/[0.06] pt-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative" ref={moreFiltersRef}>
            <button
              type="button"
              aria-expanded={showMoreFilters}
              aria-haspopup="true"
              onClick={() => setShowMoreFilters((open) => !open)}
              className={cn(
                "inline-flex min-h-9 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition",
                showMoreFilters || hasMoreFiltersActive(filters)
                  ? "border-fo-primary-bright/50 bg-fo-primary/10 text-fo-primary-bright"
                  : "border-fo-border bg-fo-bg-elevated text-fo-text hover:border-fo-border-strong hover:text-fo-text"
              )}
            >
              <span aria-hidden>⚙</span>
              <span>More Filters</span>
              <span aria-hidden className="text-[10px] text-fo-text-muted">
                {showMoreFilters ? "▲" : "▼"}
              </span>
              {hasMoreFiltersActive(filters) ? (
                <span className="ml-0.5 rounded-full bg-fo-primary/25 px-1.5 py-0.5 text-[10px] font-semibold text-fo-primary-bright">
                  Active
                </span>
              ) : null}
            </button>

            {showMoreFilters ? (
              <div
                role="menu"
                className="absolute left-0 top-full z-20 mt-1.5 w-52 rounded-lg border border-white/10 bg-fo-bg-elevated p-2 shadow-xl shadow-black/30"
              >
                <div className="flex flex-col gap-1">
                  <MoreFilterToggle
                    label="Armed"
                    checked={filters.armed}
                    onChange={(armed) => updateFilters("armed", armed)}
                  />
                  <MoreFilterToggle
                    label="Unarmed"
                    checked={filters.unarmed}
                    onChange={(unarmed) => updateFilters("unarmed", unarmed)}
                  />
                  <MoreFilterToggle
                    label="Day Shift"
                    checked={filters.dayShift}
                    onChange={(dayShift) => updateFilters("dayShift", dayShift)}
                  />
                  <MoreFilterToggle
                    label="Night Shift"
                    checked={filters.nightShift}
                    onChange={(nightShift) => updateFilters("nightShift", nightShift)}
                  />
                  <MoreFilterToggle
                    label="Overnight"
                    checked={filters.overnight}
                    onChange={(overnight) => updateFilters("overnight", overnight)}
                  />
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handleClearFilters}
              className="!min-h-9 w-full sm:w-auto"
            >
              Clear Filters
            </Button>
            <Button
              type="button"
              size="md"
              onClick={handleViewAllOpenShifts}
              className="!min-h-9 w-full sm:w-auto"
            >
              View All Open Shifts
            </Button>
          </div>
        </div>
      </div>

      <div ref={listTopRef} className="scroll-mt-4 space-y-2">
        {!hasNoDatabaseShifts ? (
          <div className="flex flex-col gap-2 px-0.5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-fo-text">{resultsHeader}</p>
            <div className="flex items-center gap-2">
              <label htmlFor="shift-sort-by" className="text-xs text-fo-text-muted">
                Sort by
              </label>
              <select
                id="shift-sort-by"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as ShiftSortOption);
                  setCurrentPage(1);
                }}
                className={cn(fieldClassName, "w-auto min-w-[148px]")}
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : null}

        {hasNoDatabaseShifts ? (
          <Card variant="muted" className="py-8 text-center">
            <p className="text-base font-medium text-fo-text">
              No shifts posted yet.
            </p>
            <p className="mt-1 text-sm text-fo-text-muted">
              Check back soon for new security opportunities.
            </p>
          </Card>
        ) : hasNoMatchingShifts ? (
          <ShiftsNoResults
            onClearFilters={handleClearFilters}
            onViewAllOpenShifts={handleViewAllOpenShifts}
          />
        ) : (
          <div className="space-y-1">
            {pageShifts.map((shift) => (
              <ShiftCard key={shift.id} shift={shift} />
            ))}
          </div>
        )}
      </div>

      {filteredShifts.length > 0 ? (
        <div className="fo-glass-card flex flex-col gap-3 rounded-lg border border-white/10 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-fo-text-muted">{paginationLabel}</p>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => goToPage(safePage - 1)}
              disabled={safePage <= 1}
              className={cn(
                "rounded-md border border-fo-border px-2.5 py-1 text-xs font-medium text-fo-text-muted transition",
                safePage > 1 && "hover:border-fo-border-strong hover:text-fo-text",
                safePage <= 1 && "cursor-not-allowed opacity-40"
              )}
            >
              Previous
            </button>

            {pageNumbers.map((page, index) => {
              const prev = pageNumbers[index - 1];
              const showEllipsis = prev !== undefined && page - prev > 1;

              return (
                <span key={page} className="flex items-center gap-1.5">
                  {showEllipsis ? (
                    <span className="px-1 text-xs text-fo-text-subtle">…</span>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => goToPage(page)}
                    className={cn(
                      "min-w-8 rounded-md border px-2 py-1 text-xs font-medium transition",
                      page === safePage
                        ? "border-fo-primary-bright bg-fo-primary/15 text-fo-primary-bright"
                        : "border-fo-border text-fo-text-muted hover:border-fo-border-strong hover:text-fo-text"
                    )}
                  >
                    {page}
                  </button>
                </span>
              );
            })}

            <button
              type="button"
              onClick={() => goToPage(safePage + 1)}
              disabled={safePage >= totalPages}
              className={cn(
                "rounded-md border border-fo-border px-2.5 py-1 text-xs font-medium text-fo-text-muted transition",
                safePage < totalPages &&
                  "hover:border-fo-border-strong hover:text-fo-text",
                safePage >= totalPages && "cursor-not-allowed opacity-40"
              )}
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
