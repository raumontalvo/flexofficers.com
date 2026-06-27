"use client";

import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";

type ProfileWizardFooterProps = {
  isFirstStep: boolean;
  isLastStep: boolean;
  isSaving: boolean;
  onBack: () => void;
  onContinue: () => void;
  className?: string;
};

export function ProfileWizardFooter({
  isFirstStep,
  isLastStep,
  isSaving,
  onBack,
  onContinue,
  className,
}: ProfileWizardFooterProps) {
  return (
    <div
      className={cn(
        "sticky bottom-0 z-20 -mx-4 mt-4 border-t border-white/[0.08] bg-[#020617]/90 px-4 py-2.5 backdrop-blur-xl sm:-mx-5 sm:px-5 lg:-mx-7 lg:px-7",
        className
      )}
    >
      <div className="mx-auto flex max-w-4xl flex-col-reverse gap-2.5 sm:flex-row sm:items-center sm:justify-end">
        {!isFirstStep ? (
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onBack}
            disabled={isSaving}
            className="w-full sm:w-auto"
          >
            Back
          </Button>
        ) : null}

        <Button
          type="button"
          size="md"
          onClick={onContinue}
          disabled={isSaving}
          className={cn(
            "w-full sm:w-auto",
            isLastStep &&
              "!bg-emerald-600 !text-white hover:!bg-emerald-500 active:scale-[0.98]"
          )}
        >
          {isSaving
            ? "Saving..."
            : isLastStep
              ? "Save Profile"
              : "Save & Continue"}
        </Button>
      </div>
    </div>
  );
}
