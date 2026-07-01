import {
  profileShiftEn,
  profileShiftEs,
  type ProfileShiftTranslations,
} from "@/lib/i18n/profile-shift-translations";

export type UiTranslations = {
  browse: {
    pagination: {
      previous: string;
      next: string;
      prev: string;
      pageOf: string;
      showingApplications: string;
      showingApplicationsZero: string;
      showingAcceptedShifts: string;
      showingAcceptedShiftsZero: string;
      showingNotifications: string;
      showingNotificationsZero: string;
      showingOpenShifts: string;
      showingOpenShiftsZero: string;
      showingShifts: string;
    };
    applications: {
      filterByStatus: string;
      allStatuses: string;
      tabs: { all: string; pending: string; accepted: string; rejected: string; withdrawn: string };
      empty: {
        none: string;
        noneDescription: string;
        hidden: string;
        noMatch: string;
      };
      actions: {
        browseShifts: string;
        showAll: string;
        viewShift: string;
        withdraw: string;
        myShifts: string;
      };
      card: { estimatedPay: string; applied: string };
      toast: { removed: string };
    };
    acceptedShifts: {
      tabs: { upcoming: string; completed: string; cancelled: string };
      empty: { upcoming: string; completed: string; cancelled: string };
      actions: { browseOpenShifts: string };
    };
    upcomingShifts: {
      filters: { all: string; next7Days: string; thisMonth: string };
      sort: { label: string; soonest: string; latest: string; aria: string };
      stats: {
        upcoming: string;
        expectedEarnings: string;
        scheduledHours: string;
        nextShift: string;
      };
      empty: { none: string; noneDescription: string; noMatch: string };
      startsToday: string;
      startsTomorrow: string;
      startsInDays: string;
      actions: { browseOpenShifts: string };
      card: {
        confirmed: string;
        viewDetails: string;
        companyContact: string;
        phoneNotProvided: string;
        emailNotProvided: string;
        estAbbrev: string;
        estEarnings: string;
        estEarningsUnavailable: string;
      };
    };
    notifications: {
      markAllRead: string;
      marking: string;
      tabs: { all: string; unread: string; applications: string; shifts: string; system: string };
      empty: { none: string; noneDescription: string; noMatch: string };
      actions: { delete: string; unread: string; viewShift: string; viewDetails: string };
      timeAgo: {
        justNow: string;
        minutesAgo: string;
        hoursAgo: string;
        daysAgo: string;
        weeksAgo: string;
      };
      kinds: {
        application_accepted: string;
        application_rejected: string;
        application_viewed: string;
        application_withdrawn: string;
        application_status_updated: string;
        upcoming_shift_reminder: string;
        shift_starts_tomorrow: string;
        shift_starts_soon: string;
        shift_schedule_changed: string;
        shift_cancelled: string;
        new_shift_match: string;
        system_update: string;
        system_maintenance: string;
        system_security: string;
        system_coming_soon: string;
        system_welcome: string;
        system_profile_reminder: string;
        general: string;
      };
    };
    companyNotifications: {
      empty: { none: string; noneDescription: string; noMatch: string };
      actions: {
        viewApplicants: string;
        viewShifts: string;
        viewDetails: string;
        delete: string;
        unread: string;
      };
      kinds: {
        invite_accepted: string;
        invite_declined: string;
        new_application: string;
        application_withdrawn: string;
        shift_update: string;
        shift_cancelled: string;
        system_update: string;
        general: string;
      };
    };
    shifts: {
      searchTitle: string;
      searchSubtitle: string;
      empty: { none: string; noneDescription: string };
      noMatch: { title: string; description: string };
      actions: { viewOpenShifts: string; clearFilters: string; viewAllOpen: string };
      results: { oneOpenShift: string; manyOpenShifts: string };
    };
    companyShifts: {
      tabs: { all: string; open: string; filled: string; cancelled: string };
      searchPlaceholder: string;
      searchAria: string;
      empty: { none: string; noneDescription: string; noMatch: string };
      actions: { postShift: string; subscribeToPost: string; viewBilling: string };
      blockMessage: {
        profileIncomplete: string;
        trialExpired: string;
        subscriptionRequired: string;
      };
      table: {
        status: string;
        shiftLocation: string;
        dateTime: string;
        pay: string;
        filled: string;
        applicants: string;
        actions: string;
        roster: string;
        hide: string;
      };
    };
    companyApplicants: {
      tabs: { all: string; applicants: string; pending: string; accepted: string; rejected: string };
      searchPlaceholder: string;
      filter: string;
      empty: { none: string; noneDescription: string; noMatch: string };
      actions: { view: string; accept: string; reject: string; backToShifts: string };
      errors: { updateFailed: string };
    };
    invites: {
      tabs: { all: string; pending: string; accepted: string; declined: string };
      empty: {
        none: string;
        noneDescription: string;
        noTab: string;
        noTabDescription: string;
      };
      sort: { label: string; newest: string; oldest: string };
      count: string;
      statuses: { PENDING: string; ACCEPTED: string; DECLINED: string };
      card: {
        acceptInvite: string;
        declineInvite: string;
        accepting: string;
        declining: string;
        viewShift: string;
        viewShiftDetails: string;
        pendingHint: string;
        updateFailed: string;
        deleteConfirm: string;
        deleteFailed: string;
        invitedPrefix: string;
      };
      howItWorks: {
        title: string;
        step1Title: string;
        step1Description: string;
        step2Title: string;
        step2Description: string;
        step3Title: string;
        step3Description: string;
        step4Title: string;
        step4Description: string;
      };
      footer: { howItWorks: string; otherUpdates: string; viewAll: string };
    };
  };
  status: {
    application: {
      PENDING: string;
      ACCEPTED: string;
      REJECTED: string;
      WITHDRAWN: string;
    };
    shift: {
      OPEN: string;
      INVITED: string;
      PARTIALLY_FILLED: string;
      FILLED: string;
      CANCELLED: string;
      COMPLETED: string;
    };
  };
  filters: {
    workType: { all: string; gig: string; fullTime: string; partTime: string };
    sort: { newest: string; highestPay: string; earliestStart: string };
    summary: {
      anyLocation: string;
      anyDate: string;
      anyPay: string;
      allTypes: string;
      moreFilters: string;
      placeholder: string;
    };
    shifts: {
      location: string;
      enterCity: string;
      allStates: string;
      date: string;
      pay: string;
      minPay: string;
      workType: string;
      moreFilters: string;
      armed: string;
      unarmed: string;
      dayShift: string;
      nightShift: string;
      overnight: string;
      clearFilters: string;
      sortBy: string;
      applySearch: string;
      city: string;
      state: string;
      active: string;
    };
    shiftOptions: {
      gig: string;
      fullTime: string;
      partTime: string;
      dayShift: string;
      nightShift: string;
      overnight: string;
      armed: string;
      unarmed: string;
      either: string;
    };
  };
  shiftDetail: {
    heading: string;
    perHour: string;
    estimatedPay: string;
    estimatedEarnings: string;
    positions: { open: string; stillOpen: string; available: string };
    fields: {
      location: string;
      positions: string;
      start: string;
      end: string;
      workType: string;
      shiftTime: string;
      armedRequirement: string;
      openPositions: string;
    };
    sections: {
      description: string;
      noDescription: string;
      requirements: string;
      specialRequirements: string;
      reportingInstructions: string;
      shiftInformation: string;
      about: string;
      company: string;
      contact: string;
    };
    requirements: {
      license: string;
      certification: string;
      other: string;
      additional: string;
    };
    company: {
      phone: string;
      email: string;
      contactLocked: string;
      noPublicProfile: string;
    };
    actions: {
      back: string;
      applicationAccepted: string;
      applicationPending: string;
      completeProfileToApply: string;
      signInToApply: string;
      apply: string;
      applying: string;
      applied: string;
      notAccepting: string;
      viewCompanyProfile: string;
    };
    toast: { applySuccess: string; applyFailed: string };
  };
  onboarding: {
    saving: string;
    officer: {
      title: string;
      description: string;
      cta: string;
      groups: { findWork: string; buildCareer: string; afterAcceptance: string };
      items: {
        findOpenShifts: string;
        getInvites: string;
        applyFast: string;
        buildProfile: string;
        showcaseLicenses: string;
        flexibleSchedule: string;
        contactAfterAcceptance: string;
        trackApplications: string;
      };
    };
    company: {
      title: string;
      description: string;
      cta: string;
      groups: { postJobs: string; hireOfficers: string; manageTeam: string };
      items: {
        publicPrivatePosts: string;
        postOpenShifts: string;
        fillFaster: string;
        inviteOfficers: string;
        reviewProfiles: string;
        acceptReject: string;
        manageStaff: string;
        manageAccepted: string;
      };
    };
    disclaimer: { title: string; body: string };
    errors: { saveFailed: string };
  };
  billing: {
    status: { trial: string; active: string; expired: string };
    empty: {
      completeProfileTitle: string;
      completeProfileDescription: string;
      completeProfileCta: string;
    };
    errors: {
      loadFailedTitle: string;
      loadFailedDescription: string;
    };
    sections: {
      currentPlan: string;
      subscriptionManagement: string;
      billingSummary: string;
      paymentMethod: string;
      billingHistory: string;
      billingSupport: string;
    };
    labels: {
      plan: string;
      billingCycle: string;
      status: string;
      nextRenewal: string;
      nextCharge: string;
      autoRenewal: string;
      enabled: string;
      notEnabled: string;
      amount: string;
      included: string;
      perYear: string;
      trialEnds: string;
      daysRemaining: string;
      dayRemaining: string;
      daysRemainingPlural: string;
      default: string;
      expires: string;
      notScheduled: string;
      businessHours: string;
      subscriptionQuestions: string;
    };
    actions: {
      startSubscription: string;
      startSubscriptionNow: string;
      manageSubscription: string;
      updatePaymentMethod: string;
      manageShifts: string;
      download: string;
    };
    emptyStates: {
      noPaymentMethod: string;
      subscribeToAddPayment: string;
      stripePaymentPending: string;
      noBillingHistory: string;
      stripeHistoryPending: string;
      trialExpired: string;
    };
    stripe: {
      notConfigured: string;
      noAccount: string;
    };
    table: { date: string; description: string; status: string; amount: string; invoice: string };
    plan: { name: string; yearly: string };
    support: { hours: string };
    trial: {
      durationLabel: string;
      profileStartNote: string;
      activeNote: string;
      expiredNote: string;
      pricingBadge: string;
      pricingStartNote: string;
      pricingSubscribeNote: string;
      trialEndsPrefix: string;
      day: string;
      days: string;
      remaining: string;
    };
  };
  admin: {
    navAria: string;
    badge: string;
    signOut: string;
    fallbackName: string;
    items: {
      dashboard: string;
      companies: string;
      officers: string;
      shifts: string;
      applications: string;
      reports: string;
      auditLogs: string;
      settings: string;
    };
  };
  forms: {
    profile: { completeToApply: string; finishItems: string };
    cancelAssignment: {
      title: string;
      confirm: string;
      failed: string;
    };
    withdrawApplication: {
      label: string;
      confirm: string;
      success: string;
      failed: string;
    };
    deleteInvite: {
      confirm: string;
      failed: string;
    };
  };
  commonExtras: {
    notProvided: string;
    browseShifts: string;
    browseOpenShifts: string;
    important: string;
    noMessagesYet: string;
    messagesEmptyDescription: string;
  };
} & ProfileShiftTranslations;

export const uiEn: UiTranslations = {
  browse: {
    pagination: {
      previous: "Previous",
      next: "Next",
      prev: "Prev",
      pageOf: "Page {page} of {total}",
      showingApplications: "Showing {start}–{end} of {total} applications",
      showingApplicationsZero: "Showing 0 applications",
      showingAcceptedShifts: "Showing {start}–{end} of {total} accepted shifts",
      showingAcceptedShiftsZero: "Showing 0 accepted shifts",
      showingNotifications: "Showing {start}–{end} of {total} notifications",
      showingNotificationsZero: "Showing 0 notifications",
      showingOpenShifts: "Showing {start}–{end} of {total} open shifts",
      showingOpenShiftsZero: "Showing 0 open shifts",
      showingShifts: "Showing {start} to {end} of {total} shifts",
    },
    applications: {
      filterByStatus: "Filter by status",
      allStatuses: "All Statuses",
      tabs: {
        all: "All",
        pending: "Pending",
        accepted: "Accepted",
        rejected: "Rejected",
        withdrawn: "Withdrawn",
      },
      empty: {
        none: "You have not applied to any shifts yet.",
        noneDescription: "Browse open shifts and apply to start tracking your applications here.",
        hidden: "No applications in your list.",
        noMatch: "No applications match this filter.",
      },
      actions: {
        browseShifts: "Browse Shifts",
        showAll: "Show All Applications",
        viewShift: "View Shift",
        withdraw: "Withdraw",
        myShifts: "My Shifts",
      },
      card: { estimatedPay: "Est. {pay}", applied: "Applied {date}" },
      toast: { removed: "Application removed from your list." },
    },
    acceptedShifts: {
      tabs: { upcoming: "Upcoming", completed: "Completed", cancelled: "Cancelled" },
      empty: {
        upcoming: "You do not have any accepted shifts yet.",
        completed: "You have not completed any shifts yet.",
        cancelled: "You have no cancelled assignments.",
      },
      actions: { browseOpenShifts: "Browse Open Shifts" },
    },
    upcomingShifts: {
      filters: { all: "All Upcoming", next7Days: "Next 7 Days", thisMonth: "This Month" },
      sort: { label: "Sort:", soonest: "Soonest", latest: "Latest", aria: "Sort upcoming shifts" },
      stats: {
        upcoming: "Upcoming Shifts",
        expectedEarnings: "Expected Earnings",
        scheduledHours: "Scheduled Hours",
        nextShift: "Next Shift",
      },
      empty: {
        none: "No upcoming shifts yet.",
        noneDescription: "New confirmed shifts will appear here.",
        noMatch: "No shifts match your filters.",
      },
      startsToday: "Starts today",
      startsTomorrow: "Starts tomorrow",
      startsInDays: "Starts in {count} days",
      actions: { browseOpenShifts: "Browse Open Shifts" },
      card: {
        confirmed: "CONFIRMED",
        viewDetails: "View Details",
        companyContact: "Company contact",
        phoneNotProvided: "Phone not provided",
        emailNotProvided: "Email not provided",
        estAbbrev: "Est. {pay}",
        estEarnings: "Est. earnings {pay}",
        estEarningsUnavailable: "Estimated earnings unavailable",
      },
    },
    notifications: {
      markAllRead: "Mark all as read",
      marking: "Marking…",
      tabs: {
        all: "All",
        unread: "Unread",
        applications: "Applications",
        shifts: "Shifts",
        system: "System",
      },
      empty: {
        none: "No notifications yet.",
        noneDescription:
          "Notifications will appear here when there are application updates and shift alerts.",
        noMatch: "No notifications in this tab.",
      },
      actions: {
        delete: "Delete",
        unread: "Unread",
        viewShift: "View Shift",
        viewDetails: "View Details",
      },
      timeAgo: {
        justNow: "Just now",
        minutesAgo: "{count} minute(s) ago",
        hoursAgo: "{count} hour(s) ago",
        daysAgo: "{count} day(s) ago",
        weeksAgo: "{count} week(s) ago",
      },
      kinds: {
        application_accepted: "APPLICATION ACCEPTED",
        application_rejected: "APPLICATION REJECTED",
        application_viewed: "APPLICATION VIEWED",
        application_withdrawn: "APPLICATION WITHDRAWN",
        application_status_updated: "APPLICATION UPDATE",
        upcoming_shift_reminder: "SHIFT REMINDER",
        shift_starts_tomorrow: "SHIFT REMINDER",
        shift_starts_soon: "SHIFT REMINDER",
        shift_schedule_changed: "SCHEDULE CHANGED",
        shift_cancelled: "SHIFT CANCELLED",
        new_shift_match: "NEW SHIFT MATCH",
        system_update: "SYSTEM UPDATE",
        system_maintenance: "SYSTEM UPDATE",
        system_security: "SYSTEM UPDATE",
        system_coming_soon: "SYSTEM UPDATE",
        system_welcome: "SYSTEM UPDATE",
        system_profile_reminder: "SYSTEM UPDATE",
        general: "SYSTEM UPDATE",
      },
    },
    companyNotifications: {
      empty: {
        none: "No notifications yet.",
        noneDescription:
          "Notifications will appear here when officers respond to invites, apply to shifts, or shift updates occur.",
        noMatch: "No notifications in this tab.",
      },
      actions: {
        viewApplicants: "View Applicants",
        viewShifts: "View Shifts",
        viewDetails: "View Details",
        delete: "Delete",
        unread: "Unread",
      },
      kinds: {
        invite_accepted: "INVITE ACCEPTED",
        invite_declined: "INVITE DECLINED",
        new_application: "NEW APPLICATION",
        application_withdrawn: "APPLICATION WITHDRAWN",
        shift_update: "SHIFT UPDATE",
        shift_cancelled: "SHIFT CANCELLED",
        system_update: "SYSTEM UPDATE",
        general: "SYSTEM UPDATE",
      },
    },
    shifts: {
      searchTitle: "Search Shifts",
      searchSubtitle: "Set your filters to find the perfect shift.",
      empty: {
        none: "No shifts posted yet.",
        noneDescription: "Check back soon for new security opportunities.",
      },
      noMatch: {
        title: "No Matching Shifts",
        description: "We couldn't find any open shifts matching your filters.",
      },
      actions: {
        viewOpenShifts: "View Open Shifts",
        clearFilters: "Clear Filters",
        viewAllOpen: "View All Open Shifts",
      },
      results: { oneOpenShift: "1 Open Shift", manyOpenShifts: "{count} Open Shifts" },
    },
    companyShifts: {
      tabs: { all: "All Shifts", open: "Open", filled: "Filled", cancelled: "Cancelled" },
      searchPlaceholder: "Search shifts...",
      searchAria: "Search shifts",
      empty: {
        none: "No shifts posted yet.",
        noneDescription: "Post your first shift to start receiving applicants.",
        noMatch: "No shifts match this filter.",
      },
      actions: {
        postShift: "Post a Shift",
        subscribeToPost: "Subscribe to Post Shifts",
        viewBilling: "View Billing",
      },
      blockMessage: {
        profileIncomplete:
          "Complete your company profile to start your 7-day free trial and post shifts.",
        trialExpired:
          "Your free trial has ended. Subscribe to re-unlock posting and applicant tools.",
        subscriptionRequired:
          "An active subscription or trial is required to post new shifts.",
      },
      table: {
        status: "Status",
        shiftLocation: "Shift / Location",
        dateTime: "Date & Time",
        pay: "Pay",
        filled: "Filled",
        applicants: "Applicants",
        actions: "Actions",
        roster: "Roster",
        hide: "Hide",
      },
    },
    companyApplicants: {
      tabs: {
        all: "All Applicants",
        applicants: "Applicants",
        pending: "Pending",
        accepted: "Accepted",
        rejected: "Rejected",
      },
      searchPlaceholder: "Search applicants...",
      filter: "Filter",
      empty: {
        none: "No applicants yet.",
        noneDescription: "Once officers apply to your shifts, they will appear here.",
        noMatch: "No applicants match this filter.",
      },
      actions: {
        view: "View",
        accept: "Accept",
        reject: "Reject",
        backToShifts: "Back to My Shifts",
      },
      errors: { updateFailed: "Failed to update applicant" },
    },
    invites: {
      tabs: { all: "All", pending: "Pending", accepted: "Accepted", declined: "Declined" },
      empty: {
        none: "No invites found.",
        noneDescription: "When a company invites you to a shift, it will appear here.",
        noTab: "No invites in this tab.",
        noTabDescription: "Try another tab or adjust your filters.",
      },
      sort: { label: "Sort By", newest: "Newest", oldest: "Oldest" },
      count: "{count} invite(s)",
      statuses: { PENDING: "Pending", ACCEPTED: "Accepted", DECLINED: "Declined" },
      card: {
        acceptInvite: "Accept Invite",
        declineInvite: "Decline Invite",
        accepting: "Accepting...",
        declining: "Declining...",
        viewShift: "View Shift",
        viewShiftDetails: "View Shift Details",
        pendingHint:
          "Once you accept an invite, it will move to your Accepted Shifts.",
        updateFailed: "Failed to update invite.",
        deleteConfirm: "Delete this declined invite from your list?",
        deleteFailed: "Failed to delete invite",
        invitedPrefix: "Invited {time}",
      },
      howItWorks: {
        title: "How Invites Work",
        step1Title: "Company invites you",
        step1Description: "A company finds your profile and invites you to a shift.",
        step2Title: "You review the shift",
        step2Description: "Check the details and decide if it's a good fit.",
        step3Title: "Accept invite",
        step3Description:
          "If you accept, the shift is automatically added to your Accepted Shifts.",
        step4Title: "Show up & get paid",
        step4Description:
          "Work the shift and get paid directly by the security company. The company is in charge of paying you—not through FlexOfficers.",
      },
      footer: {
        howItWorks: "How invites work",
        otherUpdates: "Other Updates",
        viewAll: "View All",
      },
    },
  },
  status: {
    application: {
      PENDING: "Pending",
      ACCEPTED: "Accepted",
      REJECTED: "Rejected",
      WITHDRAWN: "Withdrawn",
    },
    shift: {
      OPEN: "Open",
      INVITED: "Invited",
      PARTIALLY_FILLED: "Partially Filled",
      FILLED: "Filled",
      CANCELLED: "Cancelled",
      COMPLETED: "Completed",
    },
  },
  filters: {
    workType: { all: "All", gig: "Gig", fullTime: "Full-Time", partTime: "Part-Time" },
    sort: { newest: "Newest", highestPay: "Highest Pay", earliestStart: "Earliest Start" },
    summary: {
      anyLocation: "Any location",
      anyDate: "Any date",
      anyPay: "Any pay",
      allTypes: "All types",
      moreFilters: "More filters",
      placeholder: "Set filters to browse shifts",
    },
    shifts: {
      location: "Location",
      enterCity: "Enter city",
      allStates: "All States",
      date: "Date",
      pay: "Pay",
      minPay: "Min $/hr",
      workType: "Work Type",
      moreFilters: "More Filters",
      armed: "Armed",
      unarmed: "Unarmed",
      dayShift: "Day Shift",
      nightShift: "Night Shift",
      overnight: "Overnight",
      clearFilters: "Clear Filters",
      sortBy: "Sort by",
      applySearch: "Apply Search",
      city: "City",
      state: "State",
      active: "Active",
    },
    shiftOptions: {
      gig: "Gig",
      fullTime: "Full-Time",
      partTime: "Part-Time",
      dayShift: "Day Shift",
      nightShift: "Night Shift",
      overnight: "Overnight",
      armed: "Armed",
      unarmed: "Unarmed",
      either: "Either",
    },
  },
  shiftDetail: {
    heading: "Shift details",
    perHour: "/hr",
    estimatedPay: "Estimated pay:",
    estimatedEarnings: "Estimated earnings {pay}",
    positions: {
      open: "{open} of {total} open",
      stillOpen: "{open} of {total} still open",
      available: "{open} of {total} available",
    },
    fields: {
      location: "Location",
      positions: "Positions",
      start: "Start",
      end: "End",
      workType: "Work type",
      shiftTime: "Shift time",
      armedRequirement: "Armed requirement",
      openPositions: "Open Positions",
    },
    sections: {
      description: "Description",
      noDescription: "No description provided.",
      requirements: "Requirements",
      specialRequirements: "Special requirements",
      reportingInstructions: "Reporting instructions",
      shiftInformation: "Shift Information",
      about: "About this Shift",
      company: "Company",
      contact: "Contact",
    },
    requirements: {
      license: "License Requirements",
      certification: "Certification Requirements",
      other: "Other Requirements",
      additional: "Additional Requirements",
    },
    company: {
      phone: "Phone",
      email: "Email",
      contactLocked:
        "Company contact details are shared after your application is accepted.",
      noPublicProfile: "This company has not published a public profile yet.",
    },
    actions: {
      back: "← Back",
      applicationAccepted: "Application Accepted",
      applicationPending: "Application Pending",
      completeProfileToApply: "Complete Profile to Apply",
      signInToApply: "Sign in to apply",
      apply: "Apply to Shift",
      applying: "Applying...",
      applied: "Applied",
      notAccepting: "Not accepting applications",
      viewCompanyProfile: "View Company Profile",
    },
    toast: { applySuccess: "Application submitted!", applyFailed: "Failed to apply to shift" },
  },
  onboarding: {
    saving: "Saving...",
    officer: {
      title: "Security Officer",
      description: "Browse shifts and find the right opportunities for your schedule and experience.",
      cta: "Continue as Officer",
      groups: {
        findWork: "Find Work",
        buildCareer: "Build Your Career",
        afterAcceptance: "After Acceptance",
      },
      items: {
        findOpenShifts: "Find open shifts",
        getInvites: "Get company invites",
        applyFast: "Apply to shifts in seconds",
        buildProfile: "Build your professional profile",
        showcaseLicenses: "Showcase licenses and certifications",
        flexibleSchedule: "Work when it fits your schedule",
        contactAfterAcceptance: "Get company contact information after acceptance",
        trackApplications: "Track your applications and upcoming shifts",
      },
    },
    company: {
      title: "Security Company",
      description: "Post shifts, review licensed officers, and build your security team.",
      cta: "Continue as Company",
      groups: { postJobs: "Post Jobs", hireOfficers: "Hire Officers", manageTeam: "Manage Team" },
      items: {
        publicPrivatePosts: "Create public & private job posts",
        postOpenShifts: "Post open shifts",
        fillFaster: "Fill shifts faster",
        inviteOfficers: "Invite officers to apply",
        reviewProfiles: "Review profiles, licenses & certifications",
        acceptReject: "Accept or reject applicants",
        manageStaff: "Manage staff",
        manageAccepted: "Manage accepted officers",
      },
    },
    disclaimer: {
      title: "Important",
      body: "Companies are responsible for verifying licenses and credentials. Officers are responsible for maintaining valid qualifications.",
    },
    errors: { saveFailed: "Could not save your role. Please try again." },
  },
  billing: {
    status: { trial: "Trial", active: "Active", expired: "Expired" },
    empty: {
      completeProfileTitle: "Complete your company profile",
      completeProfileDescription: "Add your company details before managing billing.",
      completeProfileCta: "Complete Company Profile",
    },
    errors: {
      loadFailedTitle: "Unable to load billing",
      loadFailedDescription:
        "Billing is temporarily unavailable. Your subscription details could not be loaded right now. Please try again in a moment.",
    },
    sections: {
      currentPlan: "Current Plan",
      subscriptionManagement: "Subscription Management",
      billingSummary: "Billing Summary",
      paymentMethod: "Payment Method",
      billingHistory: "Billing History",
      billingSupport: "Billing Support",
    },
    labels: {
      plan: "Plan",
      billingCycle: "Billing Cycle",
      status: "Status",
      nextRenewal: "Next Renewal",
      nextCharge: "Next Charge",
      autoRenewal: "Auto Renewal",
      enabled: "Enabled",
      notEnabled: "Not enabled",
      amount: "Amount",
      included: "Included",
      perYear: "/ year",
      trialEnds: "Trial Ends",
      daysRemaining: "Days Remaining",
      dayRemaining: "{count} day remaining",
      daysRemainingPlural: "{count} days remaining",
      default: "Default",
      expires: "Expires",
      notScheduled: "Not scheduled",
      businessHours: "Business Hours",
      subscriptionQuestions: "Questions about your subscription?",
    },
    actions: {
      startSubscription: "Start Subscription",
      startSubscriptionNow: "Start Subscription Now",
      manageSubscription: "Manage Subscription",
      updatePaymentMethod: "Update Payment Method",
      manageShifts: "Manage Shifts",
      download: "Download",
    },
    emptyStates: {
      noPaymentMethod: "No payment method on file.",
      subscribeToAddPayment: "Start a subscription to add a payment method.",
      stripePaymentPending:
        "Payment method details will appear here once Stripe is connected.",
      noBillingHistory: "No billing history yet.",
      stripeHistoryPending: "Billing history will appear here once Stripe is connected.",
      trialExpired: "Your trial has expired.",
    },
    stripe: {
      notConfigured: "Stripe billing is not configured yet.",
      noAccount: "No Stripe billing account is connected yet.",
    },
    table: {
      date: "Date",
      description: "Description",
      status: "Status",
      amount: "Amount",
      invoice: "Invoice",
    },
    plan: { name: "FlexOfficers Annual", yearly: "Yearly" },
    support: { hours: "Monday – Friday, 9AM – 6PM EST" },
    trial: {
      durationLabel: "7-Day Free Trial",
      profileStartNote:
        "Your free trial starts automatically when you complete your company profile (company name, email, phone, address, city, state, etc.).",
      activeNote:
        "You won't be charged when your trial ends. Subscribe anytime to re-unlock features.",
      expiredNote:
        "Your free trial has ended. Subscribe to re-unlock posting, officer search, and applicant management.",
      pricingBadge: "7-day free trial",
      pricingStartNote:
        "Your trial starts after your company profile is complete. You won't be charged when the trial ends.",
      pricingSubscribeNote: "Subscribe when ready to re-unlock company features.",
      trialEndsPrefix: "Trial ends:",
      day: "day",
      days: "days",
      remaining: "remaining",
    },
  },
  admin: {
    navAria: "Admin dashboard",
    badge: "Admin",
    signOut: "Sign out",
    fallbackName: "Admin",
    items: {
      dashboard: "Dashboard",
      companies: "Companies",
      officers: "Officers",
      shifts: "Shifts",
      applications: "Applications",
      reports: "Reports",
      auditLogs: "Audit Logs",
      settings: "Settings",
    },
  },
  forms: {
    profile: {
      completeToApply: "Complete your profile to apply",
      finishItems: "Finish the items below before you can apply to shifts.",
    },
    cancelAssignment: {
      title: "Cancel Assignment",
      confirm:
        "Cancel this assignment? The company will be notified and the shift opening may become available again.",
      failed: "Failed to cancel assignment",
    },
    withdrawApplication: {
      label: "Withdraw Application",
      confirm:
        "Withdraw this application? You will no longer be considered for this shift.",
      success: "Application withdrawn.",
      failed: "Failed to withdraw application",
    },
    deleteInvite: {
      confirm: "Delete this declined invite from your list?",
      failed: "Failed to delete invite",
    },
  },
  commonExtras: {
    notProvided: "Not provided",
    browseShifts: "Browse Shifts",
    browseOpenShifts: "Browse Open Shifts",
    important: "Important",
    noMessagesYet: "No messages yet.",
    messagesEmptyDescription: "Company messaging is not active in Version 1.0.",
  },
  ...profileShiftEn,
};

export const uiEs: UiTranslations = {
  browse: {
    pagination: {
      previous: "Anterior",
      next: "Siguiente",
      prev: "Ant.",
      pageOf: "Página {page} de {total}",
      showingApplications: "Mostrando {start}–{end} de {total} solicitudes",
      showingApplicationsZero: "Mostrando 0 solicitudes",
      showingAcceptedShifts: "Mostrando {start}–{end} de {total} turnos aceptados",
      showingAcceptedShiftsZero: "Mostrando 0 turnos aceptados",
      showingNotifications: "Mostrando {start}–{end} de {total} notificaciones",
      showingNotificationsZero: "Mostrando 0 notificaciones",
      showingOpenShifts: "Mostrando {start}–{end} de {total} turnos abiertos",
      showingOpenShiftsZero: "Mostrando 0 turnos abiertos",
      showingShifts: "Mostrando {start} a {end} de {total} turnos",
    },
    applications: {
      filterByStatus: "Filtrar por estado",
      allStatuses: "Todos los estados",
      tabs: {
        all: "Todos",
        pending: "Pendiente",
        accepted: "Aceptado",
        rejected: "Rechazado",
        withdrawn: "Retirado",
      },
      empty: {
        none: "Aún no has solicitado ningún turno.",
        noneDescription:
          "Explora turnos abiertos y solicita para comenzar a seguir tus solicitudes aquí.",
        hidden: "No hay solicitudes en tu lista.",
        noMatch: "Ninguna solicitud coincide con este filtro.",
      },
      actions: {
        browseShifts: "Explorar Turnos",
        showAll: "Mostrar Todas las Solicitudes",
        viewShift: "Ver Turno",
        withdraw: "Retirar",
        myShifts: "Mis Turnos",
      },
      card: { estimatedPay: "Est. {pay}", applied: "Solicitado {date}" },
      toast: { removed: "Solicitud eliminada de tu lista." },
    },
    acceptedShifts: {
      tabs: { upcoming: "Próximos", completed: "Completados", cancelled: "Cancelados" },
      empty: {
        upcoming: "Aún no tienes turnos aceptados.",
        completed: "Aún no has completado ningún turno.",
        cancelled: "No tienes asignaciones canceladas.",
      },
      actions: { browseOpenShifts: "Explorar Turnos Abiertos" },
    },
    upcomingShifts: {
      filters: { all: "Todos los Próximos", next7Days: "Próximos 7 Días", thisMonth: "Este Mes" },
      sort: {
        label: "Ordenar:",
        soonest: "Más Próximo",
        latest: "Más Lejano",
        aria: "Ordenar próximos turnos",
      },
      stats: {
        upcoming: "Próximos Turnos",
        expectedEarnings: "Ganancias Esperadas",
        scheduledHours: "Horas Programadas",
        nextShift: "Próximo Turno",
      },
      empty: {
        none: "Aún no hay próximos turnos.",
        noneDescription: "Los nuevos turnos confirmados aparecerán aquí.",
        noMatch: "Ningún turno coincide con tus filtros.",
      },
      startsToday: "Comienza hoy",
      startsTomorrow: "Comienza mañana",
      startsInDays: "Comienza en {count} días",
      actions: { browseOpenShifts: "Explorar Turnos Abiertos" },
      card: {
        confirmed: "CONFIRMADO",
        viewDetails: "Ver Detalles",
        companyContact: "Contacto de la empresa",
        phoneNotProvided: "Teléfono no proporcionado",
        emailNotProvided: "Correo no proporcionado",
        estAbbrev: "Est. {pay}",
        estEarnings: "Ganancias est. {pay}",
        estEarningsUnavailable: "Ganancias estimadas no disponibles",
      },
    },
    notifications: {
      markAllRead: "Marcar todo como leído",
      marking: "Marcando…",
      tabs: {
        all: "Todos",
        unread: "No leídos",
        applications: "Solicitudes",
        shifts: "Turnos",
        system: "Sistema",
      },
      empty: {
        none: "Aún no hay notificaciones.",
        noneDescription:
          "Las notificaciones aparecerán aquí cuando haya actualizaciones de solicitudes y alertas de turnos.",
        noMatch: "No hay notificaciones en esta pestaña.",
      },
      actions: {
        delete: "Eliminar",
        unread: "No leído",
        viewShift: "Ver Turno",
        viewDetails: "Ver Detalles",
      },
      timeAgo: {
        justNow: "Justo ahora",
        minutesAgo: "hace {count} minuto(s)",
        hoursAgo: "hace {count} hora(s)",
        daysAgo: "hace {count} día(s)",
        weeksAgo: "hace {count} semana(s)",
      },
      kinds: {
        application_accepted: "SOLICITUD ACEPTADA",
        application_rejected: "SOLICITUD RECHAZADA",
        application_viewed: "SOLICITUD VISTA",
        application_withdrawn: "SOLICITUD RETIRADA",
        application_status_updated: "ACTUALIZACIÓN DE SOLICITUD",
        upcoming_shift_reminder: "RECORDATORIO DE TURNO",
        shift_starts_tomorrow: "RECORDATORIO DE TURNO",
        shift_starts_soon: "RECORDATORIO DE TURNO",
        shift_schedule_changed: "HORARIO CAMBIADO",
        shift_cancelled: "TURNO CANCELADO",
        new_shift_match: "NUEVO TURNO COINCIDENTE",
        system_update: "ACTUALIZACIÓN DEL SISTEMA",
        system_maintenance: "ACTUALIZACIÓN DEL SISTEMA",
        system_security: "ACTUALIZACIÓN DEL SISTEMA",
        system_coming_soon: "ACTUALIZACIÓN DEL SISTEMA",
        system_welcome: "ACTUALIZACIÓN DEL SISTEMA",
        system_profile_reminder: "ACTUALIZACIÓN DEL SISTEMA",
        general: "ACTUALIZACIÓN DEL SISTEMA",
      },
    },
    companyNotifications: {
      empty: {
        none: "Aún no hay notificaciones.",
        noneDescription:
          "Las notificaciones aparecerán aquí cuando los oficiales respondan a invitaciones, soliciten turnos o haya actualizaciones.",
        noMatch: "No hay notificaciones en esta pestaña.",
      },
      actions: {
        viewApplicants: "Ver Solicitantes",
        viewShifts: "Ver Turnos",
        viewDetails: "Ver Detalles",
        delete: "Eliminar",
        unread: "No leído",
      },
      kinds: {
        invite_accepted: "INVITACIÓN ACEPTADA",
        invite_declined: "INVITACIÓN RECHAZADA",
        new_application: "NUEVA SOLICITUD",
        application_withdrawn: "SOLICITUD RETIRADA",
        shift_update: "ACTUALIZACIÓN DE TURNO",
        shift_cancelled: "TURNO CANCELADO",
        system_update: "ACTUALIZACIÓN DEL SISTEMA",
        general: "ACTUALIZACIÓN DEL SISTEMA",
      },
    },
    shifts: {
      searchTitle: "Buscar Turnos",
      searchSubtitle: "Configura tus filtros para encontrar el turno perfecto.",
      empty: {
        none: "Aún no hay turnos publicados.",
        noneDescription: "Vuelve pronto para nuevas oportunidades de seguridad.",
      },
      noMatch: {
        title: "Sin Turnos Coincidentes",
        description: "No encontramos turnos abiertos que coincidan con tus filtros.",
      },
      actions: {
        viewOpenShifts: "Ver Turnos Abiertos",
        clearFilters: "Limpiar Filtros",
        viewAllOpen: "Ver Todos los Turnos Abiertos",
      },
      results: { oneOpenShift: "1 Turno Abierto", manyOpenShifts: "{count} Turnos Abiertos" },
    },
    companyShifts: {
      tabs: { all: "Todos los Turnos", open: "Abiertos", filled: "Cubiertos", cancelled: "Cancelados" },
      searchPlaceholder: "Buscar turnos...",
      searchAria: "Buscar turnos",
      empty: {
        none: "Aún no hay turnos publicados.",
        noneDescription: "Publica tu primer turno para comenzar a recibir solicitantes.",
        noMatch: "Ningún turno coincide con este filtro.",
      },
      actions: {
        postShift: "Publicar Turno",
        subscribeToPost: "Suscríbete para Publicar Turnos",
        viewBilling: "Ver Facturación",
      },
      blockMessage: {
        profileIncomplete:
          "Completa el perfil de tu empresa para iniciar tu prueba gratuita de 7 días y publicar turnos.",
        trialExpired:
          "Tu prueba gratuita ha terminado. Suscríbete para volver a desbloquear herramientas de publicación y solicitantes.",
        subscriptionRequired:
          "Se requiere una suscripción o prueba activa para publicar nuevos turnos.",
      },
      table: {
        status: "Estado",
        shiftLocation: "Turno / Ubicación",
        dateTime: "Fecha y Hora",
        pay: "Pago",
        filled: "Cubiertos",
        applicants: "Solicitantes",
        actions: "Acciones",
        roster: "Plantilla",
        hide: "Ocultar",
      },
    },
    companyApplicants: {
      tabs: {
        all: "Todos los Solicitantes",
        applicants: "Solicitantes",
        pending: "Pendiente",
        accepted: "Aceptado",
        rejected: "Rechazado",
      },
      searchPlaceholder: "Buscar solicitantes...",
      filter: "Filtrar",
      empty: {
        none: "Aún no hay solicitantes.",
        noneDescription: "Cuando los oficiales soliciten tus turnos, aparecerán aquí.",
        noMatch: "Ningún solicitante coincide con este filtro.",
      },
      actions: {
        view: "Ver",
        accept: "Aceptar",
        reject: "Rechazar",
        backToShifts: "Volver a Mis Turnos",
      },
      errors: { updateFailed: "No se pudo actualizar el solicitante" },
    },
    invites: {
      tabs: { all: "Todos", pending: "Pendiente", accepted: "Aceptado", declined: "Declinado" },
      empty: {
        none: "No se encontraron invitaciones.",
        noneDescription: "Cuando una empresa te invite a un turno, aparecerá aquí.",
        noTab: "No hay invitaciones en esta pestaña.",
        noTabDescription: "Prueba otra pestaña o ajusta tus filtros.",
      },
      sort: { label: "Ordenar por", newest: "Más reciente", oldest: "Más antiguo" },
      count: "{count} invitación(es)",
      statuses: { PENDING: "Pendiente", ACCEPTED: "Aceptado", DECLINED: "Declinado" },
      card: {
        acceptInvite: "Aceptar Invitación",
        declineInvite: "Rechazar Invitación",
        accepting: "Aceptando...",
        declining: "Rechazando...",
        viewShift: "Ver Turno",
        viewShiftDetails: "Ver Detalles del Turno",
        pendingHint:
          "Cuando aceptes una invitación, se moverá a tus Turnos Aceptados.",
        updateFailed: "No se pudo actualizar la invitación.",
        deleteConfirm: "¿Eliminar esta invitación rechazada de tu lista?",
        deleteFailed: "No se pudo eliminar la invitación",
        invitedPrefix: "Invitado {time}",
      },
      howItWorks: {
        title: "Cómo Funcionan las Invitaciones",
        step1Title: "La empresa te invita",
        step1Description: "Una empresa encuentra tu perfil y te invita a un turno.",
        step2Title: "Revisas el turno",
        step2Description: "Revisa los detalles y decide si es adecuado para ti.",
        step3Title: "Acepta la invitación",
        step3Description:
          "Si aceptas, el turno se agrega automáticamente a tus Turnos Aceptados.",
        step4Title: "Asiste y cobra",
        step4Description:
          "Trabaja el turno y recibe el pago directamente de la empresa de seguridad. La empresa es responsable de pagarte—no a través de FlexOfficers.",
      },
      footer: {
        howItWorks: "Cómo funcionan las invitaciones",
        otherUpdates: "Otras Actualizaciones",
        viewAll: "Ver Todo",
      },
    },
  },
  status: {
    application: {
      PENDING: "Pendiente",
      ACCEPTED: "Aceptado",
      REJECTED: "Rechazado",
      WITHDRAWN: "Retirado",
    },
    shift: {
      OPEN: "Abierto",
      INVITED: "Invitado",
      PARTIALLY_FILLED: "Parcialmente Cubierto",
      FILLED: "Cubierto",
      CANCELLED: "Cancelado",
      COMPLETED: "Completado",
    },
  },
  filters: {
    workType: { all: "Todos", gig: "Por Turno", fullTime: "Tiempo Completo", partTime: "Medio Tiempo" },
    sort: { newest: "Más Reciente", highestPay: "Mayor Pago", earliestStart: "Inicio Más Temprano" },
    summary: {
      anyLocation: "Cualquier ubicación",
      anyDate: "Cualquier fecha",
      anyPay: "Cualquier pago",
      allTypes: "Todos los tipos",
      moreFilters: "Más filtros",
      placeholder: "Configura filtros para explorar turnos",
    },
    shifts: {
      location: "Ubicación",
      enterCity: "Ingresa ciudad",
      allStates: "Todos los Estados",
      date: "Fecha",
      pay: "Pago",
      minPay: "Mín $/hr",
      workType: "Tipo de Trabajo",
      moreFilters: "Más Filtros",
      armed: "Armado",
      unarmed: "Desarmado",
      dayShift: "Turno de Día",
      nightShift: "Turno de Noche",
      overnight: "Nocturno",
      clearFilters: "Limpiar Filtros",
      sortBy: "Ordenar por",
      applySearch: "Aplicar Búsqueda",
      city: "Ciudad",
      state: "Estado",
      active: "Activo",
    },
    shiftOptions: {
      gig: "Por Turno",
      fullTime: "Tiempo Completo",
      partTime: "Medio Tiempo",
      dayShift: "Turno de Día",
      nightShift: "Turno de Noche",
      overnight: "Nocturno",
      armed: "Armado",
      unarmed: "Desarmado",
      either: "Cualquiera",
    },
  },
  shiftDetail: {
    heading: "Detalles del turno",
    perHour: "/hr",
    estimatedPay: "Pago estimado:",
    estimatedEarnings: "Ganancias estimadas {pay}",
    positions: {
      open: "{open} de {total} abierto(s)",
      stillOpen: "{open} de {total} aún abierto(s)",
      available: "{open} de {total} disponible(s)",
    },
    fields: {
      location: "Ubicación",
      positions: "Posiciones",
      start: "Inicio",
      end: "Fin",
      workType: "Tipo de trabajo",
      shiftTime: "Horario del turno",
      armedRequirement: "Requisito armado",
      openPositions: "Posiciones Abiertas",
    },
    sections: {
      description: "Descripción",
      noDescription: "No se proporcionó descripción.",
      requirements: "Requisitos",
      specialRequirements: "Requisitos especiales",
      reportingInstructions: "Instrucciones de reporte",
      shiftInformation: "Información del Turno",
      about: "Acerca de este Turno",
      company: "Empresa",
      contact: "Contacto",
    },
    requirements: {
      license: "Requisitos de Licencia",
      certification: "Requisitos de Certificación",
      other: "Otros Requisitos",
      additional: "Requisitos Adicionales",
    },
    company: {
      phone: "Teléfono",
      email: "Correo",
      contactLocked:
        "Los datos de contacto de la empresa se comparten después de que tu solicitud sea aceptada.",
      noPublicProfile: "Esta empresa aún no ha publicado un perfil público.",
    },
    actions: {
      back: "← Atrás",
      applicationAccepted: "Solicitud Aceptada",
      applicationPending: "Solicitud Pendiente",
      completeProfileToApply: "Completa el Perfil para Solicitar",
      signInToApply: "Inicia sesión para solicitar",
      apply: "Solicitar Turno",
      applying: "Solicitando...",
      applied: "Solicitado",
      notAccepting: "No acepta solicitudes",
      viewCompanyProfile: "Ver Perfil de Empresa",
    },
    toast: {
      applySuccess: "¡Solicitud enviada!",
      applyFailed: "No se pudo solicitar el turno",
    },
  },
  onboarding: {
    saving: "Guardando...",
    officer: {
      title: "Oficial de Seguridad",
      description:
        "Explora turnos y encuentra las oportunidades adecuadas para tu horario y experiencia.",
      cta: "Continuar como Oficial",
      groups: {
        findWork: "Encontrar Trabajo",
        buildCareer: "Construye Tu Carrera",
        afterAcceptance: "Después de la Aceptación",
      },
      items: {
        findOpenShifts: "Encuentra turnos abiertos",
        getInvites: "Recibe invitaciones de empresas",
        applyFast: "Solicita turnos en segundos",
        buildProfile: "Construye tu perfil profesional",
        showcaseLicenses: "Muestra licencias y certificaciones",
        flexibleSchedule: "Trabaja cuando se ajuste a tu horario",
        contactAfterAcceptance: "Obtén información de contacto de la empresa tras la aceptación",
        trackApplications: "Sigue tus solicitudes y próximos turnos",
      },
    },
    company: {
      title: "Empresa de Seguridad",
      description: "Publica turnos, revisa oficiales con licencia y construye tu equipo de seguridad.",
      cta: "Continuar como Empresa",
      groups: {
        postJobs: "Publicar Trabajos",
        hireOfficers: "Contratar Oficiales",
        manageTeam: "Gestionar Equipo",
      },
      items: {
        publicPrivatePosts: "Crea publicaciones públicas y privadas",
        postOpenShifts: "Publica turnos abiertos",
        fillFaster: "Cubre turnos más rápido",
        inviteOfficers: "Invita oficiales a solicitar",
        reviewProfiles: "Revisa perfiles, licencias y certificaciones",
        acceptReject: "Acepta o rechaza solicitantes",
        manageStaff: "Gestiona personal",
        manageAccepted: "Gestiona oficiales aceptados",
      },
    },
    disclaimer: {
      title: "Importante",
      body: "Las empresas son responsables de verificar licencias y credenciales. Los oficiales son responsables de mantener calificaciones válidas.",
    },
    errors: { saveFailed: "No se pudo guardar tu rol. Inténtalo de nuevo." },
  },
  billing: {
    status: { trial: "Prueba", active: "Activo", expired: "Expirado" },
    empty: {
      completeProfileTitle: "Completa el perfil de tu empresa",
      completeProfileDescription: "Agrega los datos de tu empresa antes de administrar la facturación.",
      completeProfileCta: "Completar Perfil de Empresa",
    },
    errors: {
      loadFailedTitle: "No se pudo cargar la facturación",
      loadFailedDescription:
        "La facturación no está disponible temporalmente. No se pudieron cargar los detalles de tu suscripción. Inténtalo de nuevo en un momento.",
    },
    sections: {
      currentPlan: "Plan Actual",
      subscriptionManagement: "Gestión de Suscripción",
      billingSummary: "Resumen de Facturación",
      paymentMethod: "Método de Pago",
      billingHistory: "Historial de Facturación",
      billingSupport: "Soporte de Facturación",
    },
    labels: {
      plan: "Plan",
      billingCycle: "Ciclo de Facturación",
      status: "Estado",
      nextRenewal: "Próxima Renovación",
      nextCharge: "Próximo Cargo",
      autoRenewal: "Renovación Automática",
      enabled: "Activada",
      notEnabled: "No activada",
      amount: "Monto",
      included: "Incluido",
      perYear: "/ año",
      trialEnds: "La Prueba Termina",
      daysRemaining: "Días Restantes",
      dayRemaining: "{count} día restante",
      daysRemainingPlural: "{count} días restantes",
      default: "Predeterminado",
      expires: "Expira",
      notScheduled: "No programado",
      businessHours: "Horario Comercial",
      subscriptionQuestions: "¿Preguntas sobre tu suscripción?",
    },
    actions: {
      startSubscription: "Iniciar Suscripción",
      startSubscriptionNow: "Iniciar Suscripción Ahora",
      manageSubscription: "Administrar Suscripción",
      updatePaymentMethod: "Actualizar Método de Pago",
      manageShifts: "Administrar Turnos",
      download: "Descargar",
    },
    emptyStates: {
      noPaymentMethod: "No hay método de pago registrado.",
      subscribeToAddPayment: "Inicia una suscripción para agregar un método de pago.",
      stripePaymentPending:
        "Los detalles del método de pago aparecerán aquí cuando Stripe esté conectado.",
      noBillingHistory: "Aún no hay historial de facturación.",
      stripeHistoryPending:
        "El historial de facturación aparecerá aquí cuando Stripe esté conectado.",
      trialExpired: "Tu prueba ha expirado.",
    },
    stripe: {
      notConfigured: "La facturación de Stripe aún no está configurada.",
      noAccount: "Aún no hay una cuenta de facturación de Stripe conectada.",
    },
    table: {
      date: "Fecha",
      description: "Descripción",
      status: "Estado",
      amount: "Monto",
      invoice: "Factura",
    },
    plan: { name: "FlexOfficers Anual", yearly: "Anual" },
    support: { hours: "Lunes – Viernes, 9AM – 6PM EST" },
    trial: {
      durationLabel: "Prueba Gratuita de 7 Días",
      profileStartNote:
        "Tu prueba gratuita comienza automáticamente cuando completes el perfil de tu empresa (nombre, correo, teléfono, dirección, ciudad, estado, etc.).",
      activeNote:
        "No se te cobrará cuando termine la prueba. Suscríbete en cualquier momento para volver a desbloquear funciones.",
      expiredNote:
        "Tu prueba gratuita ha terminado. Suscríbete para volver a desbloquear publicaciones, búsqueda de oficiales y gestión de solicitantes.",
      pricingBadge: "prueba gratuita de 7 días",
      pricingStartNote:
        "Tu prueba comienza después de completar el perfil de tu empresa. No se te cobrará cuando termine la prueba.",
      pricingSubscribeNote:
        "Suscríbete cuando estés listo para volver a desbloquear funciones de empresa.",
      trialEndsPrefix: "La prueba termina:",
      day: "día",
      days: "días",
      remaining: "restantes",
    },
  },
  admin: {
    navAria: "Panel de administración",
    badge: "Admin",
    signOut: "Cerrar sesión",
    fallbackName: "Admin",
    items: {
      dashboard: "Panel",
      companies: "Empresas",
      officers: "Oficiales",
      shifts: "Turnos",
      applications: "Solicitudes",
      reports: "Informes",
      auditLogs: "Registros de Auditoría",
      settings: "Configuración",
    },
  },
  forms: {
    profile: {
      completeToApply: "Completa tu perfil para solicitar",
      finishItems: "Completa los elementos siguientes antes de poder solicitar turnos.",
    },
    cancelAssignment: {
      title: "Cancelar Asignación",
      confirm:
        "¿Cancelar esta asignación? La empresa será notificada y la vacante del turno puede volver a estar disponible.",
      failed: "No se pudo cancelar la asignación",
    },
    withdrawApplication: {
      label: "Retirar Solicitud",
      confirm:
        "¿Retirar esta solicitud? Ya no serás considerado para este turno.",
      success: "Solicitud retirada.",
      failed: "No se pudo retirar la solicitud",
    },
    deleteInvite: {
      confirm: "¿Eliminar esta invitación rechazada de tu lista?",
      failed: "No se pudo eliminar la invitación",
    },
  },
  commonExtras: {
    notProvided: "No proporcionado",
    browseShifts: "Explorar Turnos",
    browseOpenShifts: "Explorar Turnos Abiertos",
    important: "Importante",
    noMessagesYet: "Aún no hay mensajes.",
    messagesEmptyDescription:
      "La mensajería con empresas no está activa en la Versión 1.0.",
  },
  ...profileShiftEs,
};
