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
import {
  MobileListCard,
  MobileListCardActions,
  MobileListCardGroup,
  MobileSecondaryButton,
} from "@/components/ui/mobile";
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
        <div className="mt-3 overflow-x-auto">
          <div className="flex min-w-max flex-nowrap gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition",
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
      </div>

      {filteredShifts.length === 0 ? (
        <div className="px-4 py-10 text-center text-sm text-fo-text-muted">
          No shifts in this view yet.
        </div>
      ) : (
        <>
          <MobileListCardGroup className="md:hidden">
            {filteredShifts.map((shift) => (
              <MobileListCard key={shift.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-fo-text">{shift.title}</p>
                    <p className="mt-1 text-xs text-fo-text-muted">
                      {formatShiftDateRange(
                        new Date(shift.startTime),
                        new Date(shift.endTime)
                      )}
                    </p>
                    <p className="mt-1 text-xs text-fo-text-muted">
                      {formatShiftCityState(shift)}
                    </p>
                  </div>
                  <ShiftStatusBadge status={shift.status} />
                </div>

                <p className="text-sm text-fo-text-muted">
                  <span className="text-fo-text-muted">Applicants:</span>{" "}
                  <span className="font-medium text-fo-text">{shift.applicantCount}</span>
                </p>

                <MobileListCardActions>
                  <MobileSecondaryButton href={`/shifts/${shift.id}`}>
                    View
                  </MobileSecondaryButton>
                  <MobileSecondaryButton href={`/company/shifts/${shift.id}/edit`}>
                    Edit
                  </MobileSecondaryButton>
                </MobileListCardActions>
              </MobileListCard>
            ))}
          </MobileListCardGroup>

          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-white/[0.06] bg-white/[0.02] text-xs uppercase tracking-wide text-fo-text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Shift</th>
                  <th className="px-4 py-3 font-semibold">Date &amp; Time</th>
                  <th className="px-4 py-3 font-semibold">Location</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Applicants</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredShifts.map((shift) => (
                  <tr
                    key={shift.id}
                    className="border-b border-white/[0.04] transition hover:bg-white/[0.03]"
                  >
                    <td className="px-4 py-3">
                      <p className="font-semibold text-fo-text">{shift.title}</p>
                    </td>
                    <td className="px-4 py-3 text-fo-text-muted">
                      {formatShiftDateRange(
                        new Date(shift.startTime),
                        new Date(shift.endTime)
                      )}
                    </td>
                    <td className="px-4 py-3 text-fo-text-muted">
                      {formatShiftCityState(shift)}
                    </td>
                    <td className="px-4 py-3">
                      <ShiftStatusBadge status={shift.status} />
                    </td>
                    <td className="px-4 py-3 text-fo-text-muted">
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
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
