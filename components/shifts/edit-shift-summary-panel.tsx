"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { Button, buttonClassName } from "@/components/ui";
import { interpolate } from "@/lib/app-i18n";
import { cn } from "@/lib/cn";
import {
  getShiftSummaryFields,
  type PostShiftFormValues,
  type ShiftPostVisibility,
} from "@/lib/shift-create-form";

type EditShiftSummaryPanelProps = {
  shiftId: string;
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

export function EditShiftSummaryPanel({
  shiftId,
  form,
  isSubmitting,
  errorMessage,
  onSubmit,
  onVisibilityChange,
}: EditShiftSummaryPanelProps) {
  const router = useRouter();
  const { t } = useLandingLanguage();
  const summaryCopy = t.shiftForm.summary;
  const actions = t.shiftForm.actions;
  const [isDeleting, setIsDeleting] = useState(false);
  const summary = getShiftSummaryFields(form);

  async function handleDelete() {
    const confirmed = window.confirm(actions.deleteConfirm);

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch("/api/shifts/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shiftId }),
      });

      if (response.ok) {
        router.push("/company/shifts");
        router.refresh();
        return;
      }

      alert(actions.deleteFailed);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="lg:sticky lg:top-6">
      <section className="fo-glass-card rounded-xl border border-white/10 p-4">
        <h2 className="text-base font-bold text-fo-text">{summaryCopy.title}</h2>

        <dl className="mt-4 space-y-3">
          <SummaryRow label={summaryCopy.typeOfPost} value={summary.typeOfPost} />
          <SummaryRow label={summaryCopy.dateTime} value={summary.dateTime} />
          <SummaryRow label={summaryCopy.location} value={summary.location} />
          <SummaryRow label={summaryCopy.payRate} value={summary.payRate} />
          <SummaryRow label={summaryCopy.openPositions} value={summary.openPositions} />
          <ChipSummaryRow
            label={summaryCopy.licenseRequired}
            labels={summary.licenseRequirements}
            notSetLabel={summaryCopy.notSet}
          />
          <ChipSummaryRow
            label={summaryCopy.certifications}
            labels={summary.certificationRequirements}
            notSetLabel={summaryCopy.notSet}
          />
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
                name="edit-shift-visibility"
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
                name="edit-shift-visibility"
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

        <div className="mt-4 space-y-2">
          <Button
            type="button"
            fullWidth
            className="w-full"
            disabled={isSubmitting || isDeleting}
            onClick={onSubmit}
          >
            {isSubmitting ? actions.updating : actions.updateShift}
          </Button>

          <Link
            href={`/shifts/${shiftId}`}
            className={buttonClassName({
              variant: "secondary",
              fullWidth: true,
              className:
                "w-full border-amber-500/30 text-amber-100 hover:bg-amber-500/10",
            })}
          >
            {t.company.editShift.previewShift}
          </Link>

          <Button
            type="button"
            variant="secondary"
            fullWidth
            className="w-full border-red-500/30 text-red-200 hover:bg-red-500/10"
            disabled={isSubmitting || isDeleting}
            onClick={handleDelete}
          >
            {isDeleting ? actions.deleting : actions.deleteShift}
          </Button>
        </div>

        {errorMessage ? (
          <p className="mt-3 text-xs text-red-300">{errorMessage}</p>
        ) : null}
      </section>
    </div>
  );
}
