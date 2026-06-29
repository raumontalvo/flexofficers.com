import type { ProfileWizardStepId } from "./profile-wizard-steps";

export type ProfileWizardTip = {
  title: string;
  items: string[];
};

export const PROFILE_APPLY_TIP =
  "Complete your profile so you can apply to shifts.";

export const PROFILE_WIZARD_TIPS: Record<ProfileWizardStepId, ProfileWizardTip> =
  {
    basic: {
      title: "Tips for a great profile",
      items: [
        "Use a clear, professional photo URL companies can recognize.",
        "Keep your phone and email current so companies can reach you.",
        "Your city helps match you with nearby shift opportunities.",
      ],
    },
    experience: {
      title: "Tips for a great profile",
      items: [
        "Select both Armed and Unarmed if you can work either assignment.",
        "Choose experience categories that reflect your real site history.",
        "Your introduction should be brief, professional, and specific.",
      ],
    },
    licenses: {
      title: "Tips for a great profile",
      items: [
        "Enter license details exactly as they appear on your credential.",
        "Add every active license you hold in each state.",
        "Companies are responsible for verifying license validity before hiring.",
      ],
    },
    certifications: {
      title: "Tips for a great profile",
      items: [
        "Only select certifications you currently hold and can document.",
        "Firearms and Taser qualifications help with armed assignments.",
        "CPR / First Aid and AED are valued across many security roles.",
      ],
    },
    availability: {
      title: "Tips for a great profile",
      items: [
        "Be honest about the schedules you can reliably work.",
        "Mixing weekday and weekend availability increases match options.",
        "Update availability whenever your schedule changes.",
      ],
    },
  };
