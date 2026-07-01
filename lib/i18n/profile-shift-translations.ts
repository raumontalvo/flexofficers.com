export type ProfileShiftTranslations = {
  profileWizard: {
    header: {
      sectionsCompleted: string;
      nextStep: string;
      allSectionsComplete: string;
      profileCompletionAria: string;
      stepsNavAria: string;
    };
    steps: {
      basic: { label: string; nextStepLabel: string };
      experience: { label: string; nextStepLabel: string };
      licenses: { label: string; nextStepLabel: string };
      certifications: { label: string; nextStepLabel: string };
      availability: { label: string; nextStepLabel: string };
    };
    descriptions: {
      basic: string;
      experience: string;
      licenses: string;
      certifications: string;
      availability: string;
    };
    footer: {
      back: string;
      uploading: string;
      saving: string;
      saveProfile: string;
      saveContinue: string;
    };
    badge: { required: string; optional: string };
    success: {
      title: string;
      subtitle: string;
      nextStepsTitle: string;
      stepBrowse: string;
      stepApply: string;
      stepLicenses: string;
      dashboard: string;
      browseShifts: string;
    };
    tips: {
      title: string;
      applyTip: string;
      basic: readonly string[];
      experience: readonly string[];
      licenses: readonly string[];
      certifications: readonly string[];
      availability: readonly string[];
    };
    form: {
      firstName: string;
      lastName: string;
      phone: string;
      email: string;
      city: string;
      armedStatus: string;
      armedDescription: string;
      experienceYears: string;
      experienceCategories: string;
      experienceCategoriesDescription: string;
      introduction: string;
      introductionPlaceholder: string;
      certificationsTitle: string;
      certificationsDescription: string;
      customCertification: string;
      customCertificationPlaceholder: string;
      availabilityLabel: string;
      availabilityDescription: string;
      availabilitySummary: string;
      availabilityEmpty: string;
      licenseHelper: string;
      addLicense: string;
      licenseType: string;
      selectType: string;
      customLicenseType: string;
      customLicensePlaceholder: string;
      state: string;
      number: string;
      expiration: string;
      licenseNumberPlaceholder: string;
      remove: string;
      certLabel: string;
      certHelper: string;
      savePhotoFailed: string;
      saveFailed: string;
    };
    validation: {
      firstNameRequired: string;
      lastNameRequired: string;
      phoneRequired: string;
      emailRequired: string;
      cityRequired: string;
      armedRequired: string;
      experienceYearsRequired: string;
      experienceYearsMin: string;
      experienceCategoryRequired: string;
      licenseNumberRequired: string;
      licenseStateRequired: string;
      licenseExpirationRequired: string;
      licenseTypeRequired: string;
      licenseCertRequired: string;
    };
    options: {
      armed: { ARMED: string; UNARMED: string };
      availability: Record<string, string>;
      experienceCategories: Record<string, string>;
      certifications: Record<string, string>;
    };
  };
  shiftForm: {
    sections: {
      shiftDetails: string;
      dateTime: string;
      location: string;
      payRequirements: string;
      basics: string;
      basicsDescription: string;
      locationHelp: string;
      payStaffing: string;
      payStaffingDescription: string;
      schedule: string;
      scheduleDescription: string;
      armed: string;
      armedDescription: string;
      requirements: string;
      requirementsDescription: string;
      instructions: string;
      instructionsDescription: string;
    };
    fields: {
      shiftTitle: string;
      typeOfPost: string;
      description: string;
      startDate: string;
      startTime: string;
      endTime: string;
      locationName: string;
      address: string;
      city: string;
      state: string;
      zipCode: string;
      payRate: string;
      currency: string;
      openPositions: string;
      licenseRequirements: string;
      certifications: string;
      otherRequirements: string;
      reportingInstructions: string;
      workType: string;
      shiftTimeType: string;
      armedRequirement: string;
      hourlyRate: string;
      officersNeeded: string;
      addressSite: string;
    };
    placeholders: {
      shiftTitle: string;
      shiftTitleExample: string;
      description: string;
      descriptionLong: string;
      descriptionDuties: string;
      city: string;
      enterCity: string;
      selectState: string;
      selectWorkType: string;
      selectShiftTime: string;
      selectArmed: string;
      streetAddress: string;
      locationName: string;
      address: string;
      zipCode: string;
      minPay: string;
      selectDate: string;
      selectTime: string;
      selectPostType: string;
      otherRequirements: string;
      otherRequirementsPost: string;
      reporting: string;
      customCertification: string;
      customCertificationPlaceholder: string;
    };
    hints: {
      shiftDetails: string;
      licenseRequirements: string;
      certificationRequirements: string;
    };
    recurring: {
      title: string;
      description: string;
    };
    select: {
      workType: string;
      shiftTime: string;
      armed: string;
    };
    actions: {
      decreasePositions: string;
      increasePositions: string;
      postShift: string;
      posting: string;
      updateShift: string;
      updating: string;
      deleteShift: string;
      deleting: string;
      deleteConfirm: string;
      deleteFailed: string;
      createFailed: string;
      createFailedFields: string;
    };
    summary: {
      title: string;
      typeOfPost: string;
      dateTime: string;
      location: string;
      payRate: string;
      licenseRequired: string;
      certificationRequired: string;
      certifications: string;
      openPositions: string;
      description: string;
      visibility: string;
      visibilityQuestion: string;
      publicTitle: string;
      publicDescription: string;
      privateTitle: string;
      privateDescription: string;
      selected: string;
      notSet: string;
      tipsTitle: string;
      tips: readonly string[];
    };
    errors: Record<string, never>;
  };
  acceptedShifts: {
    card: {
      confirmed: string;
      completed: string;
      cancelled: string;
      viewShift: string;
      cancel: string;
      completedOn: string;
      removeFromList: string;
      removeConfirm: string;
      companyContact: string;
      phoneNotProvided: string;
      emailNotProvided: string;
      estAbbrev: string;
      estEarnings: string;
      estEarningsUnavailable: string;
    };
  };
  company: {
    shared: {
      close: string;
      licenseDisclaimer: string;
      openPositions: string;
      pay: string;
      date: string;
      time: string;
      location: string;
      status: string;
      shift: string;
      total: string;
      pending: string;
      accepted: string;
      rejected: string;
    };
    review: {
      title: string;
      closeAria: string;
      officerProfile: string;
      officerProfileHint: string;
      appliedShift: string;
      shiftDetails: string;
      applicantsOverview: string;
      name: string;
      email: string;
      phone: string;
      cityState: string;
      yearsOfExperience: string;
      armedUnarmed: string;
      experienceCategories: string;
      introduction: string;
      licensesSubmitted: string;
      licenseNumber: string;
      issuingState: string;
      expirationDate: string;
      certifications: string;
      availability: string;
      shiftTitle: string;
      shiftStatus: string;
      payRate: string;
      workType: string;
      requiredLicenses: string;
      requiredCertifications: string;
      otherRequirements: string;
      acceptApplicant: string;
      rejectApplicant: string;
      updating: string;
      updateFailed: string;
      backToShifts: string;
      experience: string;
      licenses: string;
      basicInformation: string;
      closeOfficerProfileAria: string;
    };
    applicantsSummary: {
      selectHint: string;
      shiftDetails: string;
      applicantsOverview: string;
    };
    officers: {
      inviteSent: string;
      searchByNameOrCity: string;
      filters: string;
      firstName: string;
      lastName: string;
      city: string;
      state: string;
      search: string;
      clearFilters: string;
      moreFilters: string;
      background: string;
      licenseTypes: string;
      certifications: string;
      availability: string;
      noOfficersFound: string;
      tryAnotherCity: string;
      officersFoundOne: string;
      officersFoundMany: string;
      sort: string;
      sortBy: string;
      alphabetical: string;
      mostExperience: string;
      newest: string;
      officerFallback: string;
    };
    addToStaff: {
      add: string;
      adding: string;
      remove: string;
      removing: string;
      updateFailed: string;
    };
    statusButtons: {
      accept: string;
      reject: string;
      acceptedAlert: string;
      rejectedAlert: string;
      updateFailed: string;
    };
    editShift: {
      previewShift: string;
    };
    invite: {
      closeAria: string;
      title: string;
      noOpenShifts: string;
      postBeforeInvite: string;
      postShift: string;
      cancel: string;
      selectOpenShift: string;
      openShifts: string;
      messageLabel: string;
      messagePlaceholder: string;
      inviteSentSuffix: string;
      staffOnlySuffix: string;
      pendingInvite: string;
      alreadyAssigned: string;
      alreadyAccepted: string;
      sendInvite: string;
      sending: string;
      sendFailed: string;
    };
  };
};

const experienceCategoryKeys = [
  "Retail Security",
  "Event Security",
  "Construction Site Security",
  "Residential Security",
  "Corporate Office Security",
  "Warehouse Security",
  "Hospital Security",
  "School Security",
  "Night Patrol",
  "Access Control",
  "CCTV / Monitoring",
  "Crowd Control",
  "Executive Protection",
  "K9 Security",
  "Military",
  "Law Enforcement",
  "Corrections / Prison Guard",
] as const;

const availabilityKeys = [
  "Weekdays",
  "Weekends",
  "Day Shift",
  "Night Shift",
  "Overnight",
  "On-Call",
  "Full-Time",
  "Part-Time",
] as const;

const certificationKeys = [
  "CPR / First Aid",
  "AED",
  "Baton Certification",
  "OC / Pepper Spray",
  "Handcuffing",
  "Firearms Qualification",
  "Taser",
  "ASP / Expandable Baton",
] as const;

export const profileShiftEn: ProfileShiftTranslations = {
  profileWizard: {
    header: {
      sectionsCompleted: "{completed} of {total} sections completed",
      nextStep: "Next step:",
      allSectionsComplete: "All sections complete",
      profileCompletionAria: "Profile completion",
      stepsNavAria: "Profile steps",
    },
    steps: {
      basic: { label: "Basic Info", nextStepLabel: "Basic Info" },
      experience: { label: "Experience", nextStepLabel: "Security Experience" },
      licenses: { label: "Licenses", nextStepLabel: "Professional Licenses" },
      certifications: { label: "Certifications", nextStepLabel: "Certifications" },
      availability: { label: "Availability", nextStepLabel: "Availability" },
    },
    descriptions: {
      basic: "Add a photo and contact details companies may review.",
      experience: "Help companies understand your background and credentials.",
      licenses: "At least one license is required to complete your profile.",
      certifications: "Select any certifications you currently hold.",
      availability: "Choose the schedules that fit you best.",
    },
    footer: {
      back: "Back",
      uploading: "Uploading...",
      saving: "Saving...",
      saveProfile: "Save Profile",
      saveContinue: "Save & Continue",
    },
    badge: { required: "Required", optional: "Optional" },
    success: {
      title: "Profile Complete",
      subtitle: "Your profile is now ready for companies to review.",
      nextStepsTitle: "Next steps",
      stepBrowse: "Browse available shifts",
      stepApply: "Apply to shifts",
      stepLicenses: "Keep licenses up to date",
      dashboard: "Go to Dashboard",
      browseShifts: "Browse Shifts",
    },
    tips: {
      title: "Tips for a great profile",
      applyTip: "Complete your profile so you can apply to shifts.",
      basic: [
        "Use a clear, professional photo URL companies can recognize.",
        "Keep your phone and email current so companies can reach you.",
        "Your city helps match you with nearby shift opportunities.",
      ],
      experience: [
        "Select both Armed and Unarmed if you can work either assignment.",
        "Choose experience categories that reflect your real site history.",
        "Your introduction should be brief, professional, and specific.",
      ],
      licenses: [
        "Enter license details exactly as they appear on your credential.",
        "Add every active license you hold in each state.",
        "Companies are responsible for verifying license validity before hiring.",
      ],
      certifications: [
        "Only select certifications you currently hold and can document.",
        "Firearms and Taser qualifications help with armed assignments.",
        "CPR / First Aid and AED are valued across many security roles.",
      ],
      availability: [
        "Be honest about the schedules you can reliably work.",
        "Mixing weekday and weekend availability increases match options.",
        "Update availability whenever your schedule changes.",
      ],
    },
    form: {
      firstName: "First name",
      lastName: "Last name",
      phone: "Phone",
      email: "Email",
      city: "City",
      armedStatus: "Armed status",
      armedDescription:
        "Select all that apply. Choose both if you can work armed and unarmed assignments.",
      experienceYears: "Years of experience",
      experienceCategories: "Experience categories",
      experienceCategoriesDescription:
        "Highlight the types of sites and assignments you know best.",
      introduction: "Short introduction",
      introductionPlaceholder:
        "Tell companies about your experience, reliability, and the shifts you prefer.",
      certificationsTitle: "Your certifications",
      certificationsDescription:
        "Select any certifications you currently hold, or add your own.",
      customCertification: "Add your own certification",
      customCertificationPlaceholder: "e.g. De-escalation Training",
      availabilityLabel: "When can you work?",
      availabilityDescription: "Tap the times and schedules that fit you.",
      availabilitySummary: "Availability summary",
      availabilityEmpty:
        "No availability selected yet. Choose the schedules that fit you.",
      licenseHelper:
        "Add your professional security license information. Companies may use this information to review your eligibility.",
      addLicense: "Add Another License",
      licenseType: "License type",
      selectType: "Select type",
      customLicenseType: "Custom license type",
      customLicensePlaceholder: "Enter your license type",
      state: "State",
      number: "Number",
      expiration: "Expiration",
      licenseNumberPlaceholder: "License number",
      remove: "Remove",
      certLabel:
        "I certify that the professional license information I have provided is accurate and up to date.",
      certHelper:
        "Companies are responsible for verifying license validity before hiring or assigning work.",
      savePhotoFailed: "Failed to save profile photo",
      saveFailed: "Failed to save officer profile",
    },
    validation: {
      firstNameRequired: "First name is required.",
      lastNameRequired: "Last name is required.",
      phoneRequired: "Phone number is required.",
      emailRequired: "Email is required.",
      cityRequired: "City is required.",
      armedRequired: "Select at least one armed status option.",
      experienceYearsRequired: "Years of experience is required.",
      experienceYearsMin: "Years of experience must be zero or greater.",
      experienceCategoryRequired: "Select at least one experience category.",
      licenseNumberRequired: "Every license must include a license number.",
      licenseStateRequired: "Every license must include an issuing state.",
      licenseExpirationRequired: "Every license must include an expiration date.",
      licenseTypeRequired: "Select a license type for every license before saving.",
      licenseCertRequired:
        "You must certify that your license information is accurate before saving.",
    },
    options: {
      armed: { ARMED: "Armed", UNARMED: "Unarmed" },
      availability: Object.fromEntries(availabilityKeys.map((k) => [k, k])),
      experienceCategories: Object.fromEntries(
        experienceCategoryKeys.map((k) => [k, k])
      ),
      certifications: Object.fromEntries(certificationKeys.map((k) => [k, k])),
    },
  },
  shiftForm: {
    sections: {
      shiftDetails: "Shift Details",
      dateTime: "Date & Time",
      location: "Location",
      payRequirements: "Pay & Requirements",
      basics: "Shift basics",
      basicsDescription: "Give officers a clear title and overview of the assignment.",
      locationHelp: "City and state help officers find shifts near them.",
      payStaffing: "Pay & staffing",
      payStaffingDescription: "Set hourly pay and how many officers you need.",
      schedule: "Schedule",
      scheduleDescription: "When the shift runs.",
      armed: "Armed status",
      armedDescription: "What armed status is required for this shift?",
      requirements: "Requirements",
      requirementsDescription: "Select certifications and add any other requirements.",
      instructions: "Accepted officer instructions",
      instructionsDescription: "Reporting details shown only to accepted officers.",
    },
    fields: {
      shiftTitle: "Shift Title",
      typeOfPost: "Type of Post",
      description: "Description",
      startDate: "Start Date",
      startTime: "Start time",
      endTime: "End time",
      locationName: "Location Name",
      address: "Address",
      city: "City",
      state: "State",
      zipCode: "Zip Code",
      payRate: "Pay Rate",
      currency: "Currency",
      openPositions: "Open Positions",
      licenseRequirements: "License Requirements",
      certifications: "Certifications",
      otherRequirements: "Other Requirements",
      reportingInstructions: "Reporting instructions",
      workType: "Work type",
      shiftTimeType: "Shift time type",
      armedRequirement: "Armed requirement",
      hourlyRate: "Pay (hourly rate)",
      officersNeeded: "Officers needed",
      addressSite: "Address / site",
    },
    placeholders: {
      shiftTitle: "Shift title",
      shiftTitleExample: "e.g. Mall Security Officer",
      description: "Description",
      descriptionLong:
        "Add any important details about the shift, duties, or requirements...",
      descriptionDuties: "Describe duties, site details, and expectations.",
      city: "City",
      enterCity: "Enter city",
      selectState: "Select state",
      selectWorkType: "Select work type",
      selectShiftTime: "Select shift time",
      selectArmed: "Select armed status",
      streetAddress: "Street address",
      locationName: "e.g. Gulf Coast Town Center",
      address: "Street address",
      zipCode: "Zip code",
      minPay: "Min $/hr",
      selectDate: "Select date",
      selectTime: "Select time",
      selectPostType: "Select type of post",
      otherRequirements: "e.g. Age 21+, valid guard card, site-specific training",
      otherRequirementsPost: "e.g. 2+ years experience, customer service, etc.",
      reporting: "Check-in location, contact on arrival, uniform notes...",
      customCertification: "Add a custom certification",
      customCertificationPlaceholder: "e.g. De-escalation Training",
    },
    hints: {
      shiftDetails:
        "A clear title helps officers know what to expect. Include parking info, dress code, specific instructions, etc.",
      licenseRequirements: "Select one or more license types required for this shift.",
      certificationRequirements:
        "Select one or more certifications required for this shift.",
    },
    recurring: {
      title: "Recurring Shift",
      description: "This shift repeats on specific days. Coming soon.",
    },
    select: {
      workType: "Select work type",
      shiftTime: "Select shift time",
      armed: "Select armed status",
    },
    actions: {
      decreasePositions: "Decrease open positions",
      increasePositions: "Increase open positions",
      postShift: "Post Shift",
      posting: "Posting...",
      updateShift: "Update Shift",
      updating: "Updating...",
      deleteShift: "Delete Shift",
      deleting: "Deleting...",
      deleteConfirm: "Are you sure you want to delete this shift? This cannot be undone.",
      deleteFailed: "Failed to delete shift",
      createFailed: "Failed to create shift.",
      createFailedFields: "Failed to create shift. Check required fields.",
    },
    summary: {
      title: "Shift Summary",
      typeOfPost: "Type of Post",
      dateTime: "Date & Time",
      location: "Location",
      payRate: "Pay Rate",
      licenseRequired: "License Required",
      certificationRequired: "Certification Required",
      certifications: "Certifications",
      openPositions: "Open Positions",
      description: "Description",
      visibility: "Visibility",
      visibilityQuestion: "Who can see this shift?",
      publicTitle: "Public post shift",
      publicDescription: "Listed in Browse Shifts for all security officers.",
      privateTitle: "Private post for staff",
      privateDescription:
        "Hidden from public browse. Invite officers from your Staff roster.",
      selected: "Selected: {value}",
      notSet: "Not set",
      tipsTitle: "Tips for a Successful Post",
      tips: [
        "Be specific in your description",
        "Include parking and entry instructions",
        "Set a competitive pay rate",
        "Post early for better visibility",
      ],
    },
    errors: {},
  },
  acceptedShifts: {
    card: {
      confirmed: "CONFIRMED",
      completed: "COMPLETED",
      cancelled: "CANCELLED",
      viewShift: "View Shift",
      cancel: "Cancel",
      completedOn: "Completed on",
      removeFromList: "Remove from List",
      removeConfirm:
        "Remove this assignment from your list? This only hides it from your view.",
      companyContact: "Company contact",
      phoneNotProvided: "Phone not provided",
      emailNotProvided: "Email not provided",
      estAbbrev: "Est. {pay}",
      estEarnings: "Est. earnings {pay}",
      estEarningsUnavailable: "Estimated earnings unavailable",
    },
  },
  company: {
    shared: {
      close: "Close",
      licenseDisclaimer:
        "FlexOfficers displays license information provided by the officer. Companies are responsible for verifying license validity before hiring or assigning work.",
      openPositions: "Open Positions",
      pay: "Pay",
      date: "Date",
      time: "Time",
      location: "Location",
      status: "Status",
      shift: "Shift",
      total: "Total",
      pending: "Pending",
      accepted: "Accepted",
      rejected: "Rejected",
    },
    review: {
      title: "Applicant Review",
      closeAria: "Close applicant review panel",
      officerProfile: "Officer Profile",
      officerProfileHint: "Self-reported information submitted by the officer.",
      appliedShift: "Applied Shift",
      shiftDetails: "Shift Details",
      applicantsOverview: "Applicants Overview",
      name: "Name",
      email: "Email",
      phone: "Phone",
      cityState: "City, State",
      yearsOfExperience: "Years of Experience",
      armedUnarmed: "Armed / Unarmed",
      experienceCategories: "Experience Categories",
      introduction: "Introduction",
      licensesSubmitted: "Licenses Submitted",
      licenseNumber: "License Number",
      issuingState: "Issuing State",
      expirationDate: "Expiration Date",
      certifications: "Certifications",
      availability: "Availability",
      shiftTitle: "Shift Title",
      shiftStatus: "Shift Status",
      payRate: "Pay Rate",
      workType: "Work Type",
      requiredLicenses: "Required Licenses",
      requiredCertifications: "Required Certifications",
      otherRequirements: "Other Requirements",
      acceptApplicant: "Accept Applicant",
      rejectApplicant: "Reject Applicant",
      updating: "Updating...",
      updateFailed: "Failed to update applicant",
      backToShifts: "Back to My Shifts",
      experience: "Experience",
      licenses: "Licenses",
      basicInformation: "Basic Information",
      closeOfficerProfileAria: "Close officer profile panel",
    },
    applicantsSummary: {
      selectHint: "Select an applicant to view shift details.",
      shiftDetails: "Shift Details",
      applicantsOverview: "Applicants Overview",
    },
    officers: {
      inviteSent: "Invite sent",
      searchByNameOrCity: "Search by name or city",
      filters: "Filters",
      firstName: "First name",
      lastName: "Last name",
      city: "City",
      state: "State",
      search: "Search",
      clearFilters: "Clear Filters",
      moreFilters: "More Filters",
      background: "Background",
      licenseTypes: "License Types",
      certifications: "Certifications",
      availability: "Availability",
      noOfficersFound: "No officers found.",
      tryAnotherCity: "Try another city or adjust your filters.",
      officersFoundOne: "1 officer found",
      officersFoundMany: "{count} officers found",
      sort: "Sort:",
      sortBy: "Sort By",
      alphabetical: "Alphabetical",
      mostExperience: "Most Experience",
      newest: "Newest",
      officerFallback: "Officer",
    },
    addToStaff: {
      add: "Add to Staff",
      adding: "Adding...",
      remove: "Remove Staff",
      removing: "Removing...",
      updateFailed: "Failed to update staff.",
    },
    statusButtons: {
      accept: "Accept",
      reject: "Reject",
      acceptedAlert: "Applicant accepted!",
      rejectedAlert: "Applicant rejected!",
      updateFailed: "Failed to update applicant",
    },
    editShift: {
      previewShift: "Preview Shift",
    },
    invite: {
      closeAria: "Close invite officer modal",
      title: "Invite Officer",
      noOpenShifts: "Invite Officer",
      postBeforeInvite: "Post an open shift before inviting {name}.",
      postShift: "Post a Shift",
      cancel: "Cancel",
      selectOpenShift: "Select one of your open shifts.",
      openShifts: "Open Shifts",
      messageLabel: "Add a short message (optional)",
      messagePlaceholder: "Let the officer know why this shift is a good fit.",
      inviteSentSuffix: " · Invite sent",
      staffOnlySuffix: " · Staff only",
      pendingInvite:
        "This officer already has a pending invite for the selected shift.",
      alreadyAssigned: "This officer is already assigned to the selected shift.",
      alreadyAccepted:
        "This officer already accepted an invite for the selected shift.",
      sendInvite: "Send Invite",
      sending: "Sending...",
      sendFailed: "Failed to send invite.",
    },
  },
};

export const profileShiftEs: ProfileShiftTranslations = {
  profileWizard: {
    header: {
      sectionsCompleted: "{completed} de {total} secciones completadas",
      nextStep: "Siguiente paso:",
      allSectionsComplete: "Todas las secciones completadas",
      profileCompletionAria: "Completitud del perfil",
      stepsNavAria: "Pasos del perfil",
    },
    steps: {
      basic: { label: "Info Básica", nextStepLabel: "Info Básica" },
      experience: { label: "Experiencia", nextStepLabel: "Experiencia en Seguridad" },
      licenses: { label: "Licencias", nextStepLabel: "Licencias Profesionales" },
      certifications: { label: "Certificaciones", nextStepLabel: "Certificaciones" },
      availability: { label: "Disponibilidad", nextStepLabel: "Disponibilidad" },
    },
    descriptions: {
      basic: "Agrega una foto y datos de contacto que las empresas puedan revisar.",
      experience: "Ayuda a las empresas a entender tu experiencia y credenciales.",
      licenses: "Se requiere al menos una licencia para completar tu perfil.",
      certifications: "Selecciona las certificaciones que posees actualmente.",
      availability: "Elige los horarios que mejor se adapten a ti.",
    },
    footer: {
      back: "Atrás",
      uploading: "Subiendo...",
      saving: "Guardando...",
      saveProfile: "Guardar Perfil",
      saveContinue: "Guardar y Continuar",
    },
    badge: { required: "Obligatorio", optional: "Opcional" },
    success: {
      title: "Perfil Completo",
      subtitle: "Tu perfil está listo para que las empresas lo revisen.",
      nextStepsTitle: "Próximos pasos",
      stepBrowse: "Explorar turnos disponibles",
      stepApply: "Solicitar turnos",
      stepLicenses: "Mantén tus licencias actualizadas",
      dashboard: "Ir al Panel",
      browseShifts: "Explorar Turnos",
    },
    tips: {
      title: "Consejos para un gran perfil",
      applyTip: "Completa tu perfil para poder solicitar turnos.",
      basic: [
        "Usa una foto clara y profesional que las empresas puedan reconocer.",
        "Mantén tu teléfono y correo actualizados para que las empresas te contacten.",
        "Tu ciudad ayuda a encontrarte turnos cercanos.",
      ],
      experience: [
        "Selecciona Armado y Desarmado si puedes trabajar en ambos tipos de asignación.",
        "Elige categorías de experiencia que reflejen tu historial real.",
        "Tu introducción debe ser breve, profesional y específica.",
      ],
      licenses: [
        "Ingresa los datos de la licencia exactamente como aparecen en tu credencial.",
        "Agrega cada licencia activa que tengas en cada estado.",
        "Las empresas son responsables de verificar la validez de las licencias antes de contratar.",
      ],
      certifications: [
        "Solo selecciona certificaciones que poseas actualmente y puedas documentar.",
        "Las calificaciones de armas de fuego y Taser ayudan en asignaciones armadas.",
        "RCP / Primeros Auxilios y DEA son valorados en muchos roles de seguridad.",
      ],
      availability: [
        "Sé honesto sobre los horarios en los que puedes trabajar de forma confiable.",
        "Combinar disponibilidad entre semana y fines de semana aumenta las opciones.",
        "Actualiza tu disponibilidad cuando cambie tu horario.",
      ],
    },
    form: {
      firstName: "Nombre",
      lastName: "Apellido",
      phone: "Teléfono",
      email: "Correo",
      city: "Ciudad",
      armedStatus: "Estado armado",
      armedDescription:
        "Selecciona todos los que apliquen. Elige ambos si puedes trabajar asignaciones armadas y desarmadas.",
      experienceYears: "Años de experiencia",
      experienceCategories: "Categorías de experiencia",
      experienceCategoriesDescription:
        "Destaca los tipos de sitios y asignaciones que mejor conoces.",
      introduction: "Breve introducción",
      introductionPlaceholder:
        "Cuéntales a las empresas sobre tu experiencia, confiabilidad y los turnos que prefieres.",
      certificationsTitle: "Tus certificaciones",
      certificationsDescription:
        "Selecciona las certificaciones que posees actualmente o agrega las tuyas.",
      customCertification: "Agregar certificación propia",
      customCertificationPlaceholder: "ej. Entrenamiento en desescalada",
      availabilityLabel: "¿Cuándo puedes trabajar?",
      availabilityDescription: "Toca los horarios y turnos que te convengan.",
      availabilitySummary: "Resumen de disponibilidad",
      availabilityEmpty:
        "Aún no hay disponibilidad seleccionada. Elige los horarios que te convengan.",
      licenseHelper:
        "Agrega la información de tu licencia profesional de seguridad. Las empresas pueden usarla para revisar tu elegibilidad.",
      addLicense: "Agregar Otra Licencia",
      licenseType: "Tipo de licencia",
      selectType: "Seleccionar tipo",
      customLicenseType: "Tipo de licencia personalizado",
      customLicensePlaceholder: "Ingresa tu tipo de licencia",
      state: "Estado",
      number: "Número",
      expiration: "Vencimiento",
      licenseNumberPlaceholder: "Número de licencia",
      remove: "Eliminar",
      certLabel:
        "Certifico que la información de licencia profesional que he proporcionado es precisa y está actualizada.",
      certHelper:
        "Las empresas son responsables de verificar la validez de las licencias antes de contratar o asignar trabajo.",
      savePhotoFailed: "No se pudo guardar la foto de perfil",
      saveFailed: "No se pudo guardar el perfil del oficial",
    },
    validation: {
      firstNameRequired: "El nombre es obligatorio.",
      lastNameRequired: "El apellido es obligatorio.",
      phoneRequired: "El número de teléfono es obligatorio.",
      emailRequired: "El correo es obligatorio.",
      cityRequired: "La ciudad es obligatoria.",
      armedRequired: "Selecciona al menos una opción de estado armado.",
      experienceYearsRequired: "Los años de experiencia son obligatorios.",
      experienceYearsMin: "Los años de experiencia deben ser cero o mayor.",
      experienceCategoryRequired: "Selecciona al menos una categoría de experiencia.",
      licenseNumberRequired: "Cada licencia debe incluir un número de licencia.",
      licenseStateRequired: "Cada licencia debe incluir un estado emisor.",
      licenseExpirationRequired: "Cada licencia debe incluir una fecha de vencimiento.",
      licenseTypeRequired: "Selecciona un tipo de licencia para cada licencia antes de guardar.",
      licenseCertRequired:
        "Debes certificar que tu información de licencia es precisa antes de guardar.",
    },
    options: {
      armed: { ARMED: "Armado", UNARMED: "Desarmado" },
      availability: {
        Weekdays: "Entre semana",
        Weekends: "Fines de semana",
        "Day Shift": "Turno de día",
        "Night Shift": "Turno de noche",
        Overnight: "Nocturno",
        "On-Call": "Disponible bajo llamado",
        "Full-Time": "Tiempo completo",
        "Part-Time": "Medio tiempo",
      },
      experienceCategories: {
        "Retail Security": "Seguridad en Retail",
        "Event Security": "Seguridad en Eventos",
        "Construction Site Security": "Seguridad en Obras",
        "Residential Security": "Seguridad Residencial",
        "Corporate Office Security": "Seguridad en Oficinas Corporativas",
        "Warehouse Security": "Seguridad en Almacenes",
        "Hospital Security": "Seguridad Hospitalaria",
        "School Security": "Seguridad Escolar",
        "Night Patrol": "Patrulla Nocturna",
        "Access Control": "Control de Acceso",
        "CCTV / Monitoring": "CCTV / Monitoreo",
        "Crowd Control": "Control de Multitudes",
        "Executive Protection": "Protección Ejecutiva",
        "K9 Security": "Seguridad K9",
        Military: "Militar",
        "Law Enforcement": "Aplicación de la Ley",
        "Corrections / Prison Guard": "Correcciones / Guardia Penitenciario",
      },
      certifications: {
        "CPR / First Aid": "RCP / Primeros Auxilios",
        AED: "DEA",
        "Baton Certification": "Certificación de Porra",
        "OC / Pepper Spray": "Gas Pimienta / OC",
        Handcuffing: "Uso de Esposas",
        "Firearms Qualification": "Calificación de Armas de Fuego",
        Taser: "Taser",
        "ASP / Expandable Baton": "Porra Expandible / ASP",
      },
    },
  },
  shiftForm: {
    sections: {
      shiftDetails: "Detalles del Turno",
      dateTime: "Fecha y Hora",
      location: "Ubicación",
      payRequirements: "Pago y Requisitos",
      basics: "Datos básicos del turno",
      basicsDescription: "Da a los oficiales un título claro y una descripción general.",
      locationHelp: "La ciudad y el estado ayudan a los oficiales a encontrar turnos cercanos.",
      payStaffing: "Pago y personal",
      payStaffingDescription: "Establece el pago por hora y cuántos oficiales necesitas.",
      schedule: "Horario",
      scheduleDescription: "Cuándo se realiza el turno.",
      armed: "Estado armado",
      armedDescription: "¿Qué estado armado se requiere para este turno?",
      requirements: "Requisitos",
      requirementsDescription: "Selecciona certificaciones y agrega otros requisitos.",
      instructions: "Instrucciones para oficiales aceptados",
      instructionsDescription: "Detalles de reporte visibles solo para oficiales aceptados.",
    },
    fields: {
      shiftTitle: "Título del Turno",
      typeOfPost: "Tipo de Publicación",
      description: "Descripción",
      startDate: "Fecha de Inicio",
      startTime: "Hora de inicio",
      endTime: "Hora de fin",
      locationName: "Nombre del Lugar",
      address: "Dirección",
      city: "Ciudad",
      state: "Estado",
      zipCode: "Código Postal",
      payRate: "Tarifa de Pago",
      currency: "Moneda",
      openPositions: "Posiciones Abiertas",
      licenseRequirements: "Requisitos de Licencia",
      certifications: "Certificaciones",
      otherRequirements: "Otros Requisitos",
      reportingInstructions: "Instrucciones de reporte",
      workType: "Tipo de trabajo",
      shiftTimeType: "Tipo de turno",
      armedRequirement: "Requisito armado",
      hourlyRate: "Pago (tarifa por hora)",
      officersNeeded: "Oficiales necesarios",
      addressSite: "Dirección / sitio",
    },
    placeholders: {
      shiftTitle: "Título del turno",
      shiftTitleExample: "ej. Oficial de Seguridad en Centro Comercial",
      description: "Descripción",
      descriptionLong:
        "Agrega detalles importantes sobre el turno, deberes o requisitos...",
      descriptionDuties: "Describe deberes, detalles del sitio y expectativas.",
      city: "Ciudad",
      enterCity: "Ingresa la ciudad",
      selectState: "Seleccionar estado",
      selectWorkType: "Seleccionar tipo de trabajo",
      selectShiftTime: "Seleccionar horario del turno",
      selectArmed: "Seleccionar estado armado",
      streetAddress: "Dirección",
      locationName: "ej. Gulf Coast Town Center",
      address: "Dirección",
      zipCode: "Código postal",
      minPay: "Mín $/hr",
      selectDate: "Seleccionar fecha",
      selectTime: "Seleccionar hora",
      selectPostType: "Seleccionar tipo de publicación",
      otherRequirements: "ej. Mayor de 21, tarjeta de guardia válida, capacitación del sitio",
      otherRequirementsPost: "ej. 2+ años de experiencia, servicio al cliente, etc.",
      reporting: "Lugar de check-in, contacto al llegar, notas de uniforme...",
      customCertification: "Agregar certificación personalizada",
      customCertificationPlaceholder: "ej. Entrenamiento en desescalada",
    },
    hints: {
      shiftDetails:
        "Un título claro ayuda a los oficiales a saber qué esperar. Incluye estacionamiento, código de vestimenta, instrucciones específicas, etc.",
      licenseRequirements: "Selecciona uno o más tipos de licencia requeridos para este turno.",
      certificationRequirements:
        "Selecciona una o más certificaciones requeridas para este turno.",
    },
    recurring: {
      title: "Turno Recurrente",
      description: "Este turno se repite en días específicos. Próximamente.",
    },
    select: {
      workType: "Seleccionar tipo de trabajo",
      shiftTime: "Seleccionar horario del turno",
      armed: "Seleccionar estado armado",
    },
    actions: {
      decreasePositions: "Disminuir posiciones abiertas",
      increasePositions: "Aumentar posiciones abiertas",
      postShift: "Publicar Turno",
      posting: "Publicando...",
      updateShift: "Actualizar Turno",
      updating: "Actualizando...",
      deleteShift: "Eliminar Turno",
      deleting: "Eliminando...",
      deleteConfirm:
        "¿Estás seguro de que deseas eliminar este turno? Esta acción no se puede deshacer.",
      deleteFailed: "No se pudo eliminar el turno",
      createFailed: "No se pudo crear el turno.",
      createFailedFields: "No se pudo crear el turno. Revisa los campos obligatorios.",
    },
    summary: {
      title: "Resumen del Turno",
      typeOfPost: "Tipo de Publicación",
      dateTime: "Fecha y Hora",
      location: "Ubicación",
      payRate: "Tarifa de Pago",
      licenseRequired: "Licencia Requerida",
      certificationRequired: "Certificación Requerida",
      certifications: "Certificaciones",
      openPositions: "Posiciones Abiertas",
      description: "Descripción",
      visibility: "Visibilidad",
      visibilityQuestion: "¿Quién puede ver este turno?",
      publicTitle: "Publicación pública",
      publicDescription: "Listado en Explorar Turnos para todos los oficiales de seguridad.",
      privateTitle: "Publicación privada para personal",
      privateDescription:
        "Oculto del explorador público. Invita oficiales desde tu lista de personal.",
      selected: "Seleccionado: {value}",
      notSet: "No establecido",
      tipsTitle: "Consejos para una Publicación Exitosa",
      tips: [
        "Sé específico en tu descripción",
        "Incluye instrucciones de estacionamiento y entrada",
        "Establece una tarifa competitiva",
        "Publica con anticipación para mayor visibilidad",
      ],
    },
    errors: {},
  },
  acceptedShifts: {
    card: {
      confirmed: "CONFIRMADO",
      completed: "COMPLETADO",
      cancelled: "CANCELADO",
      viewShift: "Ver Turno",
      cancel: "Cancelar",
      completedOn: "Completado el",
      removeFromList: "Eliminar de la Lista",
      removeConfirm:
        "¿Eliminar esta asignación de tu lista? Solo se oculta de tu vista.",
      companyContact: "Contacto de la empresa",
      phoneNotProvided: "Teléfono no proporcionado",
      emailNotProvided: "Correo no proporcionado",
      estAbbrev: "Est. {pay}",
      estEarnings: "Ganancias est. {pay}",
      estEarningsUnavailable: "Ganancias estimadas no disponibles",
    },
  },
  company: {
    shared: {
      close: "Cerrar",
      licenseDisclaimer:
        "FlexOfficers muestra la información de licencia proporcionada por el oficial. Las empresas son responsables de verificar la validez de la licencia antes de contratar o asignar trabajo.",
      openPositions: "Posiciones Abiertas",
      pay: "Pago",
      date: "Fecha",
      time: "Hora",
      location: "Ubicación",
      status: "Estado",
      shift: "Turno",
      total: "Total",
      pending: "Pendiente",
      accepted: "Aceptado",
      rejected: "Rechazado",
    },
    review: {
      title: "Revisión del Solicitante",
      closeAria: "Cerrar panel de revisión del solicitante",
      officerProfile: "Perfil del Oficial",
      officerProfileHint:
        "Información autodeclarada enviada por el oficial.",
      appliedShift: "Turno Solicitado",
      shiftDetails: "Detalles del Turno",
      applicantsOverview: "Resumen de Solicitantes",
      name: "Nombre",
      email: "Correo",
      phone: "Teléfono",
      cityState: "Ciudad, Estado",
      yearsOfExperience: "Años de Experiencia",
      armedUnarmed: "Armado / Desarmado",
      experienceCategories: "Categorías de Experiencia",
      introduction: "Presentación",
      licensesSubmitted: "Licencias Enviadas",
      licenseNumber: "Número de Licencia",
      issuingState: "Estado Emisor",
      expirationDate: "Fecha de Vencimiento",
      certifications: "Certificaciones",
      availability: "Disponibilidad",
      shiftTitle: "Título del Turno",
      shiftStatus: "Estado del Turno",
      payRate: "Tarifa de Pago",
      workType: "Tipo de Trabajo",
      requiredLicenses: "Licencias Requeridas",
      requiredCertifications: "Certificaciones Requeridas",
      otherRequirements: "Otros Requisitos",
      acceptApplicant: "Aceptar Solicitante",
      rejectApplicant: "Rechazar Solicitante",
      updating: "Actualizando...",
      updateFailed: "No se pudo actualizar el solicitante",
      backToShifts: "Volver a Mis Turnos",
      experience: "Experiencia",
      licenses: "Licencias",
      basicInformation: "Información Básica",
      closeOfficerProfileAria: "Cerrar panel de perfil del oficial",
    },
    applicantsSummary: {
      selectHint: "Selecciona un solicitante para ver los detalles del turno.",
      shiftDetails: "Detalles del Turno",
      applicantsOverview: "Resumen de Solicitantes",
    },
    officers: {
      inviteSent: "Invitación enviada",
      searchByNameOrCity: "Buscar por nombre o ciudad",
      filters: "Filtros",
      firstName: "Nombre",
      lastName: "Apellido",
      city: "Ciudad",
      state: "Estado",
      search: "Buscar",
      clearFilters: "Borrar Filtros",
      moreFilters: "Más Filtros",
      background: "Antecedentes",
      licenseTypes: "Tipos de Licencia",
      certifications: "Certificaciones",
      availability: "Disponibilidad",
      noOfficersFound: "No se encontraron oficiales.",
      tryAnotherCity: "Prueba otra ciudad o ajusta tus filtros.",
      officersFoundOne: "1 oficial encontrado",
      officersFoundMany: "{count} oficiales encontrados",
      sort: "Ordenar:",
      sortBy: "Ordenar Por",
      alphabetical: "Alfabético",
      mostExperience: "Más Experiencia",
      newest: "Más Reciente",
      officerFallback: "Oficial",
    },
    addToStaff: {
      add: "Agregar al Personal",
      adding: "Agregando...",
      remove: "Quitar del Personal",
      removing: "Quitando...",
      updateFailed: "No se pudo actualizar el personal.",
    },
    statusButtons: {
      accept: "Aceptar",
      reject: "Rechazar",
      acceptedAlert: "¡Solicitante aceptado!",
      rejectedAlert: "¡Solicitante rechazado!",
      updateFailed: "No se pudo actualizar el solicitante",
    },
    editShift: {
      previewShift: "Vista Previa del Turno",
    },
    invite: {
      closeAria: "Cerrar modal de invitar oficial",
      title: "Invitar Oficial",
      noOpenShifts: "Invitar Oficial",
      postBeforeInvite: "Publica un turno abierto antes de invitar a {name}.",
      postShift: "Publicar un Turno",
      cancel: "Cancelar",
      selectOpenShift: "Selecciona uno de tus turnos abiertos.",
      openShifts: "Turnos Abiertos",
      messageLabel: "Agregar un mensaje breve (opcional)",
      messagePlaceholder:
        "Cuéntale al oficial por qué este turno es una buena opción.",
      inviteSentSuffix: " · Invitación enviada",
      staffOnlySuffix: " · Solo personal",
      pendingInvite:
        "Este oficial ya tiene una invitación pendiente para el turno seleccionado.",
      alreadyAssigned:
        "Este oficial ya está asignado al turno seleccionado.",
      alreadyAccepted:
        "Este oficial ya aceptó una invitación para el turno seleccionado.",
      sendInvite: "Enviar Invitación",
      sending: "Enviando...",
      sendFailed: "No se pudo enviar la invitación.",
    },
  },
};
