"use client";

import { Button } from "@/components/ui";
import {
  getShiftSummaryFields,
  type PostShiftFormValues,
} from "@/lib/shift-create-form";

const TIPS = [
  "Be specific in your description",
  "Include parking and entry instructions",
  "Set a competitive pay rate",
  "Post early for better visibility",
] as const;

type PostShiftSummaryPanelProps = {
  form: PostShiftFormValues;
  isSubmitting: boolean;
  errorMessage: string | null;
  onSubmit: () => void;
};

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <dt className="text-fo-text-muted">{label}</dt>
      <dd className="max-w-[60%] text-right font-medium text-fo-text">{value}</dd>
    </div>
  );
}

function ChipSummaryRow<T extends string>({
  label,
  labels,
}: {
  label: string;
  labels: readonly T[];
}) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <dt className="text-fo-text-muted">{label}</dt>
      <dd className="max-w-[60%] text-right">
        {labels.length === 0 ? (
          <span className="font-medium text-fo-text">Not set</span>
        ) : (
          <div className="flex flex-wrap justify-end gap-1.5">
            {labels.map((entry) => (
              <span
                key={entry}
                className="inline-flex rounded-full border border-blue-500/25 bg-blue-500/10 px-2 py-0.5 text-[11px] font-semibold text-blue-100"
              >
                {entry}
              </span>
            ))}
          </div>
        )}
      </dd>
    </div>
  );
}

export function PostShiftSummaryPanel({
  form,
  isSubmitting,
  errorMessage,
  onSubmit,
}: PostShiftSummaryPanelProps) {
  const summary = getShiftSummaryFields(form);

  return (
    <div className="space-y-4 lg:sticky lg:top-6">
      <section className="fo-glass-card rounded-xl border border-white/10 p-4">
        <h2 className="text-base font-bold text-fo-text">Shift Summary</h2>

        <dl className="mt-4 space-y-3">
          <SummaryRow label="Type of Post" value={summary.typeOfPost} />
          <SummaryRow label="Date & Time" value={summary.dateTime} />
          <SummaryRow label="Location" value={summary.location} />
          <SummaryRow label="Pay Rate" value={summary.payRate} />
          <ChipSummaryRow
            label="License Required"
            labels={summary.licenseRequirements}
          />
          <ChipSummaryRow
            label="Certification Required"
            labels={summary.certificationRequirements}
          />
          <SummaryRow label="Open Positions" value={summary.openPositions} />
          <SummaryRow label="Description" value={summary.description} />
        </dl>

        <div className="mt-4 border-t border-white/[0.06] pt-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-fo-text-muted">
              Estimated Total
            </span>
            <span className="text-lg font-bold text-fo-primary-bright">
              {summary.estimatedTotal}
            </span>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <Button
            type="button"
            fullWidth
            className="w-full"
            disabled={isSubmitting}
            onClick={onSubmit}
          >
            {isSubmitting ? "Posting..." : "Review & Post Shift"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            fullWidth
            className="w-full"
            disabled
            title="Draft saving is not supported yet"
          >
            Save as Draft
          </Button>
        </div>

        {errorMessage ? (
          <p className="mt-3 text-xs text-red-300">{errorMessage}</p>
        ) : null}
      </section>

      <section className="fo-glass-card rounded-xl border border-white/10 p-4">
        <h3 className="text-sm font-bold text-fo-text">
          Tips for a Successful Post
        </h3>
        <ul className="mt-3 space-y-2">
          {TIPS.map((tip) => (
            <li
              key={tip}
              className="flex items-start gap-2 text-xs leading-relaxed text-fo-text-muted"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
