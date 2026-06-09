"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

type Role = "OFFICER" | "COMPANY";

type OnboardingRoleChoiceProps = {
  initialRole?: Role | null;
};

const PENDING_ROLE_KEY = "flexofficers.pendingRole";

function isValidRole(value: string | null): value is Role {
  return value === "OFFICER" || value === "COMPANY";
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
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <section className="mx-auto max-w-3xl text-center">
        <h1 className="text-5xl font-bold">Choose Your Role</h1>

        <p className="mt-4 text-slate-300">
          Tell us how you will use FlexOfficers.
        </p>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
            {error}
          </div>
        )}

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-3xl font-bold">Security Officer</h2>

            <p className="mt-4 text-slate-300">
              Browse shifts, apply for opportunities, and build your profile.
            </p>

            <button
              onClick={() => chooseRole("OFFICER")}
              disabled={savingRole !== null}
              className="mt-8 w-full rounded-xl bg-blue-500 px-6 py-3 font-semibold hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingRole === "OFFICER" ? "Saving..." : "Continue as Officer"}
            </button>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-3xl font-bold">Security Company</h2>

            <p className="mt-4 text-slate-300">
              Post shifts, review applicants, and manage staffing needs.
            </p>

            <button
              onClick={() => chooseRole("COMPANY")}
              disabled={savingRole !== null}
              className="mt-8 w-full rounded-xl bg-blue-500 px-6 py-3 font-semibold hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingRole === "COMPANY" ? "Saving..." : "Continue as Company"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}