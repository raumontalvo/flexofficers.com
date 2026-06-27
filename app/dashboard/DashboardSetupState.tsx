import Link from "next/link";
import {
  buttonClassName,
  Card,
  CardDescription,
  CardTitle,
  PageShell,
  SectionHeading,
} from "@/components/ui";
import DashboardSignOutButton from "./SignOutButton";

type DashboardSetupStateProps = {
  firstName?: string | null;
  variant: "onboarding" | "officer-profile" | "company-profile";
};

const copy = {
  onboarding: {
    title: "Complete onboarding",
    description:
      "Choose whether you are joining as an officer or a company before using the dashboard.",
    actionLabel: "Go to Onboarding",
    actionHref: "/onboarding",
    nav: "none" as const,
  },
  "officer-profile": {
    title: "Set up your officer profile",
    description:
      "Your account is registered as an officer. Complete your profile to browse shifts and apply.",
    actionLabel: "Complete Officer Profile",
    actionHref: "/officer/profile",
    nav: "officer" as const,
  },
  "company-profile": {
    title: "Set up your company profile",
    description:
      "Your account is registered as a company. Add your company details to post shifts and review applicants.",
    actionLabel: "Complete Company Profile",
    actionHref: "/company/profile",
    nav: "company" as const,
  },
};

export function DashboardSetupState({
  firstName,
  variant,
}: DashboardSetupStateProps) {
  const content = copy[variant];
  const welcomeName = firstName?.trim();

  return (
    <PageShell
      nav={content.nav}
      maxWidth="2xl"
      sidebar={content.nav !== "none"}
    >
      <div className="flex items-start justify-between gap-4">
        <SectionHeading
          title={`Welcome${welcomeName ? `, ${welcomeName}` : ""}`}
          subtitle="Finish setup to start using FlexOfficers."
          className="flex-1"
        />
        <DashboardSignOutButton />
      </div>

      <Card
        variant="elevated"
        className="fo-glass-card mt-8 border-yellow-500/20 bg-fo-pending-bg"
      >
        <CardTitle className="text-lg text-fo-pending">{content.title}</CardTitle>
        <CardDescription className="mt-2 text-sm leading-relaxed text-fo-text">
          {content.description}
        </CardDescription>
        <Link
          href={content.actionHref}
          className={buttonClassName({
            variant: "secondary",
            size: "md",
            className: "mt-5 border-yellow-500/30 text-fo-pending hover:bg-yellow-500/10",
          })}
        >
          {content.actionLabel}
        </Link>
      </Card>
    </PageShell>
  );
}
