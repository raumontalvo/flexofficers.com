import type { LandingLanguage } from "@/lib/landing-i18n";
import { uiEn, uiEs, type UiTranslations } from "@/lib/i18n/ui-translations";

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
    };
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
  };
} & UiTranslations;

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
        acceptedShifts: "Accepted Shifts",
        acceptedShiftsDesc: "View confirmed assignments.",
        upcomingShifts: "Upcoming Shifts",
        upcomingShiftsDesc: "See shifts starting soon.",
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
      title: "Accepted Shifts",
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
      applicants: "Solicitantes",
      officers: "Oficiales",
      staff: "Personal",
      profile: "Perfil",
      settings: "Configuración",
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
        acceptedShifts: "Turnos Aceptados",
        acceptedShiftsDesc: "Ver asignaciones confirmadas.",
        upcomingShifts: "Próximos Turnos",
        upcomingShiftsDesc: "Ver turnos que comienzan pronto.",
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
      title: "Turnos Aceptados",
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
