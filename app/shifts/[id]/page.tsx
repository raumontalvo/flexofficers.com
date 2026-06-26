import Link from "next/link";
import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import {
  ApplicationStatus,
  ShiftStatus,
  UserRole,
} from "@/app/generated/prisma/enums";
import {
  buttonClassName,
  Card,
  PageShell,
  ShiftStatusBadge,
  StatusBadge,
} from "@/components/ui";
import { formatHourlyRate, formatShiftDateTime } from "@/lib/format-shift";
import { prisma } from "@/lib/prisma";
import ApplyButton from "../ApplyButton";

export const dynamic = "force-dynamic";

export default async function ShiftDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const clerkUser = await currentUser();

  const [shift, user] = await Promise.all([
    prisma.shift.findUnique({
      where: {
        id,
      },
      include: {
        applications: {
          where: {
            status: ApplicationStatus.ACCEPTED,
          },
        },
        company: true,
      },
    }),
    clerkUser
      ? prisma.user.findUnique({
          where: { clerkId: clerkUser.id },
          select: { role: true },
        })
      : Promise.resolve(null),
  ]);

  if (!shift) {
    notFound();
  }

  const filledCount = shift.applications.length;
  const openPositions = Math.max(shift.positionsNeeded - filledCount, 0);
  const canApply =
    user?.role === UserRole.OFFICER && shift.status === ShiftStatus.OPEN;

  return (
    <PageShell nav="officer" maxWidth="lg" sidebar>
      <Link
        href="/shifts"
        className="inline-flex min-h-11 items-center text-sm font-medium text-fo-primary-hover hover:text-fo-primary-bright"
      >
        ← Back to available shifts
      </Link>

      <div className="mt-6 space-y-4">
        <Card variant="elevated" className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <ShiftStatusBadge status={shift.status} />
            <StatusBadge variant="info">
              {openPositions} of {shift.positionsNeeded} open
            </StatusBadge>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fo-primary-hover">
              Shift details
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-fo-text sm:text-4xl">
              {shift.title}
            </h1>

            <p className="text-4xl font-bold text-fo-primary-bright sm:text-5xl">
              {formatHourlyRate(shift.hourlyRate)}
              <span className="ml-1 text-xl font-semibold text-fo-text-muted">
                /hr
              </span>
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-fo-border bg-fo-bg-elevated p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
                Location
              </p>
              <p className="mt-2 text-base font-medium text-fo-text">
                {shift.location}
              </p>
            </div>

            <div className="rounded-2xl border border-fo-border bg-fo-bg-elevated p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
                Positions
              </p>
              <p className="mt-2 text-base font-medium text-fo-text">
                {openPositions} of {shift.positionsNeeded} still open
              </p>
            </div>

            <div className="rounded-2xl border border-fo-border bg-fo-bg-elevated p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
                Start
              </p>
              <p className="mt-2 text-base font-medium text-fo-text">
                {formatShiftDateTime(shift.startTime)}
              </p>
            </div>

            <div className="rounded-2xl border border-fo-border bg-fo-bg-elevated p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
                End
              </p>
              <p className="mt-2 text-base font-medium text-fo-text">
                {formatShiftDateTime(shift.endTime)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="space-y-3">
          <h2 className="text-lg font-semibold text-fo-text">Description</h2>
          <p className="whitespace-pre-wrap text-base leading-relaxed text-fo-text-muted">
            {shift.description || "No description provided."}
          </p>
        </Card>

        {shift.specialRequirements ? (
          <Card variant="muted" className="space-y-3">
            <h2 className="text-lg font-semibold text-fo-text">
              Special requirements
            </h2>
            <p className="whitespace-pre-wrap text-base leading-relaxed text-fo-text">
              {shift.specialRequirements}
            </p>
          </Card>
        ) : null}

        <Card className="space-y-3">
          <h2 className="text-lg font-semibold text-fo-text">Company</h2>
          <p className="text-base font-medium text-fo-text">
            {shift.company.companyName}
          </p>
          <p className="text-sm leading-relaxed text-fo-text-muted">
            Company contact details are shared after your application is
            accepted.
          </p>
        </Card>

        {canApply ? (
          <ApplyButton shiftId={shift.id} />
        ) : shift.status !== ShiftStatus.OPEN ? (
          <div className="rounded-fo-card border border-fo-border bg-fo-neutral-bg px-5 py-4 text-center text-sm text-fo-text-muted">
            This shift is no longer accepting applications.
          </div>
        ) : !clerkUser ? (
          <Link
            href="/sign-in"
            className={buttonClassName({ fullWidth: true, className: "w-full" })}
          >
            Sign in to apply
          </Link>
        ) : null}
      </div>
    </PageShell>
  );
}
