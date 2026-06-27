export const PROFILE_WIZARD_STEPS = [
  { id: "basic", label: "Basic Info" },
  { id: "experience", label: "Experience" },
  { id: "licenses", label: "Licenses" },
  { id: "certifications", label: "Certifications" },
  { id: "availability", label: "Availability" },
] as const;

export type ProfileWizardStepId = (typeof PROFILE_WIZARD_STEPS)[number]["id"];
