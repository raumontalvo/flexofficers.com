"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { FlexOfficersLogoLink } from "@/components/brand";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { TranslatedSectionHeading } from "@/components/i18n/translated-section-heading";
import { IconShield } from "@/components/landing/icons";
import { CompaniesIcon, ProfileIcon } from "@/components/nav/icons";
import { Button, Card, CardDescription, CardTitle } from "@/components/ui";
import { cn } from "@/lib/cn";
import { getRoleHomePath } from "@/lib/rbac-paths";
import {
  getSignUpPath,
  isOnboardingRole,
  type OnboardingRole,
} from "@/lib/onboarding-flow";

type OnboardingClientProps = {
  initialRole?: OnboardingRole | null;
  forceRoleChoice?: boolean;
};

type FeatureGroup = {
  title: string;
  items: string[];
};

const PENDING_ROLE_KEY = "flexofficers.pendingRole";

const roleCardClassName = cn(
  "flex h-full min-h-0 flex-col overflow-visible border-slate-700/80 bg-gradient-to-b from-[#0c1424] via-fo-bg-elevated to-[#070d18]",
  "!px-8 !pt-8 !pb-10 sm:!px-9 sm:!pt-9 sm:!pb-10 shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition-colors md:hover:border-fo-primary-bright/60"
);

function isValidRole(value: string | null): value is OnboardingRole {
  return isOnboardingRole(value ?? undefined);
}

function getRoleDestination(role: OnboardingRole) {
  return getRoleHomePath(role);
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

export default function OnboardingClient({
  initialRole = null,
  forceRoleChoice = false,
}: OnboardingClientProps) {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const { t } = useLandingLanguage();
  const [error, setError] = useState("");
  const [savingRole, setSavingRole] = useState<OnboardingRole | null>(null);
  const autoSaveAttempted = useRef(false);
  const copy = t.onboarding;

  const officerFeatureGroups: FeatureGroup[] = [
    {
      title: copy.officer.groups.findWork,
      items: [copy.officer.items.findOpenShifts, copy.officer.items.getInvites, copy.officer.items.applyFast],
    },
    {
      title: copy.officer.groups.buildCareer,
      items: [
        copy.officer.items.buildProfile,
        copy.officer.items.showcaseLicenses,
        copy.officer.items.flexibleSchedule,
      ],
    },
    {
      title: copy.officer.groups.afterAcceptance,
      items: [copy.officer.items.contactAfterAcceptance, copy.officer.items.trackApplications],
    },
  ];

  const companyFeatureGroups: FeatureGroup[] = [
    {
      title: copy.company.groups.postJobs,
      items: [copy.company.items.publicPrivatePosts, copy.company.items.postOpenShifts, copy.company.items.fillFaster],
    },
    {
      title: copy.company.groups.hireOfficers,
      items: [copy.company.items.inviteOfficers, copy.company.items.reviewProfiles, copy.company.items.acceptReject],
    },
    {
      title: copy.company.groups.manageTeam,
      items: [copy.company.items.manageStaff, copy.company.items.manageAccepted],
    },
  ];

  const clientFeatureGroups: FeatureGroup[] = [
    {
      title: copy.client.groups.postNeed,
      items: [copy.client.items.describeNeed, copy.client.items.setDetails, copy.client.items.reachCompanies],
    },
    {
      title: copy.client.groups.reviewApplicants,
      items: [
        copy.client.items.reviewProfiles,
        copy.client.items.compareExperience,
        copy.client.items.acceptBestMatch,
      ],
    },
    {
      title: copy.client.groups.secureConfidence,
      items: [copy.client.items.simpleFee, copy.client.items.fastResponses],
    },
  ];

  const saveRole = useCallback(async (role: OnboardingRole) => {
    setError("");
    setSavingRole(role);

    const response = await fetch("/api/onboarding/role", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    });

    if (response.ok) {
      window.localStorage.removeItem(PENDING_ROLE_KEY);
      router.push(getRoleDestination(role));
      return;
    }

    if (response.status === 409) {
      const data = (await response.json().catch(() => null)) as {
        role?: OnboardingRole;
      } | null;

      window.localStorage.removeItem(PENDING_ROLE_KEY);

      if (data?.role) {
        router.push(getRoleHomePath(data.role));
        return;
      }
    }

    const data = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;

    setSavingRole(null);
    setError(data?.error || copy.errors.saveFailed);
  }, [copy.errors.saveFailed, router]);

  async function chooseRole(role: OnboardingRole) {
    if (!isLoaded) {
      return;
    }

    if (!isSignedIn) {
      window.localStorage.setItem(PENDING_ROLE_KEY, role);
      router.push(getSignUpPath(role));
      return;
    }

    await saveRole(role);
  }

  useEffect(() => {
    if (forceRoleChoice || !isLoaded || !isSignedIn || autoSaveAttempted.current) {
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

    autoSaveAttempted.current = true;
    const timer = window.setTimeout(() => {
      void saveRole(pendingRole);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [forceRoleChoice, initialRole, isLoaded, isSignedIn, saveRole]);

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

      <div className="mt-6 grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3">
        <Card variant="elevated" className={roleCardClassName}>
          <RoleCardIcon>
            <ProfileIcon className="h-7 w-7" />
          </RoleCardIcon>
          <CardTitle className="text-xl sm:text-2xl">{copy.officer.title}</CardTitle>
          <CardDescription className="mt-2">{copy.officer.description}</CardDescription>
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
              {savingRole === "OFFICER" ? copy.saving : copy.officer.cta}
            </Button>
          </div>
        </Card>

        <Card variant="elevated" className={roleCardClassName}>
          <RoleCardIcon>
            <CompaniesIcon className="h-7 w-7" />
          </RoleCardIcon>
          <CardTitle className="text-xl sm:text-2xl">{copy.company.title}</CardTitle>
          <CardDescription className="mt-2">{copy.company.description}</CardDescription>
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
              {savingRole === "COMPANY" ? copy.saving : copy.company.cta}
            </Button>
          </div>
        </Card>

        <Card variant="elevated" className={roleCardClassName}>
          <RoleCardIcon>
            <IconShield className="h-7 w-7" />
          </RoleCardIcon>
          <CardTitle className="text-xl sm:text-2xl">{copy.client.title}</CardTitle>
          <CardDescription className="mt-2">{copy.client.description}</CardDescription>
          <RoleFeatureGroups groups={clientFeatureGroups} className="flex-1" />
          <div className="mt-auto shrink-0 pt-8">
            <Button
              type="button"
              fullWidth
              className="w-full gap-2"
              disabled={savingRole !== null}
              onClick={() => chooseRole("CLIENT")}
            >
              <IconShield className="h-5 w-5 shrink-0" />
              {savingRole === "CLIENT" ? copy.saving : copy.client.cta}
            </Button>
          </div>
        </Card>
      </div>

      <Card variant="muted" className="mt-8 !p-5 sm:!p-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <IconShield className="h-7 w-7 shrink-0 text-fo-primary-bright" />
            <h3 className="text-sm font-semibold text-fo-text sm:text-base">
              {copy.disclaimer.title}
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-fo-text sm:text-base">
            {copy.disclaimer.body}
          </p>
        </div>
      </Card>
    </>
  );
}
