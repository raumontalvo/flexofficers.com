"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardDescription,
  CardTitle,
  SectionHeading,
} from "@/components/ui";

type Role = "OFFICER" | "COMPANY";

type OnboardingRoleChoiceProps = {
  initialRole?: Role | null;
};

const PENDING_ROLE_KEY = "flexofficers.pendingRole";

function isValidRole(value: string | null): value is Role {
  return value === "OFFICER" || value === "COMPANY";
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
      <SectionHeading
        title="Welcome to FlexOfficers"
        subtitle="Choose how you want to use the platform."
        align="center"
      />

      {error ? (
        <Card className="mt-6 border-red-500/20 bg-fo-rejected-bg">
          <p className="text-sm text-fo-rejected">{error}</p>
        </Card>
      ) : null}

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Card variant="elevated" className="flex h-full flex-col">
          <CardTitle className="text-xl sm:text-2xl">Security Officer</CardTitle>
          <CardDescription className="mt-2">
            Browse shifts and apply for work on your schedule.
          </CardDescription>

          <RoleFeatureList
            items={[
              "Find open shifts",
              "Apply for free",
              "Get company contact info after acceptance",
            ]}
          />

          <Button
            type="button"
            fullWidth
            className="mt-8 w-full"
            disabled={savingRole !== null}
            onClick={() => chooseRole("OFFICER")}
          >
            {savingRole === "OFFICER" ? "Saving..." : "Continue as Officer"}
          </Button>
        </Card>

        <Card variant="elevated" className="flex h-full flex-col">
          <CardTitle className="text-xl sm:text-2xl">Security Company</CardTitle>
          <CardDescription className="mt-2">
            Post shifts and connect with qualified officers.
          </CardDescription>

          <RoleFeatureList
            items={[
              "Post open shifts",
              "Review officer profiles",
              "Fill shifts faster",
            ]}
          />

          <Button
            type="button"
            fullWidth
            className="mt-8 w-full"
            disabled={savingRole !== null}
            onClick={() => chooseRole("COMPANY")}
          >
            {savingRole === "COMPANY" ? "Saving..." : "Continue as Company"}
          </Button>
        </Card>
      </div>

      <Card variant="muted" className="mt-6">
        <p className="text-sm leading-relaxed text-fo-text-muted">
          Companies are responsible for verifying licenses, credentials, and
          hiring requirements.
        </p>
      </Card>
    </>
  );
}
