export const PROFILE_WIZARD_STEPS = [
  {
    id: "basic",
    label: "Basic Info",
    icon: "👤",
    nextStepLabel: "Basic Info",
    required: true,
  },
  {
    id: "experience",
    label: "Experience",
    icon: "🛡️",
    nextStepLabel: "Security Experience",
    required: true,
  },
  {
    id: "licenses",
    label: "Licenses",
    icon: "📄",
    nextStepLabel: "Professional Licenses",
    required: true,
  },
  {
    id: "certifications",
    label: "Certifications",
    icon: "🏅",
    nextStepLabel: "Certifications",
    required: false,
  },
  {
    id: "availability",
    label: "Availability",
    icon: "📅",
    nextStepLabel: "Availability",
    required: false,
  },
] as const;

export type ProfileWizardStepId = (typeof PROFILE_WIZARD_STEPS)[number]["id"];

export type ProfileWizardStep = (typeof PROFILE_WIZARD_STEPS)[number];

export function getWizardStep(stepId: ProfileWizardStepId) {
  return PROFILE_WIZARD_STEPS.find((step) => step.id === stepId)!;
}
