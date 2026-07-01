import {
  LICENSE_CERTIFICATION_ERROR,
  LICENSE_TYPE_REQUIRED_ERROR,
} from "@/lib/officer-licenses";
import {
  PROFILE_WIZARD_STEPS,
  type ProfileWizardStepId,
} from "./profile-wizard-steps";

export type WizardFormSnapshot = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  city: string;
  armedStatuses: unknown[];
  experienceYears: string;
  experienceCategories: unknown[];
  licenses: Array<{
    licenseNumber: string;
    licenseType: string;
    issuingState: string;
    expirationDate: string;
  }>;
  licenseCertificationAccepted: boolean;
  certifications: unknown[];
  availability: unknown[];
};

export function isWizardStepComplete(
  stepId: ProfileWizardStepId,
  form: WizardFormSnapshot
): boolean {
  switch (stepId) {
    case "basic":
      return (
        Boolean(form.firstName.trim()) &&
        Boolean(form.lastName.trim()) &&
        Boolean(form.phone.trim()) &&
        Boolean(form.email.trim()) &&
        Boolean(form.city.trim())
      );
    case "experience":
      return (
        form.armedStatuses.length > 0 &&
        form.experienceYears.trim() !== "" &&
        Number(form.experienceYears) >= 0 &&
        form.experienceCategories.length > 0
      );
    case "licenses":
      if (form.licenses.length === 0) {
        return false;
      }

      return (
        !form.licenses.some((license) => !license.licenseType.trim()) &&
        form.licenses.every(
          (license) =>
            license.licenseNumber.trim() &&
            license.issuingState.trim() &&
            license.expirationDate.trim()
        ) &&
        form.licenseCertificationAccepted
      );
    case "certifications":
      return form.certifications.length > 0;
    case "availability":
      return form.availability.length > 0;
    default:
      return false;
  }
}

export function getWizardSectionProgress(form: WizardFormSnapshot) {
  const completedCount = PROFILE_WIZARD_STEPS.filter((step) =>
    isWizardStepComplete(step.id, form)
  ).length;

  const nextStep = PROFILE_WIZARD_STEPS.find(
    (step) => !isWizardStepComplete(step.id, form)
  );

  return {
    completedCount,
    totalCount: PROFILE_WIZARD_STEPS.length,
    nextStepId: nextStep?.id ?? null,
    allComplete: completedCount === PROFILE_WIZARD_STEPS.length,
  };
}

export function validateWizardStep(
  stepId: ProfileWizardStepId,
  form: WizardFormSnapshot
): string | null {
  switch (stepId) {
    case "basic":
      if (!form.firstName.trim()) return "First name is required.";
      if (!form.lastName.trim()) return "Last name is required.";
      if (!form.phone.trim()) return "Phone number is required.";
      if (!form.email.trim()) return "Email is required.";
      if (!form.city.trim()) return "City is required.";
      return null;
    case "experience":
      if (form.armedStatuses.length === 0) {
        return "Select at least one armed status option.";
      }
      if (!form.experienceYears.trim()) {
        return "Years of experience is required.";
      }
      if (Number(form.experienceYears) < 0) {
        return "Years of experience must be zero or greater.";
      }
      if (form.experienceCategories.length === 0) {
        return "Select at least one experience category.";
      }
      return null;
    case "licenses": {
      if (
        form.licenses.some(
          (license) =>
            !license.licenseType.trim() || license.licenseType === "Other"
        )
      ) {
        return LICENSE_TYPE_REQUIRED_ERROR;
      }
      for (const license of form.licenses) {
        if (!license.licenseNumber.trim()) {
          return "Every license must include a license number.";
        }
        if (!license.issuingState.trim()) {
          return "Every license must include an issuing state.";
        }
        if (!license.expirationDate.trim()) {
          return "Every license must include an expiration date.";
        }
      }
      if (!form.licenseCertificationAccepted) {
        return LICENSE_CERTIFICATION_ERROR;
      }
      return null;
    }
    case "certifications":
    case "availability":
      return null;
    default:
      return null;
  }
}
