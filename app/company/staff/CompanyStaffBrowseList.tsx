"use client";

import { useMemo, useState } from "react";
import { OfficerProfilePanel } from "@/components/company/officer-profile-panel";
import { officerProfileNameLabel } from "@/components/company/officer-profile-name";
import { InviteOfficerModal } from "@/components/company/invite-officer-modal";
import type { CompanyOpenShiftOption } from "@/components/company/invite-officer-to-shift";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import {
  getOfficerInviteButtonState,
  type CompanyOfficerInviteRecord,
  type CompanyOfficerShiftAssignment,
} from "@/lib/company-invite-workflow";
import { StatusToast } from "@/components/ui";
import {
  searchCompanyStaff,
  type SerializedCompanyStaffMember,
} from "@/lib/company-staff";
import { formatStaffCountLabel } from "@/lib/i18n/ui-labels";
import { OfficerSearchMobileCard } from "@/app/company/officers/OfficerSearchMobileCard";
import { StaffRosterCard } from "./StaffRosterCard";

type CompanyStaffBrowseListProps = {
  staff: SerializedCompanyStaffMember[];
  openShifts: CompanyOpenShiftOption[];
  invites: CompanyOfficerInviteRecord[];
  acceptedAssignments: CompanyOfficerShiftAssignment[];
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
    <StaffRosterCard
      officer={member.officer}
      onViewProfile={onViewProfile}
      onInvite={onInvite}
      onRemoveFromStaff={onRemoveFromStaff}
      inviteState={inviteState}
    />
  );
}

export function CompanyStaffBrowseList({
  staff: initialStaff,
  openShifts,
  invites: initialInvites,
  acceptedAssignments,
}: CompanyStaffBrowseListProps) {
  const { language, t } = useLandingLanguage();
  const staffCopy = t.company.staff;
  const officersCopy = t.company.officers;
  const [staff, setStaff] = useState(initialStaff);
  const [invites, setInvites] = useState(initialInvites);
  const [profileOfficerId, setProfileOfficerId] = useState<string | null>(null);
  const [inviteOfficerId, setInviteOfficerId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showInviteSentToast, setShowInviteSentToast] = useState(false);

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
        <h2 className="text-lg font-semibold text-fo-text">{staffCopy.noStaffYet}</h2>
        <p className="mt-2 text-sm text-fo-text-muted">
          {staffCopy.noStaffDescription}
        </p>
      </section>
    );
  }

  return (
    <div className="mt-4 space-y-3 lg:mt-6 lg:space-y-4">
      {showInviteSentToast ? (
        <StatusToast
          message={officersCopy.inviteSent}
          onClose={() => setShowInviteSentToast(false)}
        />
      ) : null}
      <label className="block">
        <span className="sr-only">{staffCopy.searchSrOnly}</span>
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={staffCopy.searchPlaceholder}
          className="min-h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-fo-text placeholder:text-fo-text-subtle focus:border-fo-primary-bright/50 focus:outline-none focus:ring-2 focus:ring-fo-primary-bright/20 lg:min-h-10 lg:rounded-lg lg:border-fo-border lg:bg-fo-bg/80"
        />
      </label>

      <p className="text-sm font-medium text-fo-text">
        {formatStaffCountLabel(t, filteredStaff.length, staff.length, language)}
      </p>

      {filteredStaff.length === 0 ? (
        <section className="fo-glass-card rounded-xl border border-white/10 px-4 py-10 text-center">
          <h2 className="text-base font-semibold text-fo-text">{staffCopy.noStaffFound}</h2>
          <p className="mt-2 text-sm text-fo-text-muted">
            {staffCopy.tryAnotherName}
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
              openShiftIds,
              acceptedAssignments
            )}
            inviteLabel={t.company.officerCards.inviteToShift}
          />
        ))}
      </div>

      <div className="hidden space-y-3 lg:block">
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
              openShiftIds,
              acceptedAssignments
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
            : officersCopy.officerFallback
        }
        openShifts={openShifts}
        invites={invites}
        acceptedAssignments={acceptedAssignments}
        onClose={() => setInviteOfficerId(null)}
        onInviteSent={(invite) => {
          setInvites((current) => {
            const withoutDuplicate = current.filter(
              (item) =>
                !(
                  item.officerId === invite.officerId &&
                  item.shiftId === invite.shiftId
                )
            );

            return [...withoutDuplicate, invite];
          });
          setShowInviteSentToast(true);
        }}
      />
    </div>
  );
}
