import { getAppTranslations, type AppTranslations } from "@/lib/app-i18n";
import {
  getLegalPagesTranslations,
  type LegalPagesTranslations,
} from "@/lib/landing-legal-i18n";

export const LANDING_LANGUAGE_STORAGE_KEY = "flexofficers-landing-language";

export const LANDING_LANGUAGES = ["en", "es"] as const;

export type LandingLanguage = (typeof LANDING_LANGUAGES)[number];

export type LandingTranslations = {
  nav: {
    introduction: string;
    howItWorks: string;
    forCompanies: string;
    forOfficers: string;
    needSecurity: string;
    pricing: string;
    getStarted: string;
    signIn: string;
    menu: string;
    language: string;
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    titleHighlight: string;
    subtitle: string;
    getStarted: string;
    needSecurity: string;
  };
  audience: {
    officer: {
      title: string;
      description: string;
      bullets: string[];
      cta: string;
    };
    company: {
      title: string;
      description: string;
      bullets: string[];
      cta: string;
    };
    client: {
      title: string;
      description: string;
      bullets: string[];
      cta: string;
    };
    important: {
      company: string;
      officer: string;
      client: string;
    };
  };
  introduction: {
    badge: string;
    title: string;
    body: string;
  };
  howItWorks: {
    badge: string;
    title: string;
    subtitle: string;
    steps: Array<
      | {
          step: string;
          title: string;
          layout: "list";
          items: string[];
          description: string;
        }
      | {
          step: string;
          title: string;
          layout: "roles";
          roles: Array<{ label: string; body: string }>;
        }
      | {
          step: string;
          title: string;
          layout: "list-only";
          items: string[];
        }
      | {
          step: string;
          title: string;
          layout: "manage";
          companies: string[];
          officers: string[];
          clients: string[];
        }
    >;
    manageLabels: {
      companies: string;
      officers: string;
      clients: string;
    };
    important: {
      company: string;
      officer: string;
      client: string;
    };
  };
  companies: {
    title: string;
    subtitle: string;
    trialDuration: string;
    trialProfileNote: string;
    trialActiveNote: string;
    features: Array<{ title: string; description: string }>;
  };
  clients: {
    title: string;
    subtitle: string;
    cta: string;
    signIn: string;
    feeNote: string;
    features: Array<{ title: string; description: string }>;
  };
  officers: {
    title: string;
    subtitle: string;
    features: Array<{ title: string; description: string }>;
  };
  pricing: {
    title: string;
    subtitle: string;
    annualPlan: string;
    planName: string;
    perYear: string;
    trialBadge: string;
    trialStartNote: string;
    trialSubscribeNote: string;
    features: string[];
    getStarted: string;
    officer: {
      badge: string;
      title: string;
      description: string;
      features: string[];
      cta: string;
    };
    client: {
      badge: string;
      title: string;
      price: string;
      description: string;
      features: string[];
      cta: string;
    };
    important: {
      company: string;
      officer: string;
      client: string;
    };
  };
  cta: {
    eyebrow: string;
    title: string;
    subtitle: string;
    tagline: string;
    getStarted: string;
  };
  footer: {
    privacy: string;
    terms: string;
    contact: string;
  };
  legalPages: LegalPagesTranslations;
  settings: {
    pageTitle: string;
    pageSubtitle: string;
    loading: string;
    accountSecurity: {
      title: string;
      description: string;
      emailLabel: string;
      changeEmail: string;
      passwordLabel: string;
      changePassword: string;
      noEmail: string;
      managedByProvider: string;
      clerkFootnote: string;
    };
    language: {
      title: string;
      description: string;
    };
    privacy: {
      title: string;
      description: string;
      officerItems: string[];
      companyItems: string[];
    };
    contact: {
      title: string;
      description: string;
      callUs: string;
      copy: string;
      copied: string;
      hours: string;
    };
    danger: {
      title: string;
      description: string;
      deleteAccount: string;
      officerDeleteDescription: string;
      companyDeleteDescription: string;
      adminDeleteDescription: string;
      deleteButton: string;
    };
    signOut: {
      title: string;
      description: string;
      button: string;
    };
    deleteDialog: {
      title: string;
      description: string;
      cancel: string;
      confirm: string;
      deleting: string;
      error: string;
      closeAria: string;
    };
    billingLink: {
      title: string;
      description: string;
    };
  };
} & AppTranslations;

type LandingContent = Omit<LandingTranslations, keyof AppTranslations | "legalPages">;

const en: LandingContent = {
  nav: {
    introduction: "Introduction",
    howItWorks: "How It Works",
    forCompanies: "For Companies",
    forOfficers: "For Officers",
    needSecurity: "Need Security?",
    pricing: "Pricing",
    getStarted: "Get Started",
    signIn: "Sign In",
    menu: "Menu",
    language: "Language",
  },
  hero: {
    badge: "PRIVATE SECURITY NETWORK",
    titleLine1: "The All-in-One Platform",
    titleLine2: "for the",
    titleHighlight: "Private Security Industry",
    subtitle:
      "Hire Flexible officers. Find work. Connect with trusted security companies. Everything the private security industry needs—all in one platform.",
    getStarted: "Get Started",
    needSecurity: "Need Security?",
  },
  audience: {
    officer: {
      title: "Security Officers",
      description: "Find flexible shifts and build your career.",
      bullets: [
        "Browse open shifts",
        "Get company invites",
        "Apply in seconds",
        "Build your professional profile",
        "And more…",
      ],
      cta: "Continue as Officer",
    },
    company: {
      title: "Security Companies",
      description: "Hire officers, manage your team, and grow your business.",
      bullets: [
        "Post shifts (public & private)",
        "Hire licensed officers",
        "Manage staff & applications",
        "Receive leads & win new clients",
        "And more…",
      ],
      cta: "Continue as Company",
    },
    client: {
      title: "Need Security?",
      description:
        "Post your security need and get applications from trusted companies.",
      bullets: [
        "Describe the service you need",
        "Set date, location & budget",
        "Receive applications from verified companies",
        "Compare profiles & accept the best match",
        "And more…",
      ],
      cta: "Continue as Client",
    },
    important: {
      company: "Companies verify officer licenses and credentials.",
      officer: "Officers maintain valid licenses and certifications.",
      client: "Clients review company profiles before selecting a provider.",
    },
  },
  introduction: {
    badge: "INTRODUCTION",
    title: "Meet FlexOfficers",
    body: "FlexOfficers is the all-in-one private security network connecting security companies, security officers, and clients who need professional security services. Security companies create profiles, manage their staff, post public or private shifts, invite officers, and browse security requests from clients looking for coverage. Private shifts are visible only to the selected security officers a company invites to apply to shifts.\n\nSecurity officers sign up for free, build professional profiles, showcase their licenses and certifications, browse public shifts, receive private company invitations, and apply to opportunities that match their flexible schedule.\n\nClients can create a profile and post a security request for just $5 by providing their service details, location, schedule, budget, and security requirements. Verified security companies can then apply, allowing clients to compare company profiles, qualifications, and experience before selecting the best fit.\n\nFrom hiring officers and finding work to connecting clients with trusted security companies, FlexOfficers saves time, fills positions faster, helps companies grow, and keeps everyone covered.",
  },
  howItWorks: {
    badge: "HOW IT WORKS",
    title: "How FlexOfficers Works",
    subtitle:
      "From finding work to hiring officers and connecting with trusted security companies—all in one private security network.",
    manageLabels: {
      companies: "Companies",
      officers: "Officers",
      clients: "Clients",
    },
    steps: [
      {
        step: "STEP 1",
        title: "Choose Your Experience",
        layout: "list",
        items: [
          "Security Officer",
          "Security Company",
          "Need Security? (Client)",
        ],
        description: "Choose the experience that matches your needs.",
      },
      {
        step: "STEP 2",
        title: "Build Your Profile",
        layout: "roles",
        roles: [
          {
            label: "Security Officers",
            body: "Create a professional profile with licenses and certifications.",
          },
          {
            label: "Security Companies",
            body: "Build your company profile, add your company license information, and if you already have staff, tell them to create their profiles and then add them to your staff to send a private shift post for the selected security officer or officers.",
          },
          {
            label: "Clients",
            body: "Create your account to post security requests.",
          },
        ],
      },
      {
        step: "STEP 3",
        title: "Create Opportunities",
        layout: "roles",
        roles: [
          {
            label: "Security Companies",
            body: "Post public or private shifts.",
          },
          {
            label: "Security Officers",
            body: "Browse public shifts, apply, and receive private company invitations.",
          },
          {
            label: "Clients",
            body: "Post a security need with your contact information, location, schedule, and budget.",
          },
        ],
      },
      {
        step: "STEP 4",
        title: "Connect",
        layout: "list-only",
        items: [
          "Companies invite officers.",
          "Officers apply to shifts.",
          "Companies browse security leads.",
          "Clients receive applications from qualified security companies.",
        ],
      },
      {
        step: "STEP 5",
        title: "Review & Hire",
        layout: "roles",
        roles: [
          {
            label: "Companies",
            body: "Review officer profiles and hire the best officers.",
          },
          {
            label: "Clients",
            body: "Review company profiles, licenses, experience, services, and verification before selecting the right security company.",
          },
        ],
      },
      {
        step: "STEP 6",
        title: "Manage Everything",
        layout: "manage",
        companies: ["Staff", "Shifts", "Applications", "Security Leads"],
        officers: [
          "Upcoming shifts",
          "View public shifts & apply",
          "Company invites",
          "Accepted shifts",
        ],
        clients: [
          "Security requests",
          "Company applicants",
          "Accepted companies",
          "Share contact",
          "Request history",
        ],
      },
    ],
    important: {
      company: "Companies verify officer licenses and credentials.",
      officer: "Officers maintain valid licenses and certifications.",
      client:
        "Clients review company profiles, qualifications, licenses, and experience before selecting a security provider.",
    },
  },
  companies: {
    title: "Built For Security Companies",
    subtitle: "Everything you need to staff shifts without commission fees.",
    trialDuration: "7-Day Free Trial",
    trialProfileNote:
      "Your free trial starts automatically when you complete your company profile (company name, email, phone, address, city, state, etc.).",
    trialActiveNote:
      "You won't be charged when your trial ends. Subscribe anytime to re-unlock features.",
    features: [
      {
        title: "Unlimited Shift Postings, From Public to Private",
        description:
          "Public shifts are viewed by all security officers using the platform. For private shifts, tell your staff to create their profiles, add them to your staff, and send a private shift post for the selected security officer or officers.",
      },
      {
        title: "Review Officer Profiles",
        description: "See experience, availability, and qualifications before you hire.",
      },
      {
        title: "Search Qualified Officers",
        description: "Filter by city, experience, certifications, and more.",
      },
      {
        title: "Fill Open Shifts Faster",
        description:
          "Connect with officers ready to work on short notice. Got a contract in a different city? Find security officers in that city to cover your shift and invite them to apply.",
      },
      {
        title: "Clock-In, Clock-Out & Location Verification",
        description:
          "Track when officers clock in and clock out, including the location captured at each action. Review attendance times and open the recorded location on a map.",
      },
      {
        title: "Real-Time Attendance Updates",
        description:
          "Receive notifications when officers clock in or clock out, with the officer name, shift title, and recorded time.",
      },
      {
        title: "Unlimited Hiring",
        description: "Accept as many officers as your shifts require.",
      },
      {
        title: "Find Security Requests",
        description:
          "Browse security requests posted by clients looking for professional security services. Apply to opportunities, connect with new clients, and grow your business.",
      },
    ],
  },
  clients: {
    title: "Need Security?",
    subtitle:
      "Post a security need and let qualified security companies apply to you.",
    cta: "Post a Security Need",
    signIn: "Client Sign In",
    feeNote:
      "$5 per security request · Posted to security companies. Receive applications from companies willing to meet your budget, schedule, location, and security requirements.",
    features: [
      {
        title: "Create Your Client Profile",
        description:
          "Create a profile so you can manage your security requests, view company applicants, share contact details, and track your request history.",
      },
      {
        title: "Post Security Requests",
        description:
          "HOAs, businesses, events, and property managers can post security needs in minutes.",
      },
      {
        title: "Review Company Applicants",
        description:
          "Accept or reject applicants and view full company profiles before you hire.",
      },
      {
        title: "Simple $5 Posting Fee",
        description:
          "Pay once per request. Your posting goes live after secure Stripe checkout.",
      },
    ],
  },
  officers: {
    title: "Built For Security Officers",
    subtitle: "Find work on your terms—always free.",
    features: [
      {
        title: "Apply For Free",
        description: "Officers never pay to browse or apply for shifts or company invites.",
      },
      {
        title: "Browse Unlimited Shifts",
        description: "Find opportunities that match your schedule and experience.",
      },
      {
        title: "Flexible Schedule",
        description: "Pick up shifts when and where you want to work.",
      },
      {
        title: "Accepted Shift Details",
        description: "See reporting instructions and shift details in one place.",
      },
      {
        title: "Contact Companies After Acceptance",
        description: "Company contact info unlocks once you are accepted.",
      },
      {
        title: "Complete Your Profile",
        description:
          "Complete your profile and get found by security companies looking for officers to cover a contract in your area that they need covered.",
      },
    ],
  },
  pricing: {
    title: "Simple Pricing",
    subtitle:
      "One plan for companies. Free for officers. $5 security requests for clients.",
    annualPlan: "ANNUAL PLAN",
    planName: "Security Company Plan",
    perYear: "/year",
    trialBadge: "7-day free trial",
    trialStartNote:
      "Your trial starts after your company profile is complete. You won't be charged when the trial ends.",
    trialSubscribeNote: "Subscribe when ready to re-unlock company features.",
    features: [
      "Access to all features",
      "Unlimited Shift Postings",
      "Unlimited Officer Applications",
      "Unlimited Hiring",
      "Unlimited Officer Search",
      "Unlimited Platform Usage",
      "Apply to unlimited security request leads",
      "No Commission Fees",
    ],
    getStarted: "Get Started",
    officer: {
      badge: "FOR SECURITY OFFICERS",
      title: "Always Free",
      description:
        "Complete your profile and get discovered by security companies looking for licensed officers to cover contracts in your area.",
      features: [
        "Browse and apply to public shifts",
        "Receive private company invitations",
        "Build your professional profile",
        "Showcase licenses and certifications",
        "Get hired and work on your schedule",
      ],
      cta: "Create Your Free Profile",
    },
    client: {
      badge: "FOR CLIENTS (NEED SECURITY?)",
      title: "Find Security Services",
      price: "$5 per security request",
      description:
        "Posted to verified security companies. Receive applications from companies willing to meet your budget, schedule, location, and security requirements.",
      features: [
        "Post your security request in minutes",
        "Receive applications from trusted companies",
        "Compare company profiles and qualifications",
        "Choose the best company for your needs",
        "No Commission Fees",
      ],
      cta: "Post a Security Request",
    },
    important: {
      company: "Companies verify officer licenses and credentials.",
      officer: "Officers maintain valid licenses and certifications.",
      client:
        "Clients review company profiles, qualifications, licenses, and experience before selecting a security provider.",
    },
  },
  cta: {
    eyebrow: "Ready to get started?",
    title: "Start Covering Shifts Faster",
    subtitle:
      "Post shifts, review licensed officers, and build your security staff in one place.",
    tagline: "7-day free trial • $599/year • No commission fees",
    getStarted: "Get Started",
  },
  footer: {
    privacy: "Privacy",
    terms: "Terms",
    contact: "Contact",
  },
  settings: {
    pageTitle: "Settings",
    pageSubtitle: "Manage your account preferences and security.",
    loading: "Loading account settings…",
    accountSecurity: {
      title: "Account Security",
      description:
        "Manage your email and password. Your account is securely managed by Clerk.",
      emailLabel: "Email Address",
      changeEmail: "Change Email",
      passwordLabel: "Password",
      changePassword: "Change Password",
      noEmail: "No email on file",
      managedByProvider: "Managed through your sign-in provider",
      clerkFootnote:
        "Your account is securely managed by Clerk. We never store your password.",
    },
    language: {
      title: "Language Preference",
      description: "Choose the language used across FlexOfficers.",
    },
    privacy: {
      title: "Privacy & Safety",
      description: "Learn how your information is used and shared.",
      officerItems: [
        "Companies can view your profile after you apply to a shift.",
        "Your phone number and email are shared only after you are accepted for a shift.",
        "Once you are accepted for a shift, you are responsible for arranging how you will be paid. The company's contact information is shared after acceptance so you can ask about payment and other questions.",
        "License information is self-reported by officers.",
      ],
      companyItems: [
        "Officer profiles are visible when they apply to your shifts.",
        "Your company contact information may be shared with accepted officers.",
        "You are responsible for verifying officer licenses and credentials.",
      ],
    },
    contact: {
      title: "Contact Support",
      description: "Need help? Our support team is here for you.",
      callUs: "Call Us",
      copy: "Copy",
      copied: "Copied",
      hours: "We're available Monday – Friday, 9AM – 6PM EST.",
    },
    danger: {
      title: "Danger Zone",
      description: "Permanently delete your FlexOfficers account.",
      deleteAccount: "Delete Account",
      officerDeleteDescription:
        "This action will permanently delete your account and all associated data, including your profile and applications. This action cannot be undone.",
      companyDeleteDescription:
        "This action will permanently delete your account and all associated data, including your company profile, shifts, and applicant records. This action cannot be undone.",
      adminDeleteDescription:
        "This action will permanently delete your admin account and revoke your access to the FlexOfficers admin console. This action cannot be undone.",
      deleteButton: "Delete Account",
    },
    signOut: {
      title: "Sign Out",
      description: "Sign out of FlexOfficers on this device.",
      button: "Sign Out",
    },
    deleteDialog: {
      title: "Delete account?",
      description:
        "Deleting your account will permanently remove your FlexOfficers account, profile, applications, and saved data. This action cannot be undone.",
      cancel: "Cancel",
      confirm: "Delete My Account",
      deleting: "Deleting…",
      error:
        "Account deletion could not be completed. Please try again or contact support.",
      closeAria: "Close dialog",
    },
    billingLink: {
      title: "Billing & Plan",
      description: "Manage subscription and payment method.",
    },
  },
};

const es: LandingContent = {
  nav: {
    introduction: "Introducción",
    howItWorks: "Cómo Funciona",
    forCompanies: "Empresas",
    forOfficers: "Oficiales",
    needSecurity: "¿Necesitas Seguridad?",
    pricing: "Precios",
    getStarted: "Comenzar",
    signIn: "Iniciar Sesión",
    menu: "Menú",
    language: "Idioma",
  },
  hero: {
    badge: "RED DE SEGURIDAD PRIVADA",
    titleLine1: "La Plataforma Todo en Uno",
    titleLine2: "para la",
    titleHighlight: "Industria de Seguridad Privada",
    subtitle:
      "Contrata oficiales flexibles. Encuentra trabajo. Conéctate con empresas de seguridad confiables. Todo lo que la industria de seguridad privada necesita—en una sola plataforma.",
    getStarted: "Comenzar",
    needSecurity: "¿Necesitas Seguridad?",
  },
  audience: {
    officer: {
      title: "Oficiales de Seguridad",
      description: "Encuentra turnos flexibles y construye tu carrera.",
      bullets: [
        "Explora turnos abiertos",
        "Recibe invitaciones de empresas",
        "Solicita en segundos",
        "Construye tu perfil profesional",
        "Y más…",
      ],
      cta: "Continuar como Oficial",
    },
    company: {
      title: "Empresas de Seguridad",
      description: "Contrata oficiales, gestiona tu equipo y haz crecer tu negocio.",
      bullets: [
        "Publica turnos (públicos y privados)",
        "Contrata oficiales con licencia",
        "Gestiona personal y solicitudes",
        "Recibe leads y gana nuevos clientes",
        "Y más…",
      ],
      cta: "Continuar como Empresa",
    },
    client: {
      title: "¿Necesitas Seguridad?",
      description:
        "Publica tu necesidad de seguridad y recibe solicitudes de empresas confiables.",
      bullets: [
        "Describe el servicio que necesitas",
        "Define fecha, ubicación y presupuesto",
        "Recibe solicitudes de empresas verificadas",
        "Compara perfiles y acepta la mejor opción",
        "Y más…",
      ],
      cta: "Continuar como Cliente",
    },
    important: {
      company: "Las empresas verifican licencias y credenciales de los oficiales.",
      officer: "Los oficiales mantienen licencias y certificaciones válidas.",
      client: "Los clientes revisan perfiles de empresas antes de elegir un proveedor.",
    },
  },
  introduction: {
    badge: "INTRODUCCIÓN",
    title: "Conoce FlexOfficers",
    body: "FlexOfficers es la red privada de seguridad todo en uno que conecta a empresas de seguridad, oficiales de seguridad y clientes que necesitan servicios profesionales de seguridad. Las empresas de seguridad crean perfiles, gestionan su personal, publican turnos públicos o privados, invitan oficiales y exploran solicitudes de seguridad de clientes que buscan cobertura. Los turnos privados solo son visibles para los oficiales de seguridad seleccionados a quienes una empresa invita a solicitar turnos.\n\nLos oficiales de seguridad se registran gratis, crean perfiles profesionales, muestran sus licencias y certificaciones, exploran turnos públicos, reciben invitaciones privadas de empresas y solicitan oportunidades que se ajustan a su horario flexible.\n\nLos clientes pueden crear un perfil y publicar una solicitud de seguridad por solo $5 proporcionando los detalles del servicio, ubicación, horario, presupuesto y requisitos de seguridad. Las empresas de seguridad verificadas pueden entonces solicitar, lo que permite a los clientes comparar perfiles de empresas, calificaciones y experiencia antes de seleccionar la mejor opción.\n\nDesde contratar oficiales y encontrar trabajo hasta conectar clientes con empresas de seguridad confiables, FlexOfficers ahorra tiempo, cubre posiciones más rápido, ayuda a las empresas a crecer y mantiene a todos cubiertos.",
  },
  howItWorks: {
    badge: "CÓMO FUNCIONA",
    title: "Cómo Funciona FlexOfficers",
    subtitle:
      "Desde encontrar trabajo hasta contratar oficiales y conectar con empresas de seguridad confiables—todo en una red de seguridad privada.",
    manageLabels: {
      companies: "Empresas",
      officers: "Oficiales",
      clients: "Clientes",
    },
    steps: [
      {
        step: "PASO 1",
        title: "Elige Tu Experiencia",
        layout: "list",
        items: [
          "Oficial de Seguridad",
          "Empresa de Seguridad",
          "¿Necesitas Seguridad? (Cliente)",
        ],
        description: "Elige la experiencia que se adapte a tus necesidades.",
      },
      {
        step: "PASO 2",
        title: "Construye Tu Perfil",
        layout: "roles",
        roles: [
          {
            label: "Oficiales de Seguridad",
            body: "Crea un perfil profesional con licencias y certificaciones.",
          },
          {
            label: "Empresas de Seguridad",
            body: "Crea el perfil de tu empresa, agrega la información de licencia de tu empresa y, si ya tienes personal, pídeles que creen sus perfiles y luego agrégalos a tu equipo para enviar una publicación de turno privado al oficial o oficiales de seguridad seleccionados.",
          },
          {
            label: "Clientes",
            body: "Crea tu cuenta para publicar solicitudes de seguridad.",
          },
        ],
      },
      {
        step: "PASO 3",
        title: "Crea Oportunidades",
        layout: "roles",
        roles: [
          {
            label: "Empresas de Seguridad",
            body: "Publica turnos públicos o privados.",
          },
          {
            label: "Oficiales de Seguridad",
            body: "Explora turnos públicos, solicita y recibe invitaciones privadas de empresas.",
          },
          {
            label: "Clientes",
            body: "Publica una necesidad de seguridad con tu información de contacto, ubicación, horario y presupuesto.",
          },
        ],
      },
      {
        step: "PASO 4",
        title: "Conecta",
        layout: "list-only",
        items: [
          "Las empresas invitan a oficiales.",
          "Los oficiales solicitan turnos.",
          "Las empresas exploran oportunidades de seguridad.",
          "Los clientes reciben solicitudes de empresas de seguridad calificadas.",
        ],
      },
      {
        step: "PASO 5",
        title: "Revisa y Contrata",
        layout: "roles",
        roles: [
          {
            label: "Empresas",
            body: "Revisa perfiles de oficiales y contrata a los mejores.",
          },
          {
            label: "Clientes",
            body: "Revisa perfiles de empresas, licencias, experiencia, servicios y verificación antes de elegir la empresa de seguridad adecuada.",
          },
        ],
      },
      {
        step: "PASO 6",
        title: "Gestiona Todo",
        layout: "manage",
        companies: ["Personal", "Turnos", "Solicitudes", "Oportunidades de Seguridad"],
        officers: [
          "Turnos próximos",
          "Ver turnos públicos y solicitar",
          "Invitaciones de empresas",
          "Turnos aceptados",
        ],
        clients: [
          "Solicitudes de seguridad",
          "Solicitantes de empresas",
          "Empresas aceptadas",
          "Compartir contacto",
          "Historial de solicitudes",
        ],
      },
    ],
    important: {
      company: "Las empresas verifican licencias y credenciales de los oficiales.",
      officer: "Los oficiales mantienen licencias y certificaciones válidas.",
      client:
        "Los clientes revisan perfiles de empresas, calificaciones, licencias y experiencia antes de elegir un proveedor de seguridad.",
    },
  },
  companies: {
    title: "Hecho Para Empresas de Seguridad",
    subtitle: "Todo lo que necesitas para cubrir turnos sin comisiones.",
    trialDuration: "Prueba Gratuita de 7 Días",
    trialProfileNote:
      "Tu prueba gratuita comienza automáticamente cuando completas el perfil de tu empresa (nombre, correo, teléfono, dirección, ciudad, estado, etc.).",
    trialActiveNote:
      "No se te cobrará cuando termine tu prueba. Suscríbete en cualquier momento para volver a desbloquear funciones.",
    features: [
      {
        title: "Publicaciones Ilimitadas de Turnos, de Público a Privado",
        description:
          "Los turnos públicos son visibles para todos los oficiales de seguridad en la plataforma. Para turnos privados, pídeles a tu personal que creen sus perfiles, agrégalos a tu equipo y envía una publicación de turno privado al oficial o oficiales de seguridad seleccionados.",
      },
      {
        title: "Revisa Perfiles de Oficiales",
        description: "Ve experiencia, disponibilidad y calificaciones antes de contratar.",
      },
      {
        title: "Busca Oficiales Calificados",
        description: "Filtra por ciudad, experiencia, certificaciones y más.",
      },
      {
        title: "Cubre Turnos Más Rápido",
        description:
          "Conéctate con oficiales listos para trabajar con poco aviso. ¿Tienes un contrato en otra ciudad? Encuentra oficiales de seguridad en esa ciudad para cubrir tu turno e invítalos a solicitar.",
      },
      {
        title: "Registro de Entrada, Salida y Verificación de Ubicación",
        description:
          "Registra cuándo los oficiales marcan entrada y salida, incluyendo la ubicación capturada en cada acción. Revisa los horarios de asistencia y abre la ubicación registrada en un mapa.",
      },
      {
        title: "Actualizaciones de Asistencia en Tiempo Real",
        description:
          "Recibe notificaciones cuando los oficiales marcan entrada o salida, con el nombre del oficial, el título del turno y la hora registrada.",
      },
      {
        title: "Contratación Ilimitada",
        description: "Acepta tantos oficiales como requieran tus turnos.",
      },
      {
        title: "Encuentra Solicitudes de Seguridad",
        description:
          "Explora solicitudes de seguridad publicadas por clientes que buscan servicios de seguridad profesionales. Solicita oportunidades, conéctate con nuevos clientes y haz crecer tu negocio.",
      },
    ],
  },
  clients: {
    title: "¿Necesitas Seguridad?",
    subtitle:
      "Publica una necesidad de seguridad y deja que empresas calificadas te contacten.",
    cta: "Publicar Necesidad de Seguridad",
    signIn: "Iniciar Sesión Cliente",
    feeNote:
      "$5 por solicitud de seguridad · Publicado para empresas de seguridad. Recibe solicitudes de empresas dispuestas a cumplir tu presupuesto, horario, ubicación y requisitos de seguridad.",
    features: [
      {
        title: "Crea Tu Perfil de Cliente",
        description:
          "Crea un perfil para gestionar tus solicitudes de seguridad, ver solicitantes de empresas, compartir datos de contacto y seguir el historial de tus solicitudes.",
      },
      {
        title: "Publica Solicitudes de Seguridad",
        description:
          "HOA, negocios, eventos y administradores pueden publicar necesidades en minutos.",
      },
      {
        title: "Revisa Solicitudes de Empresas",
        description:
          "Acepta o rechaza solicitantes y ve perfiles completos antes de contratar.",
      },
      {
        title: "Tarifa Simple de $5",
        description:
          "Paga una vez por solicitud. Tu publicación se activa después del pago con Stripe.",
      },
    ],
  },
  officers: {
    title: "Hecho Para Oficiales de Seguridad",
    subtitle: "Encuentra trabajo en tus términos—siempre gratis.",
    features: [
      {
        title: "Solicita Gratis",
        description: "Los oficiales nunca pagan por explorar o solicitar turnos o invitaciones de empresas.",
      },
      {
        title: "Explora Turnos Ilimitados",
        description: "Encuentra oportunidades que coincidan con tu horario y experiencia.",
      },
      {
        title: "Horario Flexible",
        description: "Toma turnos cuando y donde quieras trabajar.",
      },
      {
        title: "Detalles de Turnos Aceptados",
        description: "Ve instrucciones de reporte y detalles del turno en un solo lugar.",
      },
      {
        title: "Contacta Empresas Tras la Aceptación",
        description: "La información de contacto de la empresa se desbloquea al ser aceptado.",
      },
      {
        title: "Completa Tu Perfil",
        description:
          "Completa tu perfil y sé encontrado por empresas de seguridad que buscan oficiales para cubrir un contrato en tu área que necesitan cubrir.",
      },
    ],
  },
  pricing: {
    title: "Precios Simples",
    subtitle:
      "Un plan para empresas. Gratis para oficiales. Solicitudes de seguridad por $5 para clientes.",
    annualPlan: "PLAN ANUAL",
    planName: "Plan para Empresas de Seguridad",
    perYear: "/año",
    trialBadge: "Prueba gratuita de 7 días",
    trialStartNote:
      "Tu prueba comienza cuando tu perfil de empresa esté completo. No se te cobrará al finalizar la prueba.",
    trialSubscribeNote:
      "Suscríbete cuando estés listo para volver a desbloquear funciones empresariales.",
    features: [
      "Acceso a todas las funciones",
      "Publicaciones Ilimitadas de Turnos",
      "Solicitudes Ilimitadas de Oficiales",
      "Contratación Ilimitada",
      "Búsqueda Ilimitada de Oficiales",
      "Uso Ilimitado de la Plataforma",
      "Solicita oportunidades ilimitadas de solicitudes de seguridad",
      "Sin Comisiones",
    ],
    getStarted: "Comenzar",
    officer: {
      badge: "PARA OFICIALES DE SEGURIDAD",
      title: "Siempre Gratis",
      description:
        "Completa tu perfil y sé descubierto por empresas de seguridad que buscan oficiales con licencia para cubrir contratos en tu área.",
      features: [
        "Explora y solicita turnos públicos",
        "Recibe invitaciones privadas de empresas",
        "Construye tu perfil profesional",
        "Muestra licencias y certificaciones",
        "Consigue trabajo y trabaja en tu horario",
      ],
      cta: "Crea Tu Perfil Gratuito",
    },
    client: {
      badge: "PARA CLIENTES (¿NECESITAS SEGURIDAD?)",
      title: "Encuentra Servicios de Seguridad",
      price: "$5 por solicitud de seguridad",
      description:
        "Publicado para empresas de seguridad verificadas. Recibe solicitudes de empresas dispuestas a cumplir tu presupuesto, horario, ubicación y requisitos de seguridad.",
      features: [
        "Publica tu solicitud de seguridad en minutos",
        "Recibe solicitudes de empresas confiables",
        "Compara perfiles y calificaciones de empresas",
        "Elige la mejor empresa para tus necesidades",
        "Sin Comisiones",
      ],
      cta: "Publicar una Solicitud de Seguridad",
    },
    important: {
      company: "Las empresas verifican licencias y credenciales de los oficiales.",
      officer: "Los oficiales mantienen licencias y certificaciones válidas.",
      client:
        "Los clientes revisan perfiles de empresas, calificaciones, licencias y experiencia antes de elegir un proveedor de seguridad.",
    },
  },
  cta: {
    eyebrow: "¿Listo para comenzar?",
    title: "Comienza a Cubrir Turnos Más Rápido",
    subtitle:
      "Publica turnos, revisa oficiales con licencia y construye tu equipo de seguridad en un solo lugar.",
    tagline: "Prueba gratuita de 7 días • $599/año • Sin comisiones",
    getStarted: "Comenzar",
  },
  footer: {
    privacy: "Privacidad",
    terms: "Términos",
    contact: "Contacto",
  },
  settings: {
    pageTitle: "Configuración",
    pageSubtitle: "Administra las preferencias y la seguridad de tu cuenta.",
    loading: "Cargando configuración de la cuenta…",
    accountSecurity: {
      title: "Seguridad de la Cuenta",
      description:
        "Administra tu correo y contraseña. Tu cuenta está gestionada de forma segura por Clerk.",
      emailLabel: "Correo Electrónico",
      changeEmail: "Cambiar Correo",
      passwordLabel: "Contraseña",
      changePassword: "Cambiar Contraseña",
      noEmail: "No hay correo registrado",
      managedByProvider: "Gestionado a través de tu proveedor de inicio de sesión",
      clerkFootnote:
        "Tu cuenta está gestionada de forma segura por Clerk. Nunca almacenamos tu contraseña.",
    },
    language: {
      title: "Preferencia de Idioma",
      description: "Elige el idioma usado en FlexOfficers.",
    },
    privacy: {
      title: "Privacidad y Seguridad",
      description: "Conoce cómo se usa y comparte tu información.",
      officerItems: [
        "Las empresas pueden ver tu perfil después de que solicites un turno.",
        "Tu número de teléfono y correo se comparten solo después de ser aceptado para un turno.",
        "Una vez aceptado para un turno, eres responsable de coordinar cómo te pagarán. La información de contacto de la empresa se comparte después de la aceptación para que puedas preguntar sobre el pago y otras dudas.",
        "La información de licencia es autodeclarada por los oficiales.",
      ],
      companyItems: [
        "Los perfiles de oficiales son visibles cuando solicitan tus turnos.",
        "La información de contacto de tu empresa puede compartirse con oficiales aceptados.",
        "Eres responsable de verificar las licencias y credenciales de los oficiales.",
      ],
    },
    contact: {
      title: "Contactar Soporte",
      description: "¿Necesitas ayuda? Nuestro equipo de soporte está aquí para ti.",
      callUs: "Llámanos",
      copy: "Copiar",
      copied: "Copiado",
      hours: "Estamos disponibles de lunes a viernes, 9AM – 6PM EST.",
    },
    danger: {
      title: "Zona de Peligro",
      description: "Elimina permanentemente tu cuenta de FlexOfficers.",
      deleteAccount: "Eliminar Cuenta",
      officerDeleteDescription:
        "Esta acción eliminará permanentemente tu cuenta y todos los datos asociados, incluyendo tu perfil y solicitudes. Esta acción no se puede deshacer.",
      companyDeleteDescription:
        "Esta acción eliminará permanentemente tu cuenta y todos los datos asociados, incluyendo el perfil de tu empresa, turnos y registros de solicitantes. Esta acción no se puede deshacer.",
      adminDeleteDescription:
        "Esta acción eliminará permanentemente tu cuenta de administrador y revocará tu acceso a la consola de administración de FlexOfficers. Esta acción no se puede deshacer.",
      deleteButton: "Eliminar Cuenta",
    },
    signOut: {
      title: "Cerrar Sesión",
      description: "Cierra sesión en FlexOfficers en este dispositivo.",
      button: "Cerrar Sesión",
    },
    deleteDialog: {
      title: "¿Eliminar cuenta?",
      description:
        "Eliminar tu cuenta removerá permanentemente tu cuenta de FlexOfficers, perfil, solicitudes y datos guardados. Esta acción no se puede deshacer.",
      cancel: "Cancelar",
      confirm: "Eliminar Mi Cuenta",
      deleting: "Eliminando…",
      error:
        "No se pudo completar la eliminación de la cuenta. Inténtalo de nuevo o contacta a soporte.",
      closeAria: "Cerrar diálogo",
    },
    billingLink: {
      title: "Facturación y Plan",
      description: "Administra la suscripción y el método de pago.",
    },
  },
};

const translations: Partial<Record<LandingLanguage, LandingContent>> = {
  en,
  es,
};

export function isLandingLanguage(value: string | null | undefined): value is LandingLanguage {
  return LANDING_LANGUAGES.includes(value as LandingLanguage);
}

export function getLandingTranslations(language: LandingLanguage): LandingTranslations {
  const landing = translations[language] ?? en;
  return {
    ...landing,
    ...getAppTranslations(language),
    legalPages: getLegalPagesTranslations(language),
  };
}
