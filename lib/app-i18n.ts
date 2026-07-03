import type { LandingLanguage } from "@/lib/landing-i18n";
import { uiEn, uiEs, type UiTranslations } from "@/lib/i18n/ui-translations";
import type { ProfileShiftTranslations } from "@/lib/i18n/profile-shift-translations";

export type AppTranslations = {
  appNav: {
    aria: {
      officerNav: string;
      companyNav: string;
      officerDashboard: string;
      companyDashboard: string;
      notifications: string;
      viewProfile: string;
      unread: string;
    };
    signOut: string;
    officerFallback: string;
    companyFallback: string;
    officerMobile: {
      home: string;
      browse: string;
      invites: string;
      applications: string;
      profile: string;
      settings: string;
    };
    officerSidebar: {
      dashboard: string;
      browseShifts: string;
      companyInvites: string;
      applications: string;
      acceptedShifts: string;
      upcomingShifts: string;
      notifications: string;
      myProfile: string;
      settings: string;
    };
    companyMobile: {
      home: string;
      shifts: string;
      applicants: string;
      officers: string;
      staff: string;
      profile: string;
      settings: string;
    };
    companySidebar: {
      home: string;
      postShift: string;
      myShifts: string;
      applicants: string;
      notifications: string;
      searchOfficers: string;
      staff: string;
      companyProfile: string;
      billing: string;
      settings: string;
      securityLeads: string;
      leadApplications: string;
    };
    clientMobile: {
      home: string;
      leads: string;
      create: string;
      applicants: string;
      profile: string;
      settings: string;
    };
    clientSidebar: {
      dashboard: string;
      myLeads: string;
      createLead: string;
      applicants: string;
      profile: string;
      settings: string;
    };
    clientFallback: string;
  };
  common: {
    quickActions: string;
    quickActionsSubtitle: string;
    viewAll: string;
    addNow: string;
    completeProfile: string;
    editProfile: string;
    welcomeBack: string;
    welcome: string;
    welcomeName: string;
    finishSetup: string;
    goodMorning: string;
    goodAfternoon: string;
    goodEvening: string;
    welcomeBackName: string;
    postNewShift: string;
    to: string;
    shift: string;
    shifts: string;
    noData: string;
    total: string;
    comingSoon: string;
  };
  dashboard: {
    setup: {
      onboarding: { title: string; description: string; action: string };
      officerProfile: { title: string; description: string; action: string };
      companyProfile: { title: string; description: string; action: string };
    };
    officer: {
      headerSubtitle: string;
      statApplications: string;
      statApplicationsHint: string;
      statAccepted: string;
      statAcceptedHint: string;
      statUpcoming: string;
      statUpcomingHint: string;
      statAvailable: string;
      statAvailableHint: string;
      profileCompletion: string;
      profileReady: string;
      profileIncomplete: string;
      profileAria: string;
      allFieldsComplete: string;
      fieldsLeft: string;
      fieldsLeftOne: string;
      recommendedSteps: string;
      recommendedStepsSubtitle: string;
      profileFields: {
        phone: string;
        armedStatuses: string;
        experienceCategories: string;
        experienceYears: string;
        licenses: string;
      };
      quickActions: {
        browseShifts: string;
        browseShiftsDesc: string;
        applications: string;
        applicationsDesc: string;
        acceptedShifts: string;
        acceptedShiftsDesc: string;
        upcomingShifts: string;
        upcomingShiftsDesc: string;
      };
      sidebar: {
        upcomingShift: string;
        acceptedStartingSoon: string;
        acceptedStartingSoonOne: string;
        viewUpcoming: string;
        noUpcoming: string;
        noUpcomingDesc: string;
        browseShifts: string;
        announcements: string;
        noAnnouncements: string;
        noAnnouncementsDesc: string;
        viewNotifications: string;
      };
    };
    company: {
      headerSubtitle: string;
      thereFallback: string;
      statTotalShifts: string;
      statApplicants: string;
      statFilledShifts: string;
      statUpcomingShifts: string;
      statOpenFilledPast: string;
      statApplicantBreakdown: string;
      statFilledThisMonth: string;
      statConfirmedNext7: string;
      quickActions: {
        postShift: string;
        postShiftDesc: string;
        viewApplicants: string;
        viewApplicantsDesc: string;
        upcomingShifts: string;
        upcomingShiftsDesc: string;
        manageOfficers: string;
        manageOfficersDesc: string;
        securityLeads: string;
        securityLeadsDesc: string;
        leadApplications: string;
        leadApplicationsDesc: string;
        staff: string;
        staffDesc: string;
      };
      upcomingShifts: string;
      noConfirmedSoon: string;
      noConfirmed7Days: string;
      tableDate: string;
      tableShift: string;
      tableLocation: string;
      tableOpen: string;
      openPositions: string;
      openPositionsOne: string;
      openCount: string;
      applicantsOverview: string;
      applicantsEmpty: string;
      donutPending: string;
      donutInvited: string;
      donutAccepted: string;
      profileBannerTitle: string;
      profileBannerPercent: string;
      profileBannerNote: string;
      profileFields: {
        companyName: string;
        contactEmail: string;
        phone: string;
        address: string;
        city: string;
        state: string;
      };
    };
    client: {
      title: string;
      subtitle: string;
      createLead: string;
      statMyLeads: string;
      statMyLeadsHint: string;
      statMyLeadsLink: string;
      statActiveLeads: string;
      statActiveLeadsHint: string;
      statActiveLeadsLink: string;
      statPendingApplicants: string;
      statPendingApplicantsHint: string;
      statPendingApplicantsLink: string;
      statPostingFee: string;
      statPostingFeeHint: string;
      statPostingFeeLink: string;
      recentLeads: string;
      viewAll: string;
      applicantsOverview: string;
      applicantsEmpty: string;
      donutHired: string;
      donutPendingReview: string;
      donutDeclined: string;
      donutWithdrawn: string;
      totalApplicants: string;
      applicantsCount: string;
      applicantCountOne: string;
      recentLeadsEmptyTitle: string;
      recentLeadsEmptyDesc: string;
      quickActions: {
        createLead: string;
        createLeadDesc: string;
        viewApplicants: string;
        viewApplicantsDesc: string;
        billingHistory: string;
        billingHistoryDesc: string;
      };
      ctaTitle: string;
      ctaDescription: string;
    };
    clientSecurityRequests: {
      title: string;
      subtitle: string;
      createLead: string;
      tabs: {
        all: string;
        active: string;
        pending: string;
        completed: string;
        cancelled: string;
      };
      searchPlaceholder: string;
      filter: string;
      stats: {
        total: string;
        totalHint: string;
        active: string;
        activeHint: string;
        pending: string;
        pendingHint: string;
        completed: string;
        completedHint: string;
        cancelled: string;
        cancelledHint: string;
      };
      table: {
        request: string;
        location: string;
        dateTime: string;
        officers: string;
        budget: string;
        status: string;
        applicants: string;
        actions: string;
        officersLabel: string;
        budgetTotal: string;
        view: string;
      };
      emptyTitle: string;
      emptyDescription: string;
      emptyFiltered: string;
      ctaTitle: string;
      ctaDescription: string;
    };
    clientLeadApplications: {
      title: string;
      subtitle: string;
      createLead: string;
      tabs: {
        all: string;
        pending: string;
        hired: string;
        declined: string;
        withdrawn: string;
      };
      searchPlaceholder: string;
      filters: string;
      stats: {
        total: string;
        totalHint: string;
        pending: string;
        pendingHint: string;
        hired: string;
        hiredHint: string;
        declined: string;
        declinedHint: string;
      };
      table: {
        applicant: string;
        leadRequest: string;
        appliedOn: string;
        status: string;
        offer: string;
        actions: string;
        offerTotal: string;
        viewProfile: string;
      };
      emptyTitle: string;
      emptyDescription: string;
      emptyFiltered: string;
      ctaTitle: string;
      ctaDescription: string;
    };
    companySecurityLeads: {
      title: string;
      subtitle: string;
      myApplications: string;
      viewMyApplications: string;
      tabs: {
        all: string;
        active: string;
        filled: string;
        closed: string;
        cancelled: string;
      };
      searchPlaceholder: string;
      filter: string;
      stats: {
        total: string;
        totalHint: string;
        active: string;
        activeHint: string;
        filled: string;
        filledHint: string;
        closed: string;
        closedHint: string;
        cancelled: string;
        cancelledHint: string;
      };
      table: {
        leadTitle: string;
        location: string;
        dateTime: string;
        officers: string;
        budget: string;
        status: string;
        actions: string;
        officersLabel: string;
        budgetTotal: string;
        viewDetails: string;
      };
      emptyTitle: string;
      emptyDescription: string;
      emptyFiltered: string;
      ctaTitle: string;
      ctaDescription: string;
    };
    companyLeadApplications: {
      title: string;
      subtitle: string;
      browseLeads: string;
      tabs: {
        all: string;
        pending: string;
        hired: string;
        notSelected: string;
        withdrawn: string;
      };
      searchPlaceholder: string;
      filters: string;
      stats: {
        total: string;
        totalHint: string;
        pending: string;
        pendingHint: string;
        hired: string;
        hiredHint: string;
        notSelected: string;
        notSelectedHint: string;
      };
      table: {
        leadRequest: string;
        client: string;
        appliedOn: string;
        status: string;
        offer: string;
        actions: string;
        offerTotal: string;
        viewDetails: string;
      };
      emptyTitle: string;
      emptyDescription: string;
      emptyFiltered: string;
      ctaTitle: string;
      ctaDescription: string;
    };
  };
  pages: {
    onboarding: { title: string; subtitle: string };
    shifts: { title: string; subtitle: string };
    shiftsCreate: { title: string; subtitle: string };
    officerInvites: { title: string; subtitle: string };
    officerApplications: { title: string; subtitle: string };
    officerAcceptedShifts: { title: string; subtitle: string };
    officerUpcomingShifts: { title: string; subtitle: string };
    officerNotifications: { title: string; subtitle: string };
    officerProfile: { title: string; subtitle: string };
    officerMessages: { title: string; subtitle: string };
    companyShifts: { title: string; subtitle: string };
    companyApplications: { title: string; subtitle: string };
    companyOfficers: { title: string; subtitle: string };
    companyStaff: { title: string; subtitle: string };
    companyNotifications: { title: string; subtitle: string };
    companyAcceptedOfficers: { title: string; subtitle: string };
    companyCompletedShifts: { title: string; subtitle: string };
    companyProfile: { title: string; subtitle: string };
    companyProfileEdit: { title: string; subtitle: string };
    companyBilling: { title: string; subtitle: string };
    companyReports: { title: string; subtitle: string };
    clientProfile: { title: string; subtitle: string };
  };
} & UiTranslations &
  Pick<ProfileShiftTranslations, "client">;

type AppCore = Omit<AppTranslations, keyof UiTranslations>;

const en: AppCore = {
  appNav: {
    aria: {
      officerNav: "Officer navigation",
      companyNav: "Company navigation",
      officerDashboard: "Officer dashboard",
      companyDashboard: "Company dashboard",
      notifications: "Notifications",
      viewProfile: "View profile",
      unread: "unread",
    },
    signOut: "Sign Out",
    officerFallback: "Officer",
    companyFallback: "Company",
    clientFallback: "Client",
    officerMobile: {
      home: "Home",
      browse: "Browse",
      invites: "Invites",
      applications: "Applications",
      profile: "Profile",
      settings: "Settings",
    },
    officerSidebar: {
      dashboard: "Dashboard",
      browseShifts: "Browse Shifts",
      companyInvites: "Company Invites",
      applications: "Applications",
      acceptedShifts: "Accepted Shifts",
      upcomingShifts: "Upcoming Shifts",
      notifications: "Notifications",
      myProfile: "My Profile",
      settings: "Settings",
    },
    companyMobile: {
      home: "Home",
      shifts: "Shifts",
      applicants: "Applicants",
      officers: "Officers",
      staff: "Staff",
      profile: "Profile",
      settings: "Settings",
    },
    companySidebar: {
      home: "Home",
      postShift: "Post a Shift",
      myShifts: "My Shifts",
      applicants: "Applicants",
      notifications: "Notifications",
      searchOfficers: "Search Officers",
      staff: "Staff",
      companyProfile: "Company Profile",
      billing: "Billing & Plan",
      settings: "Settings",
      securityLeads: "Security Leads",
      leadApplications: "My Lead Applications",
    },
    clientMobile: {
      home: "Home",
      leads: "Leads",
      create: "Create",
      applicants: "Applicants",
      profile: "Profile",
      settings: "Settings",
    },
    clientSidebar: {
      dashboard: "Dashboard",
      myLeads: "My Leads",
      createLead: "Create Lead",
      applicants: "Applicants",
      profile: "Profile",
      settings: "Settings",
    },
  },
  common: {
    quickActions: "Quick Actions",
    quickActionsSubtitle: "Jump to the tools you use most.",
    viewAll: "View All",
    addNow: "Add Now",
    completeProfile: "Complete Profile",
    editProfile: "Edit Profile",
    welcomeBack: "Welcome back,",
    welcome: "Welcome",
    welcomeName: "Welcome, {name}",
    finishSetup: "Finish setup to start using FlexOfficers.",
    goodMorning: "Good Morning,",
    goodAfternoon: "Good Afternoon,",
    goodEvening: "Good Evening,",
    welcomeBackName: "Welcome back, {name}!",
    postNewShift: "Post a New Shift",
    to: "to",
    shift: "shift",
    shifts: "shifts",
    noData: "No data",
    total: "Total",
    comingSoon: "Coming soon.",
  },
  dashboard: {
    setup: {
      onboarding: {
        title: "Complete onboarding",
        description:
          "Choose whether you are joining as an officer or a company before using the dashboard.",
        action: "Go to Onboarding",
      },
      officerProfile: {
        title: "Set up your officer profile",
        description:
          "Your account is registered as an officer. Complete your profile to browse shifts and apply.",
        action: "Complete Officer Profile",
      },
      companyProfile: {
        title: "Set up your company profile",
        description:
          "Your account is registered as a company. Add your company details to post shifts and review applicants.",
        action: "Complete Company Profile",
      },
    },
    officer: {
      headerSubtitle: "Here's what's happening with your account today.",
      statApplications: "Applications",
      statApplicationsHint: "Shifts you've applied to",
      statAccepted: "Accepted Shifts",
      statAcceptedHint: "Assignments you've won",
      statUpcoming: "Upcoming Shifts",
      statUpcomingHint: "Accepted shifts starting soon",
      statAvailable: "Available Shifts",
      statAvailableHint: "Open shifts posted by companies",
      profileCompletion: "Profile Completion",
      profileReady: "Ready to apply to shifts and be reviewed by companies.",
      profileIncomplete: "Complete your profile before you can apply to shifts.",
      profileAria: "Profile completion",
      allFieldsComplete: "All fields complete",
      fieldsLeft: "{count} fields left",
      fieldsLeftOne: "1 field left",
      recommendedSteps: "Recommended Next Steps",
      recommendedStepsSubtitle: "Complete these before you can apply to shifts.",
      profileFields: {
        phone: "Add your phone number",
        armedStatuses: "Select armed and/or unarmed",
        experienceCategories: "Add experience categories",
        experienceYears: "Add your years of experience",
        licenses: "Add at least one license",
      },
      quickActions: {
        browseShifts: "Browse Shifts",
        browseShiftsDesc: "Explore open assignments.",
        applications: "Applications",
        applicationsDesc: "Track your applications.",
        acceptedShifts: "My Shifts",
        acceptedShiftsDesc: "View confirmed assignments.",
        upcomingShifts: "Upcoming Shifts",
        upcomingShiftsDesc:
          "See shifts starting soon, clock in and clock out. Once you clock out, it moves to My Shifts → Completed.",
      },
      sidebar: {
        upcomingShift: "Upcoming Shift",
        acceptedStartingSoon: "Accepted shifts starting soon.",
        acceptedStartingSoonOne: "Accepted shift starting soon.",
        viewUpcoming: "View Upcoming Shifts",
        noUpcoming: "No upcoming shifts",
        noUpcomingDesc: "Future accepted shifts appear here.",
        browseShifts: "Browse Shifts",
        announcements: "Announcements",
        noAnnouncements: "No announcements",
        noAnnouncementsDesc: "Platform updates will show here.",
        viewNotifications: "View Notifications",
      },
    },
    company: {
      headerSubtitle:
        "Here's what's happening with your security operations today.",
      thereFallback: "there",
      statTotalShifts: "Total Shifts",
      statApplicants: "Applicants",
      statFilledShifts: "Filled Shifts",
      statUpcomingShifts: "Upcoming Shifts",
      statOpenFilledPast: "Open {open} · Filled {filled} · Past {past}",
      statApplicantBreakdown:
        "{pending} Pending · {invited} Invited · {accepted} Accepted",
      statFilledThisMonth: "Filled this month",
      statConfirmedNext7: "Confirmed in the next 7 days",
      quickActions: {
        postShift: "Post a New Shift",
        postShiftDesc: "Create a shift and start receiving applicants.",
        viewApplicants: "View Applicants",
        viewApplicantsDesc: "Review officer applications.",
        upcomingShifts: "Upcoming Shifts",
        upcomingShiftsDesc: "See confirmed shifts.",
        manageOfficers: "Manage Officers",
        manageOfficersDesc: "Search and review officer profiles.",
        securityLeads: "Security Leads",
        securityLeadsDesc:
          "Browse client security requests and apply for new opportunities.",
        leadApplications: "My Lead Applications",
        leadApplicationsDesc:
          "Track the security requests your company applied to.",
        staff: "Staff",
        staffDesc: "View your saved officers.",
      },
      upcomingShifts: "Upcoming Shifts",
      noConfirmedSoon: "No confirmed shifts starting soon.",
      noConfirmed7Days: "No confirmed shifts in the next 7 days.",
      tableDate: "Date",
      tableShift: "Shift",
      tableLocation: "Location",
      tableOpen: "Open",
      openPositions: "{count} open positions remaining",
      openPositionsOne: "1 open position remaining",
      openCount: "{count} open",
      applicantsOverview: "Applicants Overview",
      applicantsEmpty:
        "Applicant and invite activity will appear here once officers apply or accept your invites.",
      donutPending: "Pending",
      donutInvited: "Invited",
      donutAccepted: "Accepted",
      profileBannerTitle: "Complete your company profile",
      profileBannerPercent: "{percent}% complete",
      profileBannerNote:
        "Complete your profile (company name, email, phone, address, city, state, etc.) to start your 7-day free trial on the FlexOfficers Annual plan.",
      profileFields: {
        companyName: "Company name",
        contactEmail: "Contact email",
        phone: "Phone number",
        address: "Address",
        city: "City",
        state: "State",
      },
    },
    client: {
      title: "Client Dashboard",
      subtitle: "Post security needs and review company applicants.",
      createLead: "+ Create Lead",
      statMyLeads: "My Leads",
      statMyLeadsHint: "Total leads created",
      statMyLeadsLink: "View all leads →",
      statActiveLeads: "Active Leads",
      statActiveLeadsHint: "Currently active",
      statActiveLeadsLink: "View active leads →",
      statPendingApplicants: "Pending Applicants",
      statPendingApplicantsHint: "Awaiting review",
      statPendingApplicantsLink: "Review applicants →",
      statPostingFee: "Posting Fee",
      statPostingFeeHint: "Per security lead",
      statPostingFeeLink: "Payment history →",
      recentLeads: "Recent Leads",
      viewAll: "View all",
      applicantsOverview: "Applicants Overview",
      applicantsEmpty:
        "Company applications will appear here once security companies apply to your leads.",
      donutHired: "Hired",
      donutPendingReview: "Pending Review",
      donutDeclined: "Declined",
      donutWithdrawn: "Withdrawn",
      totalApplicants: "Total Applicants",
      applicantsCount: "{count} Applicants",
      applicantCountOne: "1 Applicant",
      recentLeadsEmptyTitle: "No security requests yet.",
      recentLeadsEmptyDesc:
        "Create your first security request and start receiving applications from trusted security companies.",
      quickActions: {
        createLead: "Create New Lead",
        createLeadDesc: "Post a new security request",
        viewApplicants: "View Applicants",
        viewApplicantsDesc: "Review and manage applicants",
        billingHistory: "Billing History",
        billingHistoryDesc: "View your payment history",
      },
      ctaTitle: "Need Qualified Security Officers?",
      ctaDescription:
        "Post your security need and get matched with qualified, verified security professionals.",
    },
    clientSecurityRequests: {
      title: "My Security Requests",
      subtitle: "Manage and track all your posted security requests.",
      createLead: "+ Create Lead",
      tabs: {
        all: "All Requests",
        active: "Active",
        pending: "Pending",
        completed: "Completed",
        cancelled: "Cancelled",
      },
      searchPlaceholder: "Search requests...",
      filter: "Filter",
      stats: {
        total: "Total Requests",
        totalHint: "All time",
        active: "Active",
        activeHint: "Currently active",
        pending: "Pending",
        pendingHint: "Awaiting payment",
        completed: "Completed",
        completedHint: "Finished",
        cancelled: "Cancelled",
        cancelledHint: "Cancelled requests",
      },
      table: {
        request: "Request",
        location: "Location",
        dateTime: "Date & Time",
        officers: "Officers",
        budget: "Budget",
        status: "Status",
        applicants: "Applicants",
        actions: "Actions",
        officersLabel: "Officers",
        budgetTotal: "Total",
        view: "View",
      },
      emptyTitle: "No security requests yet",
      emptyDescription:
        "Create your first security request to receive applications from trusted security companies.",
      emptyFiltered: "No requests match your filters.",
      ctaTitle: "Need qualified security officers?",
      ctaDescription:
        "Post a new security request and get matched with verified security professionals.",
    },
    clientLeadApplications: {
      title: "My Lead Applications",
      subtitle: "All company applications across your security leads.",
      createLead: "+ Create Lead",
      tabs: {
        all: "All Applications",
        pending: "Pending Review",
        hired: "Hired",
        declined: "Declined",
        withdrawn: "Withdrawn",
      },
      searchPlaceholder: "Search applications...",
      filters: "Filters",
      stats: {
        total: "Total Applications",
        totalHint: "All time",
        pending: "Pending Review",
        pendingHint: "Awaiting your review",
        hired: "Hired",
        hiredHint: "Successfully hired",
        declined: "Declined",
        declinedHint: "Not selected",
      },
      table: {
        applicant: "Applicant",
        leadRequest: "Lead Request",
        appliedOn: "Applied On",
        status: "Status",
        offer: "Offer",
        actions: "Actions",
        offerTotal: "Total",
        viewProfile: "View Profile",
      },
      emptyTitle: "No applications yet",
      emptyDescription:
        "Company applications will appear here once security companies apply to your posted requests.",
      emptyFiltered: "No applications match your filters.",
      ctaTitle: "Post more leads and get more qualified applications.",
      ctaDescription: "Find the right security partner for every job you post.",
    },
    companySecurityLeads: {
      title: "Security Leads",
      subtitle: "Browse public security needs posted by clients.",
      myApplications: "My Applications",
      viewMyApplications: "View My Applications",
      tabs: {
        all: "All Leads",
        active: "Active",
        filled: "Filled",
        closed: "Closed",
        cancelled: "Cancelled",
      },
      searchPlaceholder: "Search security leads...",
      filter: "Filter",
      stats: {
        total: "Total Leads",
        totalHint: "All time",
        active: "Active",
        activeHint: "Currently open",
        filled: "Filled",
        filledHint: "Successfully filled",
        closed: "Closed",
        closedHint: "Completed",
        cancelled: "Cancelled",
        cancelledHint: "Cancelled leads",
      },
      table: {
        leadTitle: "Lead Title",
        location: "Location",
        dateTime: "Date & Time",
        officers: "Officers Needed",
        budget: "Budget",
        status: "Status",
        actions: "Actions",
        officersLabel: "Officers",
        budgetTotal: "Total",
        viewDetails: "View Details",
      },
      emptyTitle: "No public security leads available",
      emptyDescription:
        "Client security requests will appear here as they are published.",
      emptyFiltered: "No leads match your filters.",
      ctaTitle: "Don't see the right lead?",
      ctaDescription:
        "Check back often — new security leads are posted daily.",
    },
    companyLeadApplications: {
      title: "My Lead Applications",
      subtitle: "Track applications you submitted to client security leads.",
      browseLeads: "Browse Leads",
      tabs: {
        all: "All Applications",
        pending: "Pending Review",
        hired: "Hired",
        notSelected: "Not Selected",
        withdrawn: "Withdrawn",
      },
      searchPlaceholder: "Search applications...",
      filters: "Filters",
      stats: {
        total: "Total Applications",
        totalHint: "All time",
        pending: "Pending Review",
        pendingHint: "Awaiting client review",
        hired: "Hired",
        hiredHint: "Successfully hired",
        notSelected: "Not Selected",
        notSelectedHint: "Not chosen by client",
      },
      table: {
        leadRequest: "Lead Request",
        client: "Client",
        appliedOn: "Applied On",
        status: "Status",
        offer: "Offer",
        actions: "Actions",
        offerTotal: "Total",
        viewDetails: "View Details",
      },
      emptyTitle: "You have not applied to any leads yet",
      emptyDescription:
        "Browse public security leads and apply to opportunities that fit your company.",
      emptyFiltered: "No applications match your filters.",
      ctaTitle: "Want more leads?",
      ctaDescription:
        "Browse available security leads and grow your business.",
    },
  },
  pages: {
    onboarding: {
      title: "Welcome to FlexOfficers",
      subtitle: "Choose how you want to use the platform.",
    },
    shifts: {
      title: "Open Shifts",
      subtitle: "Browse open shifts posted by companies.",
    },
    shiftsCreate: {
      title: "Post a New Shift",
      subtitle:
        "Fill in the details below to get your shift in front of qualified officers.",
    },
    officerInvites: {
      title: "Company Invites",
      subtitle: "Companies interested in working with you.",
    },
    officerApplications: {
      title: "My Applications",
      subtitle: "Shifts you've applied to.",
    },
    officerAcceptedShifts: {
      title: "My Shifts",
      subtitle: "Company contact details unlock after acceptance.",
    },
    officerUpcomingShifts: {
      title: "Upcoming Shifts",
      subtitle: "Accepted assignments with future start dates.",
    },
    officerNotifications: {
      title: "Notifications",
      subtitle: "Application updates and shift alerts will appear here.",
    },
    officerProfile: {
      title: "Officer Profile",
      subtitle:
        "Complete your profile step by step so companies can review you.",
    },
    officerMessages: {
      title: "Messages",
      subtitle:
        "Direct messaging with companies will be available in a future release.",
    },
    companyShifts: {
      title: "My Shifts",
      subtitle: "Track, manage, and update your posted shifts.",
    },
    companyApplications: {
      title: "Applicants",
      subtitle: "Manage applicants who have applied to your shifts.",
    },
    companyOfficers: {
      title: "Officers",
      subtitle:
        "Find qualified officers near your shifts and invite them to apply.",
    },
    companyStaff: {
      title: "Staff",
      subtitle:
        "Officers on your private roster. Invite them to staff-only shifts or any open shift you post.",
    },
    companyNotifications: {
      title: "Notifications",
      subtitle:
        "Applicant updates, invite responses, and shift alerts will appear here.",
    },
    companyAcceptedOfficers: {
      title: "Accepted Officers",
      subtitle: "Manage officers confirmed for your upcoming shifts.",
    },
    companyCompletedShifts: {
      title: "Completed Shifts",
      subtitle: "Review completed assignments and cancelled shift history.",
    },
    companyProfile: {
      title: "Company Profile",
      subtitle: "Manage your company information and public profile.",
    },
    companyProfileEdit: {
      title: "Edit Company Profile",
      subtitle: "Update your company details.",
    },
    companyBilling: {
      title: "Billing & Subscription",
      subtitle: "Manage your FlexOfficers subscription and payment method.",
    },
    companyReports: {
      title: "Reports",
      subtitle: "Operational reporting for your company will live here.",
    },
    clientProfile: {
      title: "My Profile",
      subtitle: "Manage your personal information and preferences.",
    },
  },
};

const es: AppCore = {
  appNav: {
    aria: {
      officerNav: "Navegación de oficial",
      companyNav: "Navegación de empresa",
      officerDashboard: "Panel de oficial",
      companyDashboard: "Panel de empresa",
      notifications: "Notificaciones",
      viewProfile: "Ver perfil",
      unread: "sin leer",
    },
    signOut: "Cerrar Sesión",
    officerFallback: "Oficial",
    companyFallback: "Empresa",
    clientFallback: "Cliente",
    officerMobile: {
      home: "Inicio",
      browse: "Explorar",
      invites: "Invitaciones",
      applications: "Solicitudes",
      profile: "Perfil",
      settings: "Configuración",
    },
    officerSidebar: {
      dashboard: "Panel",
      browseShifts: "Explorar Turnos",
      companyInvites: "Invitaciones de Empresas",
      applications: "Solicitudes",
      acceptedShifts: "Turnos Aceptados",
      upcomingShifts: "Próximos Turnos",
      notifications: "Notificaciones",
      myProfile: "Mi Perfil",
      settings: "Configuración",
    },
    companyMobile: {
      home: "Inicio",
      shifts: "Turnos",
      applicants: "Solic.",
      officers: "Ofic.",
      staff: "Staff",
      profile: "Perfil",
      settings: "Ajustes",
    },
    companySidebar: {
      home: "Inicio",
      postShift: "Publicar Turno",
      myShifts: "Mis Turnos",
      applicants: "Solicitantes",
      notifications: "Notificaciones",
      searchOfficers: "Buscar Oficiales",
      staff: "Personal",
      companyProfile: "Perfil de Empresa",
      billing: "Facturación y Plan",
      settings: "Configuración",
      securityLeads: "Oportunidades de Seguridad",
      leadApplications: "Mis Solicitudes",
    },
    clientMobile: {
      home: "Inicio",
      leads: "Leads",
      create: "Crear",
      applicants: "Solic.",
      profile: "Perfil",
      settings: "Ajustes",
    },
    clientSidebar: {
      dashboard: "Panel",
      myLeads: "Mis Leads",
      createLead: "Crear Lead",
      applicants: "Solicitantes",
      profile: "Perfil",
      settings: "Configuración",
    },
  },
  common: {
    quickActions: "Acciones Rápidas",
    quickActionsSubtitle: "Accede a las herramientas que más usas.",
    viewAll: "Ver Todo",
    addNow: "Agregar Ahora",
    completeProfile: "Completar Perfil",
    editProfile: "Editar Perfil",
    welcomeBack: "Bienvenido de nuevo,",
    welcome: "Bienvenido",
    welcomeName: "Bienvenido, {name}",
    finishSetup: "Completa la configuración para empezar a usar FlexOfficers.",
    goodMorning: "Buenos días,",
    goodAfternoon: "Buenas tardes,",
    goodEvening: "Buenas noches,",
    welcomeBackName: "¡Bienvenido de nuevo, {name}!",
    postNewShift: "Publicar Nuevo Turno",
    to: "a",
    shift: "turno",
    shifts: "turnos",
    noData: "Sin datos",
    total: "Total",
    comingSoon: "Próximamente.",
  },
  dashboard: {
    setup: {
      onboarding: {
        title: "Completa el registro",
        description:
          "Elige si te unes como oficial o empresa antes de usar el panel.",
        action: "Ir al Registro",
      },
      officerProfile: {
        title: "Configura tu perfil de oficial",
        description:
          "Tu cuenta está registrada como oficial. Completa tu perfil para explorar turnos y solicitar.",
        action: "Completar Perfil de Oficial",
      },
      companyProfile: {
        title: "Configura el perfil de tu empresa",
        description:
          "Tu cuenta está registrada como empresa. Agrega los datos de tu empresa para publicar turnos y revisar solicitantes.",
        action: "Completar Perfil de Empresa",
      },
    },
    officer: {
      headerSubtitle: "Esto es lo que está pasando con tu cuenta hoy.",
      statApplications: "Solicitudes",
      statApplicationsHint: "Turnos a los que has solicitado",
      statAccepted: "Turnos Aceptados",
      statAcceptedHint: "Asignaciones que has ganado",
      statUpcoming: "Próximos Turnos",
      statUpcomingHint: "Turnos aceptados que comienzan pronto",
      statAvailable: "Turnos Disponibles",
      statAvailableHint: "Turnos abiertos publicados por empresas",
      profileCompletion: "Completitud del Perfil",
      profileReady:
        "Listo para solicitar turnos y ser revisado por empresas.",
      profileIncomplete:
        "Completa tu perfil antes de poder solicitar turnos.",
      profileAria: "Completitud del perfil",
      allFieldsComplete: "Todos los campos completos",
      fieldsLeft: "{count} campos restantes",
      fieldsLeftOne: "1 campo restante",
      recommendedSteps: "Próximos Pasos Recomendados",
      recommendedStepsSubtitle:
        "Completa estos pasos antes de poder solicitar turnos.",
      profileFields: {
        phone: "Agrega tu número de teléfono",
        armedStatuses: "Selecciona armado y/o desarmado",
        experienceCategories: "Agrega categorías de experiencia",
        experienceYears: "Agrega tus años de experiencia",
        licenses: "Agrega al menos una licencia",
      },
      quickActions: {
        browseShifts: "Explorar Turnos",
        browseShiftsDesc: "Explora asignaciones abiertas.",
        applications: "Solicitudes",
        applicationsDesc: "Sigue tus solicitudes.",
        acceptedShifts: "Mis Turnos",
        acceptedShiftsDesc: "Ver asignaciones confirmadas.",
        upcomingShifts: "Próximos Turnos",
        upcomingShiftsDesc:
          "Ve turnos que comienzan pronto, marca entrada y salida. Al marcar salida, pasa a Mis Turnos → Completados.",
      },
      sidebar: {
        upcomingShift: "Próximo Turno",
        acceptedStartingSoon: "Turnos aceptados que comienzan pronto.",
        acceptedStartingSoonOne: "Turno aceptado que comienza pronto.",
        viewUpcoming: "Ver Próximos Turnos",
        noUpcoming: "No hay próximos turnos",
        noUpcomingDesc: "Los turnos aceptados futuros aparecerán aquí.",
        browseShifts: "Explorar Turnos",
        announcements: "Anuncios",
        noAnnouncements: "Sin anuncios",
        noAnnouncementsDesc: "Las actualizaciones de la plataforma aparecerán aquí.",
        viewNotifications: "Ver Notificaciones",
      },
    },
    company: {
      headerSubtitle:
        "Esto es lo que está pasando con tus operaciones de seguridad hoy.",
      thereFallback: "ahí",
      statTotalShifts: "Turnos Totales",
      statApplicants: "Solicitantes",
      statFilledShifts: "Turnos Cubiertos",
      statUpcomingShifts: "Próximos Turnos",
      statOpenFilledPast: "Abiertos {open} · Cubiertos {filled} · Pasados {past}",
      statApplicantBreakdown:
        "{pending} Pendientes · {invited} Invitados · {accepted} Aceptados",
      statFilledThisMonth: "Cubiertos este mes",
      statConfirmedNext7: "Confirmados en los próximos 7 días",
      quickActions: {
        postShift: "Publicar Nuevo Turno",
        postShiftDesc: "Crea un turno y comienza a recibir solicitantes.",
        viewApplicants: "Ver Solicitantes",
        viewApplicantsDesc: "Revisa solicitudes de oficiales.",
        upcomingShifts: "Próximos Turnos",
        upcomingShiftsDesc: "Ver turnos confirmados.",
        manageOfficers: "Gestionar Oficiales",
        manageOfficersDesc: "Busca y revisa perfiles de oficiales.",
        securityLeads: "Oportunidades de Seguridad",
        securityLeadsDesc:
          "Explora solicitudes de seguridad de clientes y postúlate a nuevas oportunidades.",
        leadApplications: "Mis Solicitudes",
        leadApplicationsDesc:
          "Sigue las solicitudes de seguridad a las que se postuló tu empresa.",
        staff: "Personal",
        staffDesc: "Ver tus oficiales guardados.",
      },
      upcomingShifts: "Próximos Turnos",
      noConfirmedSoon: "No hay turnos confirmados que comiencen pronto.",
      noConfirmed7Days: "No hay turnos confirmados en los próximos 7 días.",
      tableDate: "Fecha",
      tableShift: "Turno",
      tableLocation: "Ubicación",
      tableOpen: "Abierto",
      openPositions: "{count} posiciones abiertas restantes",
      openPositionsOne: "1 posición abierta restante",
      openCount: "{count} abierto(s)",
      applicantsOverview: "Resumen de Solicitantes",
      applicantsEmpty:
        "La actividad de solicitantes e invitaciones aparecerá aquí cuando los oficiales soliciten o acepten tus invitaciones.",
      donutPending: "Pendiente",
      donutInvited: "Invitado",
      donutAccepted: "Aceptado",
      profileBannerTitle: "Completa el perfil de tu empresa",
      profileBannerPercent: "{percent}% completo",
      profileBannerNote:
        "Completa tu perfil (nombre de empresa, correo, teléfono, dirección, ciudad, estado, etc.) para iniciar tu prueba gratuita de 7 días en el plan anual de FlexOfficers.",
      profileFields: {
        companyName: "Nombre de la empresa",
        contactEmail: "Correo de contacto",
        phone: "Número de teléfono",
        address: "Dirección",
        city: "Ciudad",
        state: "Estado",
      },
    },
    client: {
      title: "Panel del Cliente",
      subtitle:
        "Publica necesidades de seguridad y revisa solicitudes de empresas.",
      createLead: "+ Crear Lead",
      statMyLeads: "Mis Leads",
      statMyLeadsHint: "Total de leads creados",
      statMyLeadsLink: "Ver todos los leads →",
      statActiveLeads: "Leads Activos",
      statActiveLeadsHint: "Actualmente activos",
      statActiveLeadsLink: "Ver leads activos →",
      statPendingApplicants: "Solicitantes Pendientes",
      statPendingApplicantsHint: "En espera de revisión",
      statPendingApplicantsLink: "Revisar solicitantes →",
      statPostingFee: "Tarifa de Publicación",
      statPostingFeeHint: "Por lead de seguridad",
      statPostingFeeLink: "Historial de pagos →",
      recentLeads: "Leads Recientes",
      viewAll: "Ver todo",
      applicantsOverview: "Resumen de Solicitantes",
      applicantsEmpty:
        "Las solicitudes de empresas aparecerán aquí cuando apliquen a tus leads.",
      donutHired: "Contratados",
      donutPendingReview: "En Revisión",
      donutDeclined: "Rechazados",
      donutWithdrawn: "Retirados",
      totalApplicants: "Total de Solicitantes",
      applicantsCount: "{count} Solicitantes",
      applicantCountOne: "1 Solicitante",
      recentLeadsEmptyTitle: "Aún no hay solicitudes de seguridad.",
      recentLeadsEmptyDesc:
        "Crea tu primera solicitud de seguridad y comienza a recibir aplicaciones de empresas de seguridad confiables.",
      quickActions: {
        createLead: "Crear Nuevo Lead",
        createLeadDesc: "Publica una nueva solicitud de seguridad",
        viewApplicants: "Ver Solicitantes",
        viewApplicantsDesc: "Revisa y gestiona solicitantes",
        billingHistory: "Historial de Facturación",
        billingHistoryDesc: "Ver tu historial de pagos",
      },
      ctaTitle: "¿Necesitas Oficiales de Seguridad Calificados?",
      ctaDescription:
        "Publica tu necesidad de seguridad y conéctate con profesionales de seguridad verificados.",
    },
    clientSecurityRequests: {
      title: "Mis Solicitudes de Seguridad",
      subtitle: "Administra y sigue todas tus solicitudes de seguridad publicadas.",
      createLead: "+ Crear Lead",
      tabs: {
        all: "Todas",
        active: "Activas",
        pending: "Pendientes",
        completed: "Completadas",
        cancelled: "Canceladas",
      },
      searchPlaceholder: "Buscar solicitudes...",
      filter: "Filtrar",
      stats: {
        total: "Total de Solicitudes",
        totalHint: "Todo el tiempo",
        active: "Activas",
        activeHint: "Actualmente activas",
        pending: "Pendientes",
        pendingHint: "En espera de pago",
        completed: "Completadas",
        completedHint: "Finalizadas",
        cancelled: "Canceladas",
        cancelledHint: "Solicitudes canceladas",
      },
      table: {
        request: "Solicitud",
        location: "Ubicación",
        dateTime: "Fecha y Hora",
        officers: "Oficiales",
        budget: "Presupuesto",
        status: "Estado",
        applicants: "Solicitantes",
        actions: "Acciones",
        officersLabel: "Oficiales",
        budgetTotal: "Total",
        view: "Ver",
      },
      emptyTitle: "Aún no hay solicitudes de seguridad",
      emptyDescription:
        "Crea tu primera solicitud de seguridad para recibir aplicaciones de empresas de seguridad confiables.",
      emptyFiltered: "Ninguna solicitud coincide con tus filtros.",
      ctaTitle: "¿Necesitas oficiales de seguridad calificados?",
      ctaDescription:
        "Publica una nueva solicitud de seguridad y conéctate con profesionales verificados.",
    },
    clientLeadApplications: {
      title: "Mis Solicitudes de Empresas",
      subtitle: "Todas las solicitudes de empresas en tus leads de seguridad.",
      createLead: "+ Crear Lead",
      tabs: {
        all: "Todas las Solicitudes",
        pending: "En Revisión",
        hired: "Contratadas",
        declined: "Rechazadas",
        withdrawn: "Retiradas",
      },
      searchPlaceholder: "Buscar solicitudes...",
      filters: "Filtros",
      stats: {
        total: "Total de Solicitudes",
        totalHint: "Todo el tiempo",
        pending: "En Revisión",
        pendingHint: "En espera de tu revisión",
        hired: "Contratadas",
        hiredHint: "Contratadas con éxito",
        declined: "Rechazadas",
        declinedHint: "No seleccionadas",
      },
      table: {
        applicant: "Solicitante",
        leadRequest: "Solicitud de Lead",
        appliedOn: "Aplicó el",
        status: "Estado",
        offer: "Oferta",
        actions: "Acciones",
        offerTotal: "Total",
        viewProfile: "Ver Perfil",
      },
      emptyTitle: "Aún no hay solicitudes",
      emptyDescription:
        "Las solicitudes de empresas aparecerán aquí cuando apliquen a tus solicitudes publicadas.",
      emptyFiltered: "Ninguna solicitud coincide con tus filtros.",
      ctaTitle: "Publica más leads y recibe más solicitudes calificadas.",
      ctaDescription: "Encuentra el socio de seguridad adecuado para cada trabajo que publiques.",
    },
    companySecurityLeads: {
      title: "Oportunidades de Seguridad",
      subtitle: "Explora necesidades de seguridad públicas publicadas por clientes.",
      myApplications: "Mis Solicitudes",
      viewMyApplications: "Ver Mis Solicitudes",
      tabs: {
        all: "Todos los Leads",
        active: "Activos",
        filled: "Cubiertos",
        closed: "Cerrados",
        cancelled: "Cancelados",
      },
      searchPlaceholder: "Buscar leads de seguridad...",
      filter: "Filtrar",
      stats: {
        total: "Total de Leads",
        totalHint: "Todo el tiempo",
        active: "Activos",
        activeHint: "Actualmente abiertos",
        filled: "Cubiertos",
        filledHint: "Cubiertos con éxito",
        closed: "Cerrados",
        closedHint: "Completados",
        cancelled: "Cancelados",
        cancelledHint: "Leads cancelados",
      },
      table: {
        leadTitle: "Título del Lead",
        location: "Ubicación",
        dateTime: "Fecha y Hora",
        officers: "Oficiales Necesarios",
        budget: "Presupuesto",
        status: "Estado",
        actions: "Acciones",
        officersLabel: "Oficiales",
        budgetTotal: "Total",
        viewDetails: "Ver Detalles",
      },
      emptyTitle: "No hay leads de seguridad públicos disponibles",
      emptyDescription:
        "Las solicitudes de seguridad de clientes aparecerán aquí cuando se publiquen.",
      emptyFiltered: "Ningún lead coincide con tus filtros.",
      ctaTitle: "¿No ves el lead adecuado?",
      ctaDescription:
        "Vuelve a revisar — se publican nuevos leads de seguridad a diario.",
    },
    companyLeadApplications: {
      title: "Mis Solicitudes de Leads",
      subtitle: "Sigue las solicitudes que enviaste a leads de seguridad de clientes.",
      browseLeads: "Explorar Leads",
      tabs: {
        all: "Todas las Solicitudes",
        pending: "En Revisión",
        hired: "Contratadas",
        notSelected: "No Seleccionadas",
        withdrawn: "Retiradas",
      },
      searchPlaceholder: "Buscar solicitudes...",
      filters: "Filtros",
      stats: {
        total: "Total de Solicitudes",
        totalHint: "Todo el tiempo",
        pending: "En Revisión",
        pendingHint: "En espera de revisión del cliente",
        hired: "Contratadas",
        hiredHint: "Contratadas con éxito",
        notSelected: "No Seleccionadas",
        notSelectedHint: "No elegidas por el cliente",
      },
      table: {
        leadRequest: "Solicitud de Lead",
        client: "Cliente",
        appliedOn: "Aplicó el",
        status: "Estado",
        offer: "Oferta",
        actions: "Acciones",
        offerTotal: "Total",
        viewDetails: "Ver Detalles",
      },
      emptyTitle: "Aún no has aplicado a ningún lead",
      emptyDescription:
        "Explora leads de seguridad públicos y aplica a oportunidades que se ajusten a tu empresa.",
      emptyFiltered: "Ninguna solicitud coincide con tus filtros.",
      ctaTitle: "¿Quieres más leads?",
      ctaDescription:
        "Explora leads de seguridad disponibles y haz crecer tu negocio.",
    },
  },
  pages: {
    onboarding: {
      title: "Bienvenido a FlexOfficers",
      subtitle: "Elige cómo quieres usar la plataforma.",
    },
    shifts: {
      title: "Turnos Abiertos",
      subtitle: "Explora turnos abiertos publicados por empresas.",
    },
    shiftsCreate: {
      title: "Publicar Nuevo Turno",
      subtitle:
        "Completa los detalles para mostrar tu turno a oficiales calificados.",
    },
    officerInvites: {
      title: "Invitaciones de Empresas",
      subtitle: "Empresas interesadas en trabajar contigo.",
    },
    officerApplications: {
      title: "Mis Solicitudes",
      subtitle: "Turnos a los que has solicitado.",
    },
    officerAcceptedShifts: {
      title: "Mis Turnos",
      subtitle:
        "Los datos de contacto de la empresa se desbloquean tras la aceptación.",
    },
    officerUpcomingShifts: {
      title: "Próximos Turnos",
      subtitle: "Asignaciones aceptadas con fechas de inicio futuras.",
    },
    officerNotifications: {
      title: "Notificaciones",
      subtitle:
        "Las actualizaciones de solicitudes y alertas de turnos aparecerán aquí.",
    },
    officerProfile: {
      title: "Perfil de Oficial",
      subtitle:
        "Completa tu perfil paso a paso para que las empresas puedan revisarte.",
    },
    officerMessages: {
      title: "Mensajes",
      subtitle:
        "La mensajería directa con empresas estará disponible en una futura versión.",
    },
    companyShifts: {
      title: "Mis Turnos",
      subtitle: "Sigue, gestiona y actualiza tus turnos publicados.",
    },
    companyApplications: {
      title: "Solicitantes",
      subtitle: "Gestiona solicitantes que han aplicado a tus turnos.",
    },
    companyOfficers: {
      title: "Oficiales",
      subtitle:
        "Encuentra oficiales calificados cerca de tus turnos e invítalos a solicitar.",
    },
    companyStaff: {
      title: "Personal",
      subtitle:
        "Oficiales en tu lista privada. Invítalos a turnos exclusivos o a cualquier turno abierto que publiques.",
    },
    companyNotifications: {
      title: "Notificaciones",
      subtitle:
        "Actualizaciones de solicitantes, respuestas a invitaciones y alertas de turnos aparecerán aquí.",
    },
    companyAcceptedOfficers: {
      title: "Oficiales Aceptados",
      subtitle: "Gestiona oficiales confirmados para tus próximos turnos.",
    },
    companyCompletedShifts: {
      title: "Turnos Completados",
      subtitle:
        "Revisa asignaciones completadas e historial de turnos cancelados.",
    },
    companyProfile: {
      title: "Perfil de Empresa",
      subtitle: "Administra la información y el perfil público de tu empresa.",
    },
    companyProfileEdit: {
      title: "Editar Perfil de Empresa",
      subtitle: "Actualiza los datos de tu empresa.",
    },
    companyBilling: {
      title: "Facturación y Suscripción",
      subtitle:
        "Administra tu suscripción de FlexOfficers y método de pago.",
    },
    companyReports: {
      title: "Informes",
      subtitle:
        "Los informes operativos de tu empresa estarán disponibles aquí.",
    },
    clientProfile: {
      title: "Mi Perfil",
      subtitle: "Administra tu información personal y preferencias.",
    },
  },
};

const appTranslations: Record<LandingLanguage, AppTranslations> = {
  en: { ...en, ...uiEn },
  es: { ...es, ...uiEs },
};

export function getAppTranslations(language: LandingLanguage): AppTranslations {
  return appTranslations[language] ?? en;
}

export function interpolate(
  template: string,
  values: Record<string, string | number>
) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    String(values[key] ?? "")
  );
}
