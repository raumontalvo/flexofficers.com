"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { FlexOfficersLogoLink } from "@/components/brand";
import { IconShield } from "@/components/landing/icons";
import { CompaniesIcon, ProfileIcon } from "@/components/nav/icons";
import { TranslatedSectionHeading } from "@/components/i18n/translated-section-heading";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import {
  Button,
  Card,
  CardDescription,
  CardTitle,
} from "@/components/ui";
import { cn } from "@/lib/cn";

type Role = "OFFICER" | "COMPANY";

type OnboardingRoleChoiceProps = {
  initialRole?: Role | null;
};

type FeatureGroup = {
  title: string;
  items: string[];
};

const PENDING_ROLE_KEY = "flexofficers.pendingRole";

function useOfficerFeatureGroups(): FeatureGroup[] {
  const { t } = useLandingLanguage();
  const o = t.onboarding.officer;

  return [
    {
      title: o.groups.findWork,
      items: [o.items.findOpenShifts, o.items.getInvites, o.items.applyFast],
    },
    {
      title: o.groups.buildCareer,
      items: [
        o.items.buildProfile,
        o.items.showcaseLicenses,
        o.items.flexibleSchedule,
      ],
    },
    {
      title: o.groups.afterAcceptance,
      items: [o.items.contactAfterAcceptance, o.items.trackApplications],
    },
  ];
}

function useCompanyFeatureGroups(): FeatureGroup[] {
  const { t } = useLandingLanguage();
  const c = t.onboarding.company;

  return [
    {
      title: c.groups.postJobs,
      items: [c.items.publicPrivatePosts, c.items.postOpenShifts, c.items.fillFaster],
    },
    {
      title: c.groups.hireOfficers,
      items: [c.items.inviteOfficers, c.items.reviewProfiles, c.items.acceptReject],
    },
    {
      title: c.groups.manageTeam,
      items: [c.items.manageStaff, c.items.manageAccepted],
    },
  ];
}

const roleCardClassName = cn(
  "flex h-full min-h-0 flex-col overflow-visible border-slate-700/80 bg-gradient-to-b from-[#0c1424] via-fo-bg-elevated to-[#070d18]",
  "!px-8 !pt-8 !pb-10 sm:!px-9 sm:!pt-9 sm:!pb-10 shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition-colors md:hover:border-fo-primary-bright/60"
);

function isValidRole(value: string | null): value is Role {
  return value === "OFFICER" || value === "COMPANY";
}

function RoleCardIcon({ children }: { children: ReactNode }) {
  return (
    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-fo-primary-bright/50 bg-fo-primary/10 text-fo-primary-bright shadow-[0_0_28px_rgba(59,130,246,0.15)]">
      {children}
    </div>
  );
}

function RoleFeatureGroups({
  groups,
  className,
}: {
  groups: FeatureGroup[];
  className?: string;
}) {
  return (
    <div className={cn("mt-5 space-y-6 text-left", className)}>
      {groups.map((group) => (
        <div key={group.title}>
          <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-fo-primary-hover">
            {group.title}
          </h4>
          <ul className="mt-3 space-y-3">
            {group.items.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm text-fo-text-muted"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-fo-primary/15 text-xs font-bold text-fo-primary-hover">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default function OnboardingRoleChoice({
  initialRole = null,
}: OnboardingRoleChoiceProps) {
  const router = useRouter();
  const { t } = useLandingLanguage();
  const officerFeatureGroups = useOfficerFeatureGroups();
  const companyFeatureGroups = useCompanyFeatureGroups();
  const { isLoaded, isSignedIn } = useUser();
  const [error, setError] = useState("");
  const [savingRole, setSavingRole] = useState<Role | null>(null);

  async function saveRole(role: Role) {
    setError("");
    setSavingRole(role);

    const response = await fetch("/api/onboarding/role", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    });

    if (response.ok || response.status === 409) {
      window.localStorage.removeItem(PENDING_ROLE_KEY);
      router.push("/dashboard");
      return;
    }

    const data = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;

    setSavingRole(null);
    setError(data?.error || t.onboarding.errors.saveFailed);
  }

  async function chooseRole(role: Role) {
    if (!isLoaded) {
      return;
    }

    if (!isSignedIn) {
      window.localStorage.setItem(PENDING_ROLE_KEY, role);
      router.push("/sign-up");
      return;
    }

    await saveRole(role);
  }

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      return;
    }

    const pendingRole =
      initialRole ||
      (typeof window !== "undefined"
        ? window.localStorage.getItem(PENDING_ROLE_KEY)
        : null);

    if (!isValidRole(pendingRole)) {
      return;
    }

    void saveRole(pendingRole);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, initialRole]);

  return (
    <>
      <div className="mb-4 flex justify-center">
        <FlexOfficersLogoLink
          href="/"
          height={120}
          priority
          imageClassName="!h-auto !w-[180px] !max-w-[180px] md:!w-[220px] md:!max-w-[220px]"
        />
      </div>

      <TranslatedSectionHeading
        page="onboarding"
        align="center"
        className="!flex-col !items-center !justify-center !text-center sm:!items-center sm:!text-center [&>div]:mx-auto [&>div]:text-center [&>div>p]:mx-auto"
      />

      {error ? (
        <Card className="mt-5 border-red-500/20 bg-fo-rejected-bg">
          <p className="text-sm text-fo-rejected">{error}</p>
        </Card>
      ) : null}

      <div className="mt-6 grid items-stretch gap-4 sm:grid-cols-2">
        <Card variant="elevated" className={roleCardClassName}>
          <RoleCardIcon>
            <ProfileIcon className="h-7 w-7" />
          </RoleCardIcon>
          <CardTitle className="text-xl sm:text-2xl">{t.onboarding.officer.title}</CardTitle>
          <CardDescription className="mt-2">
            {t.onboarding.officer.description}
          </CardDescription>

          <RoleFeatureGroups groups={officerFeatureGroups} className="flex-1" />

          <div className="mt-auto shrink-0 pt-8">
            <Button
              type="button"
              fullWidth
              className="w-full gap-2"
              disabled={savingRole !== null}
              onClick={() => chooseRole("OFFICER")}
            >
              <ProfileIcon className="h-5 w-5 shrink-0" />
              {savingRole === "OFFICER" ? t.onboarding.saving : t.onboarding.officer.cta}
            </Button>
          </div>
        </Card>

        <Card variant="elevated" className={roleCardClassName}>
          <RoleCardIcon>
            <CompaniesIcon className="h-7 w-7" />
          </RoleCardIcon>
          <CardTitle className="text-xl sm:text-2xl">{t.onboarding.company.title}</CardTitle>
          <CardDescription className="mt-2">
            {t.onboarding.company.description}
          </CardDescription>

          <RoleFeatureGroups groups={companyFeatureGroups} className="flex-1" />

          <div className="mt-auto shrink-0 pt-8">
            <Button
              type="button"
              fullWidth
              className="w-full gap-2"
              disabled={savingRole !== null}
              onClick={() => chooseRole("COMPANY")}
            >
              <CompaniesIcon className="h-5 w-5 shrink-0" />
              {savingRole === "COMPANY" ? t.onboarding.saving : t.onboarding.company.cta}
            </Button>
          </div>
        </Card>
      </div>

      <Card variant="muted" className="mt-8 !p-5 sm:!p-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <IconShield className="h-7 w-7 shrink-0 text-fo-primary-bright" />
            <h3 className="text-sm font-semibold text-fo-text sm:text-base">
              {t.onboarding.disclaimer.title}
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-fo-text sm:text-base">
            {t.onboarding.disclaimer.body}
          </p>
        </div>
      </Card>
    </>
  );
}
