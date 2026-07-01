"use client";

import Link from "next/link";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { TranslatedSectionHeading } from "@/components/i18n/translated-section-heading";
import { buttonClassName } from "@/components/ui";
import { MobilePrimaryButton } from "@/components/ui/mobile";
import type { CompanyAccessFields } from "@/lib/company-access";
import { getTranslatedCompanyPostingBlockMessage } from "@/lib/i18n/ui-labels";

type CompanyShiftsPageHeaderProps = {
  canPostShifts: boolean;
};

export function CompanyShiftsPageHeader({
  canPostShifts,
}: CompanyShiftsPageHeaderProps) {
  const { t } = useLandingLanguage();
  const actions = t.browse.companyShifts.actions;

  const postAction = canPostShifts ? (
    <Link href="/shifts/create" className={buttonClassName({ size: "md" })}>
      {actions.postShift}
    </Link>
  ) : (
    <Link href="/company/billing" className={buttonClassName({ size: "md" })}>
      {actions.subscribeToPost}
    </Link>
  );

  return (
    <>
      <div className="space-y-4 md:hidden">
        <TranslatedSectionHeading page="companyShifts" />
        <MobilePrimaryButton
          href={canPostShifts ? "/shifts/create" : "/company/billing"}
        >
          {canPostShifts ? actions.postShift : actions.subscribeToPost}
        </MobilePrimaryButton>
      </div>

      <TranslatedSectionHeading
        className="hidden md:flex"
        page="companyShifts"
        action={postAction}
      />
    </>
  );
}

export function CompanyShiftsPostingBlockCard({
  company,
}: {
  company: CompanyAccessFields;
}) {
  const { t } = useLandingLanguage();
  const message =
    getTranslatedCompanyPostingBlockMessage(t, company) ??
    t.browse.companyShifts.blockMessage.subscriptionRequired;

  return (
    <>
      <p className="text-sm leading-relaxed text-fo-text-muted">{message}</p>
      <Link
        href="/company/billing"
        className={buttonClassName({
          variant: "secondary",
          size: "md",
          className: "mt-4",
        })}
      >
        {t.browse.companyShifts.actions.viewBilling}
      </Link>
    </>
  );
}
