"use client";

import { Button } from "@/components/ui";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { interpolate } from "@/lib/app-i18n";
import {
  getShiftSummaryFields,
  type PostShiftFormValues,
  type ShiftPostVisibility,
} from "@/lib/shift-create-form";
import { cn } from "@/lib/cn";

type PostShiftSummaryPanelProps = {
  form: PostShiftFormValues;
  isSubmitting: boolean;
  errorMessage: string | null;
  onSubmit: () => void;
  onVisibilityChange: (visibility: ShiftPostVisibility) => void;
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
  notSetLabel,
}: {
  label: string;
  labels: readonly T[];
  notSetLabel: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <dt className="text-fo-text-muted">{label}</dt>
      <dd className="max-w-[60%] text-right">
        {labels.length === 0 ? (
          <span className="font-medium text-fo-text">{notSetLabel}</span>
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
  onVisibilityChange,
}: PostShiftSummaryPanelProps) {
  const { t } = useLandingLanguage();
  const summaryCopy = t.shiftForm.summary;
  const actions = t.shiftForm.actions;
  const summary = getShiftSummaryFields(form);

  return (
    <div className="space-y-4 lg:sticky lg:top-6">
      <section className="fo-glass-card rounded-xl border border-white/10 p-4">
        <h2 className="text-base font-bold text-fo-text">{summaryCopy.title}</h2>

        <dl className="mt-4 space-y-3">
          <SummaryRow label={summaryCopy.typeOfPost} value={summary.typeOfPost} />
          <SummaryRow label={summaryCopy.dateTime} value={summary.dateTime} />
          <SummaryRow label={summaryCopy.location} value={summary.location} />
          <SummaryRow label={summaryCopy.payRate} value={summary.payRate} />
          <ChipSummaryRow
            label={summaryCopy.licenseRequired}
            labels={summary.licenseRequirements}
            notSetLabel={summaryCopy.notSet}
          />
          <ChipSummaryRow
            label={summaryCopy.certificationRequired}
            labels={summary.certificationRequirements}
            notSetLabel={summaryCopy.notSet}
          />
          <SummaryRow label={summaryCopy.openPositions} value={summary.openPositions} />
          <SummaryRow label={summaryCopy.description} value={summary.description} />
        </dl>

        <div className="mt-4 border-t border-white/[0.06] pt-4">
          <p className="text-sm font-medium text-fo-text">{summaryCopy.visibilityQuestion}</p>
          <div className="mt-3 grid gap-2">
            <label
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition",
                form.visibility === "PUBLIC"
                  ? "border-fo-primary-bright/40 bg-fo-primary/10"
                  : "border-white/10 bg-white/[0.02] hover:border-white/15"
              )}
            >
              <input
                type="radio"
                name="shift-visibility"
                value="PUBLIC"
                checked={form.visibility === "PUBLIC"}
                onChange={() => onVisibilityChange("PUBLIC")}
                className="mt-1"
              />
              <span>
                <span className="block text-sm font-semibold text-fo-text">
                  {summaryCopy.publicTitle}
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-fo-text-muted">
                  {summaryCopy.publicDescription}
                </span>
              </span>
            </label>
            <label
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition",
                form.visibility === "STAFF_ONLY"
                  ? "border-fo-primary-bright/40 bg-fo-primary/10"
                  : "border-white/10 bg-white/[0.02] hover:border-white/15"
              )}
            >
              <input
                type="radio"
                name="shift-visibility"
                value="STAFF_ONLY"
                checked={form.visibility === "STAFF_ONLY"}
                onChange={() => onVisibilityChange("STAFF_ONLY")}
                className="mt-1"
              />
              <span>
                <span className="block text-sm font-semibold text-fo-text">
                  {summaryCopy.privateTitle}
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-fo-text-muted">
                  {summaryCopy.privateDescription}
                </span>
              </span>
            </label>
          </div>
          <p className="mt-3 text-xs text-fo-text-subtle">
            {interpolate(summaryCopy.selected, { value: summary.visibility })}
          </p>
        </div>

        <div className="mt-4">
          <Button
            type="button"
            fullWidth
            className="w-full"
            disabled={isSubmitting}
            onClick={onSubmit}
          >
            {isSubmitting ? actions.posting : actions.postShift}
          </Button>
        </div>

        {errorMessage ? (
          <p className="mt-3 text-xs text-red-300">{errorMessage}</p>
        ) : null}
      </section>

      <section className="fo-glass-card rounded-xl border border-white/10 p-4">
        <h3 className="text-sm font-bold text-fo-text">{summaryCopy.tipsTitle}</h3>
        <ul className="mt-3 space-y-2">
          {summaryCopy.tips.map((tip) => (
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
