"use client";

import { cn } from "@/lib/cn";
import {
  isWizardStepComplete,
  type WizardFormSnapshot,
} from "./profile-wizard-progress";
import { PROFILE_WIZARD_STEPS } from "./profile-wizard-steps";
import { CheckIcon } from "./profile-wizard-ui";

type ProfileWizardHeaderProps = {
  currentStepIndex: number;
  completionPercent: number;
  completedSections: number;
  totalSections: number;
  nextStepLabel: string | null;
  allSectionsComplete: boolean;
  form: WizardFormSnapshot;
  onStepSelect: (index: number) => void;
};

export function ProfileWizardHeader({
  currentStepIndex,
  completionPercent,
  completedSections,
  totalSections,
  nextStepLabel,
  allSectionsComplete,
  form,
  onStepSelect,
}: ProfileWizardHeaderProps) {
  return (
    <header className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight text-fo-text sm:text-3xl">
            Officer Profile
          </h1>
          <p className="text-sm text-fo-text-muted">
            Complete your profile step by step so companies can review you.
          </p>
        </div>

        <div className="fo-glass-card w-full shrink-0 rounded-fo-card border border-sky-500/25 p-3.5 sm:max-w-sm lg:w-80">
          <p className="text-xs font-medium uppercase tracking-wide text-fo-text-muted">
            Profile Completion
          </p>
          <p className="mt-0.5 text-3xl font-bold text-fo-primary-bright">
            {completionPercent}%
          </p>
          <p className="mt-1 text-sm text-fo-text-muted">
            {completedSections} of {totalSections} sections completed
          </p>
          {!allSectionsComplete && nextStepLabel ? (
            <p className="mt-1 text-sm text-fo-text">
              <span className="text-fo-text-muted">Next step: </span>
              <span className="font-medium text-fo-primary-bright">
                {nextStepLabel}
              </span>
            </p>
          ) : allSectionsComplete ? (
            <p className="mt-1 text-sm font-medium text-emerald-400">
              All sections complete
            </p>
          ) : null}
          <div
            className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800/80"
            role="progressbar"
            aria-valuenow={completionPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Profile completion"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-fo-primary via-fo-primary-bright to-sky-400 transition-all duration-500"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>
      </div>

      <nav aria-label="Profile steps" className="w-full">
        <ol className="flex items-center">
          {PROFILE_WIZARD_STEPS.map((step, index) => {
            const isActive = index === currentStepIndex;
            const isComplete = isWizardStepComplete(step.id, form);
            const isFuture = !isActive && !isComplete;

            return (
              <li key={step.id} className="flex min-w-0 flex-1 items-center">
                <button
                  type="button"
                  onClick={() => onStepSelect(index)}
                  className="group flex min-w-0 flex-col items-center gap-1.5 px-0.5 sm:gap-2 sm:px-1"
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-base transition sm:h-10 sm:w-10",
                      isActive &&
                        "border-fo-primary-bright bg-fo-primary-bright text-white shadow-[0_0_20px_rgba(59,130,246,0.35)]",
                      isComplete &&
                        !isActive &&
                        "border-emerald-500/50 bg-emerald-500/15 text-emerald-400",
                      isFuture &&
                        "border-slate-700 bg-slate-900/60 text-slate-500 group-hover:border-slate-600"
                    )}
                  >
                    {isComplete && !isActive ? (
                      <CheckIcon className="h-4 w-4" />
                    ) : (
                      <span aria-hidden className="text-sm sm:text-base">
                        {step.icon}
                      </span>
                    )}
                  </span>
                  <span
                    className={cn(
                      "hidden max-w-[5.5rem] truncate text-center text-[11px] font-medium sm:block sm:max-w-none sm:text-xs",
                      isActive && "text-fo-primary-bright",
                      isComplete && !isActive && "text-emerald-400/90",
                      isFuture && "text-slate-500 group-hover:text-slate-400"
                    )}
                  >
                    {step.label}
                  </span>
                </button>

                {index < PROFILE_WIZARD_STEPS.length - 1 ? (
                  <div
                    className={cn(
                      "mx-0.5 h-0.5 flex-1 rounded-full sm:mx-1",
                      isWizardStepComplete(step.id, form)
                        ? "bg-emerald-500/70"
                        : "bg-slate-700/80"
                    )}
                    aria-hidden
                  />
                ) : null}
              </li>
            );
          })}
        </ol>
      </nav>
    </header>
  );
}
