"use client";

import { useMemo, useState } from "react";
import { OfficerProfilePanel } from "@/components/company/officer-profile-panel";
import { officerProfileNameLabel } from "@/components/company/officer-profile-name";
import { InviteOfficerModal } from "@/components/company/invite-officer-modal";
import type { CompanyOpenShiftOption } from "@/components/company/invite-officer-to-shift";
import { AddToStaffButton } from "@/components/company/add-to-staff-button";
import {
  getOfficerInviteButtonState,
  type CompanyOfficerInviteRecord,
} from "@/lib/company-invite-workflow";
import { buttonClassName } from "@/components/ui";
import {
  searchCompanyStaff,
  type SerializedCompanyStaffMember,
} from "@/lib/company-staff";
import { OfficerSearchCard } from "@/app/company/officers/OfficerSearchCard";
import { OfficerSearchMobileCard } from "@/app/company/officers/OfficerSearchMobileCard";

type CompanyStaffBrowseListProps = {
  staff: SerializedCompanyStaffMember[];
  openShifts: CompanyOpenShiftOption[];
  invites: CompanyOfficerInviteRecord[];
};

function StaffDesktopCard({
  member,
  onViewProfile,
  onInvite,
  onRemoveFromStaff,
  inviteState,
}: {
  member: SerializedCompanyStaffMember;
  onViewProfile: () => void;
  onInvite: () => void;
  onRemoveFromStaff: () => void;
  inviteState: ReturnType<typeof getOfficerInviteButtonState>;
}) {
  return (
    <OfficerSearchCard
      officer={member.officer}
      actions={
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap">
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
            officerId={member.officerId}
            isOnStaff
            onRemoved={onRemoveFromStaff}
            className="flex-1"
          />
        </div>
      }
    />
  );
}

export function CompanyStaffBrowseList({
  staff: initialStaff,
  openShifts,
  invites: initialInvites,
}: CompanyStaffBrowseListProps) {
  const [staff, setStaff] = useState(initialStaff);
  const [invites, setInvites] = useState(initialInvites);
  const [profileOfficerId, setProfileOfficerId] = useState<string | null>(null);
  const [inviteOfficerId, setInviteOfficerId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const openShiftIds = openShifts.map((shift) => shift.id);

  const filteredStaff = useMemo(
    () => searchCompanyStaff(staff, searchQuery),
    [staff, searchQuery]
  );

  const profileOfficer = useMemo(
    () => staff.find((member) => member.officerId === profileOfficerId)?.officer ?? null,
    [staff, profileOfficerId]
  );

  const inviteOfficer = useMemo(
    () => staff.find((member) => member.officerId === inviteOfficerId)?.officer ?? null,
    [staff, inviteOfficerId]
  );

  function handleRemoveFromStaff(officerId: string) {
    setStaff((current) =>
      current.filter((member) => member.officerId !== officerId)
    );
  }

  if (staff.length === 0) {
    return (
      <section className="fo-glass-card mt-4 rounded-xl border border-white/10 px-4 py-12 text-center lg:mt-6">
        <h2 className="text-lg font-semibold text-fo-text">No staff yet.</h2>
        <p className="mt-2 text-sm text-fo-text-muted">
          Search officers and use Add to Staff to build your private roster for
          staff-only shift posts.
        </p>
      </section>
    );
  }

  return (
    <div className="mt-4 space-y-3 lg:mt-6 lg:space-y-4">
      <label className="block">
        <span className="sr-only">Search your staff by name</span>
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search your staff by name"
          className="min-h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-fo-text placeholder:text-fo-text-subtle focus:border-fo-primary-bright/50 focus:outline-none focus:ring-2 focus:ring-fo-primary-bright/20 lg:min-h-10 lg:rounded-lg lg:border-fo-border lg:bg-fo-bg/80"
        />
      </label>

      <p className="text-sm font-medium text-fo-text">
        {filteredStaff.length} of {staff.length} officer
        {staff.length === 1 ? "" : "s"} on your staff
      </p>

      {filteredStaff.length === 0 ? (
        <section className="fo-glass-card rounded-xl border border-white/10 px-4 py-10 text-center">
          <h2 className="text-base font-semibold text-fo-text">No staff found.</h2>
          <p className="mt-2 text-sm text-fo-text-muted">
            Try another name from your staff roster.
          </p>
        </section>
      ) : (
        <>
      <div className="space-y-3 lg:hidden">
        {filteredStaff.map((member) => (
          <OfficerSearchMobileCard
            key={member.id}
            officer={member.officer}
            onViewProfile={() => setProfileOfficerId(member.officerId)}
            onInvite={() => setInviteOfficerId(member.officerId)}
            inviteState={getOfficerInviteButtonState(
              member.officerId,
              invites,
              openShiftIds
            )}
            inviteLabel="Invite to Shift"
          />
        ))}
      </div>

      <div className="hidden space-y-4 lg:block">
        {filteredStaff.map((member) => (
          <StaffDesktopCard
            key={member.id}
            member={member}
            onViewProfile={() => setProfileOfficerId(member.officerId)}
            onInvite={() => setInviteOfficerId(member.officerId)}
            onRemoveFromStaff={() => handleRemoveFromStaff(member.officerId)}
            inviteState={getOfficerInviteButtonState(
              member.officerId,
              invites,
              openShiftIds
            )}
          />
        ))}
      </div>
        </>
      )}

      <OfficerProfilePanel
        officer={profileOfficer}
        onClose={() => setProfileOfficerId(null)}
        isOnStaff={Boolean(profileOfficer)}
        onStaffChange={
          profileOfficer
            ? (onStaff) => {
                if (!onStaff) {
                  handleRemoveFromStaff(profileOfficer.id);
                }
              }
            : undefined
        }
      />

      <InviteOfficerModal
        officerId={inviteOfficerId}
        officerName={
          inviteOfficer
            ? officerProfileNameLabel(
                inviteOfficer.firstName,
                inviteOfficer.lastName
              )
            : "Officer"
        }
        openShifts={openShifts}
        invites={invites}
        onClose={() => setInviteOfficerId(null)}
        onInviteSent={(invite) =>
          setInvites((current) => {
            const withoutDuplicate = current.filter(
              (item) =>
                !(
                  item.officerId === invite.officerId &&
                  item.shiftId === invite.shiftId
                )
            );

            return [...withoutDuplicate, invite];
          })
        }
      />
    </div>
  );
}
