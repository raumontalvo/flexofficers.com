import { cn } from "@/lib/cn";
import { PROFILE_WIZARD_TIPS, PROFILE_APPLY_TIP } from "./profile-wizard-tips";
import type { ProfileWizardStepId } from "./profile-wizard-steps";

type ProfileWizardTipsProps = {
  stepId: ProfileWizardStepId;
  className?: string;
  showApplyTip?: boolean;
};

export function ProfileWizardTips({
  stepId,
  className,
  showApplyTip = false,
}: ProfileWizardTipsProps) {
  const tips = PROFILE_WIZARD_TIPS[stepId];
  const items = showApplyTip ? [PROFILE_APPLY_TIP, ...tips.items] : tips.items;

  return (
    <aside
      className={cn(
        "fo-glass-card rounded-fo-card border border-white/10 p-3.5 sm:p-4",
        className
      )}
    >
      <h3 className="text-sm font-semibold text-fo-text">{tips.title}</h3>
      <ul className="mt-3 space-y-2.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-2 text-sm leading-relaxed text-fo-text-muted"
          >
            <span
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-fo-primary-bright/80"
              aria-hidden
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
