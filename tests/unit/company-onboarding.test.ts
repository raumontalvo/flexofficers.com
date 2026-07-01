import { describe, expect, it } from "vitest";
import { CompanyAccessStatus } from "@/app/generated/prisma/enums";
import { getDefaultTrialFields } from "@/lib/company-trial";
import { ensureCompanyOnSignup } from "@/lib/company-onboarding";

describe("ensureCompanyOnSignup", () => {
  const now = new Date("2026-06-25T12:00:00.000Z");

  it("creates a company with an active trial on signup", async () => {
    const created: Array<Record<string, unknown>> = [];

    const tx = {
      company: {
        findUnique: async () => null,
        create: async ({ data }: { data: Record<string, unknown> }) => {
          created.push(data);
          return { id: "company-1" };
        },
      },
    };

    await ensureCompanyOnSignup(tx as never, {
      userId: "user-1",
      email: "owner@acme.test",
      firstName: "Alex",
      now,
    });

    expect(created).toEqual([
      {
        userId: "user-1",
        companyName: "Alex's Company",
        email: "owner@acme.test",
        ...getDefaultTrialFields(now),
      },
    ]);
  });

  it("does not create a second company when one already exists", async () => {
    let createCalls = 0;

    const tx = {
      company: {
        findUnique: async () => ({ id: "company-1" }),
        create: async () => {
          createCalls += 1;
          return { id: "company-2" };
        },
      },
    };

    const result = await ensureCompanyOnSignup(tx as never, {
      userId: "user-1",
      email: "owner@acme.test",
      now,
    });

    expect(result).toEqual({ id: "company-1" });
    expect(createCalls).toBe(0);
  });
});

describe("company access with signup trial defaults", () => {
  it("treats newly created signup companies as active trial access", () => {
    const company = {
      ...getDefaultTrialFields(new Date("2026-06-25T12:00:00.000Z")),
      subscriptionStatus: "INACTIVE" as const,
      subscriptionCurrentPeriodEnd: null,
    };

    expect(company.accessStatus).toBe(CompanyAccessStatus.TRIAL);
    expect(company.trialStartedAt).not.toBeNull();
    expect(company.trialEndsAt).not.toBeNull();
  });
});
