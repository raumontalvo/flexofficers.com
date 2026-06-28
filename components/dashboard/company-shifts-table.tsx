"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  filterSerializedShiftsByTab,
  type CompanyDashboardShiftTab,
  type SerializedCompanyShift,
} from "@/lib/company-dashboard-data";
import { formatShiftCityState, formatShiftDateRange } from "@/lib/format-shift";
import { Button, ShiftStatusBadge } from "@/components/ui";
import { cn } from "@/lib/cn";

const TABS: { id: CompanyDashboardShiftTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "open", label: "Open" },
  { id: "filled", label: "Filled" },
  { id: "past", label: "Past" },
  { id: "cancelled", label: "Cancelled" },
];

type CompanyShiftsTableProps = {
  shifts: SerializedCompanyShift[];
};

export function CompanyShiftsTable({ shifts }: CompanyShiftsTableProps) {
  const [activeTab, setActiveTab] = useState<CompanyDashboardShiftTab>("all");

  const filteredShifts = useMemo(() => {
    return filterSerializedShiftsByTab(shifts, activeTab);
  }, [activeTab, shifts]);

  return (
    <section className="fo-glass-card rounded-xl border border-white/10">
      <div className="border-b border-white/[0.06] px-4 py-3">
        <h2 className="text-base font-bold text-fo-text">My Shifts</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                activeTab === tab.id
                  ? "bg-fo-primary-bright/20 text-fo-primary-hover"
                  : "text-fo-text-muted hover:bg-white/[0.04] hover:text-fo-text"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-white/[0.06] bg-white/[0.02] text-xs uppercase tracking-wide text-fo-text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Shift</th>
              <th className="hidden px-4 py-3 font-semibold md:table-cell">
                Date &amp; Time
              </th>
              <th className="hidden px-4 py-3 font-semibold lg:table-cell">
                Location
              </th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="hidden px-4 py-3 font-semibold sm:table-cell">
                Applicants
              </th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredShifts.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-sm text-fo-text-muted"
                >
                  No shifts in this view yet.
                </td>
              </tr>
            ) : (
              filteredShifts.map((shift) => (
                <tr
                  key={shift.id}
                  className="border-b border-white/[0.04] transition hover:bg-white/[0.03]"
                >
                  <td className="px-4 py-3">
                    <p className="font-semibold text-fo-text">{shift.title}</p>
                    <p className="mt-0.5 text-xs text-fo-text-muted md:hidden">
                      {formatShiftDateRange(
                        new Date(shift.startTime),
                        new Date(shift.endTime)
                      )}
                    </p>
                  </td>
                  <td className="hidden px-4 py-3 text-fo-text-muted md:table-cell">
                    {formatShiftDateRange(
                      new Date(shift.startTime),
                      new Date(shift.endTime)
                    )}
                  </td>
                  <td className="hidden px-4 py-3 text-fo-text-muted lg:table-cell">
                    {formatShiftCityState(shift)}
                  </td>
                  <td className="px-4 py-3">
                    <ShiftStatusBadge status={shift.status} />
                  </td>
                  <td className="hidden px-4 py-3 text-fo-text-muted sm:table-cell">
                    {shift.applicantCount}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <Link href={`/shifts/${shift.id}`}>
                        <Button
                          type="button"
                          variant="secondary"
                          size="md"
                          className="min-h-8 px-2.5 text-xs"
                        >
                          View
                        </Button>
                      </Link>
                      <Link href={`/company/shifts/${shift.id}/edit`}>
                        <Button
                          type="button"
                          variant="secondary"
                          size="md"
                          className="min-h-8 px-2.5 text-xs"
                        >
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
