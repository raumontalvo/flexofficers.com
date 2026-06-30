"use client";

import { AddToStaffButton } from "@/components/company/add-to-staff-button";
import { buttonClassName } from "@/components/ui";
import type { OfficerInviteButtonState } from "@/lib/company-invite-workflow";
import type { SerializedOfficerSearchResult } from "@/lib/company-officers-page";
import { OfficerRosterCard } from "@/app/company/officers/OfficerRosterCard";

type StaffRosterCardProps = {
  officer: SerializedOfficerSearchResult;
  onViewProfile: () => void;
  onInvite: () => void;
  onRemoveFromStaff: () => void;
  inviteState: OfficerInviteButtonState;
};

export function StaffRosterCard({
  officer,
  onViewProfile,
  onInvite,
  onRemoveFromStaff,
  inviteState,
}: StaffRosterCardProps) {
  return (
    <OfficerRosterCard
      officer={officer}
      actions={
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onViewProfile}
            className={buttonClassName({
              variant: "secondary",
              size: "md",
              className:
                "min-h-10 flex-1 border-blue-500/30 px-4 text-sm text-blue-100 hover:bg-blue-500/10",
            })}
          >
            View Full Profile
          </button>
          {inviteState.kind === "invite" ? (
            <button
              type="button"
              onClick={onInvite}
              className={buttonClassName({
                size: "md",
                className: "min-h-10 flex-1 px-4 text-sm",
              })}
            >
              Invite to Shift
            </button>
          ) : (
            <div className="flex min-h-10 flex-1 items-center justify-center rounded-lg border border-amber-500/25 bg-amber-500/10 px-4 py-2 text-center">
              <div>
                <p className="text-sm font-semibold text-amber-100">
                  {inviteState.label}
                </p>
                {inviteState.kind === "pending" ? (
                  <p className="mt-0.5 text-xs text-amber-200/80">
                    Pending Response
                  </p>
                ) : null}
              </div>
            </div>
          )}
          <AddToStaffButton
            officerId={officer.id}
            isOnStaff
            onRemoved={onRemoveFromStaff}
            className="flex-1"
          />
        </div>
      }
    />
  );
}
