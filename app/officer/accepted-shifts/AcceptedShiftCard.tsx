import Link from "next/link";
import type { ReactNode } from "react";
import type { ShiftStatus } from "@/app/generated/prisma/enums";
import {
  ApplicationStatusBadge,
  buttonClassName,
  Card,
  ShiftStatusBadge,
  StatusBadge,
} from "@/components/ui";
import { formatHourlyRate, formatShiftDateTime } from "@/lib/format-shift";

type AcceptedShiftCardProps = {
  shiftId: string;
  title: string;
  hourlyRate: { toString: () => string };
  companyName: string;
  contactName?: string | null;
  phone?: string | null;
  email: string;
  address?: string | null;
  website?: string | null;
  location: string;
  startTime: Date;
  endTime: Date;
  positionsNeeded: number;
  specialRequirements: string;
  reportingInstructions?: string | null;
  shiftStatus: ShiftStatus;
};

function ContactField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-fo-text">{children}</dd>
    </div>
  );
}

export function AcceptedShiftCard({
  shiftId,
  title,
  hourlyRate,
  companyName,
  contactName,
  phone,
  email,
  address,
  website,
  location,
  startTime,
  endTime,
  positionsNeeded,
  specialRequirements,
  reportingInstructions,
  shiftStatus,
}: AcceptedShiftCardProps) {
  return (
    <Card
      variant="elevated"
      className="space-y-5 border-green-500/15 ring-1 ring-green-500/10"
    >
      <div className="flex flex-wrap items-center gap-2">
        <ApplicationStatusBadge status="ACCEPTED" />
        <ShiftStatusBadge status={shiftStatus} />
        <StatusBadge variant="info">
          {positionsNeeded} {positionsNeeded === 1 ? "position" : "positions"}
        </StatusBadge>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-bold tracking-tight text-fo-text sm:text-2xl">
          {title}
        </h2>

        <p className="text-3xl font-bold text-fo-primary-bright sm:text-4xl">
          {formatHourlyRate(hourlyRate)}
          <span className="ml-1 text-lg font-semibold text-fo-text-muted">
            /hr
          </span>
        </p>

        <p className="text-sm font-medium text-fo-text-muted">{companyName}</p>
        <p className="text-base text-fo-text">{location}</p>

        <div className="space-y-1 text-sm text-fo-text-muted">
          <p>Starts {formatShiftDateTime(startTime)}</p>
          <p>Ends {formatShiftDateTime(endTime)}</p>
        </div>
      </div>

      {specialRequirements ? (
        <div className="rounded-2xl border border-fo-border bg-fo-bg-elevated p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
            Special requirements
          </p>
          <p className="mt-2 text-sm text-fo-text">{specialRequirements}</p>
        </div>
      ) : null}

      <div className="rounded-2xl border border-green-500/20 bg-fo-success-bg p-4">
        <p className="text-sm leading-relaxed text-fo-success">
          You were accepted for this shift. Contact the company directly to
          confirm arrival time, uniform, and any last-minute details.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-fo-border bg-fo-bg-elevated p-5">
          <h3 className="text-lg font-semibold text-fo-text">Company contact</h3>
          <p className="mt-2 text-sm text-fo-text-muted">
            Reach out using the details below. FlexOfficers does not coordinate
            scheduling on your behalf.
          </p>

          <dl className="mt-5 space-y-4">
            <ContactField label="Company">{companyName}</ContactField>
            <ContactField label="Contact person">
              {contactName || "Not provided"}
            </ContactField>
            <ContactField label="Phone">
              {phone ? (
                <a
                  href={`tel:${phone}`}
                  className="text-fo-primary-hover hover:text-fo-primary-bright"
                >
                  {phone}
                </a>
              ) : (
                "Not provided"
              )}
            </ContactField>
            <ContactField label="Email">
              <a
                href={`mailto:${email}`}
                className="break-all text-fo-primary-hover hover:text-fo-primary-bright"
              >
                {email}
              </a>
            </ContactField>
            <ContactField label="Address">
              {address || "Not provided"}
            </ContactField>
            {website ? (
              <ContactField label="Website">
                <a
                  href={website}
                  target="_blank"
                  rel="noreferrer"
                  className="break-all text-fo-primary-hover hover:text-fo-primary-bright"
                >
                  {website}
                </a>
              </ContactField>
            ) : null}
          </dl>
        </div>

        <div className="rounded-2xl border border-fo-border bg-fo-bg-elevated p-5">
          <h3 className="text-lg font-semibold text-fo-text">
            Reporting instructions
          </h3>
          {reportingInstructions ? (
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-fo-text-muted">
              {reportingInstructions}
            </p>
          ) : (
            <p className="mt-4 text-sm text-fo-text-subtle">
              No reporting instructions were provided for this shift. Contact the
              company for check-in details.
            </p>
          )}
        </div>
      </div>

      <Link
        href={`/shifts/${shiftId}`}
        className={buttonClassName({
          variant: "secondary",
          fullWidth: true,
          className: "w-full",
        })}
      >
        View Shift Details
      </Link>
    </Card>
  );
}
