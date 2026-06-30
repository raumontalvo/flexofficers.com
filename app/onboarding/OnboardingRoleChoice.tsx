"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { FlexOfficersLogoLink } from "@/components/brand";
import { IconShield } from "@/components/landing/icons";
import { CompaniesIcon, ProfileIcon } from "@/components/nav/icons";
import {
  Button,
  Card,
  CardDescription,
  CardTitle,
  SectionHeading,
} from "@/components/ui";
import { cn } from "@/lib/cn";

type Role = "OFFICER" | "COMPANY";

type OnboardingRoleChoiceProps = {
  initialRole?: Role | null;
};

const PENDING_ROLE_KEY = "flexofficers.pendingRole";

const roleCardClassName = cn(
  "flex h-full flex-col border-slate-700/80 bg-gradient-to-b from-[#0c1424] via-fo-bg-elevated to-[#070d18]",
  "!p-8 sm:!p-9 shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition-colors md:hover:border-fo-primary-bright/60"
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

function RoleFeatureList({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 space-y-3 text-left">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-sm text-fo-text-muted">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-fo-primary/15 text-xs font-bold text-fo-primary-hover">
            ✓
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function OnboardingRoleChoice({
  initialRole = null,
}: OnboardingRoleChoiceProps) {
  const router = useRouter();
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
    setError(data?.error || "Could not save your role. Please try again.");
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
          imageClassName="!h-auto !w-[180px] !max-w-[180px] md:!w-[260px] md:!max-w-[260px]"
        />
      </div>

      <SectionHeading
        title="Welcome to FlexOfficers"
        subtitle="Choose how you want to use the platform."
        align="center"
        className="!flex-col !items-center !justify-center !text-center sm:!items-center sm:!text-center [&>div]:mx-auto [&>div]:text-center [&>div>p]:mx-auto"
      />

      {error ? (
        <Card className="mt-5 border-red-500/20 bg-fo-rejected-bg">
          <p className="text-sm text-fo-rejected">{error}</p>
        </Card>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card variant="elevated" className={roleCardClassName}>
          <RoleCardIcon>
            <ProfileIcon className="h-7 w-7" />
          </RoleCardIcon>
          <CardTitle className="text-xl sm:text-2xl">Security Officer</CardTitle>
          <CardDescription className="mt-2">
            Browse shifts and find the right opportunities on your schedule.
          </CardDescription>

          <RoleFeatureList
            items={[
              "Find open shifts",
              "Get company invites",
              "Apply to shifts in seconds",
              "Build your professional profile",
              "Showcase licenses and certifications",
              "Get company contact information after acceptance",
              "Track your applications and upcoming shifts",
              "Work when it fits your schedule",
            ]}
          />

          <Button
            type="button"
            fullWidth
            className="mt-auto w-full gap-2 pt-8"
            disabled={savingRole !== null}
            onClick={() => chooseRole("OFFICER")}
          >
            <ProfileIcon className="h-5 w-5 shrink-0" />
            {savingRole === "OFFICER" ? "Saving..." : "Continue as Officer"}
          </Button>
        </Card>

        <Card variant="elevated" className={roleCardClassName}>
          <RoleCardIcon>
            <CompaniesIcon className="h-7 w-7" />
          </RoleCardIcon>
          <CardTitle className="text-xl sm:text-2xl">Security Company</CardTitle>
          <CardDescription className="mt-2">
            Post shifts, review licensed officers, and fill coverage faster.
          </CardDescription>

          <RoleFeatureList
            items={[
              "Create public & private job posts",
              "Post open shifts",
              "Invite officers to apply",
              "Review profiles, licenses & certifications",
              "Accept or reject applicants",
              "Manage staff",
              "Manage accepted officers",
              "Fill shifts faster",
            ]}
          />

          <Button
            type="button"
            fullWidth
            className="mt-auto w-full gap-2 pt-8"
            disabled={savingRole !== null}
            onClick={() => chooseRole("COMPANY")}
          >
            <CompaniesIcon className="h-5 w-5 shrink-0" />
            {savingRole === "COMPANY" ? "Saving..." : "Continue as Company"}
          </Button>
        </Card>
      </div>

      <Card variant="muted" className="mt-6 !p-5 sm:!p-6">
        <div className="flex items-start gap-4">
          <IconShield className="mt-0.5 h-7 w-7 shrink-0 text-fo-primary-bright" />
          <p className="text-sm leading-relaxed text-fo-text sm:text-base">
            Companies are responsible for verifying licenses, credentials, hiring
            requirements, and paying officers directly for completed work.
          </p>
        </div>
      </Card>
    </>
  );
}
