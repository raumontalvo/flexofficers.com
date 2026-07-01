export const LANDING_LANGUAGE_STORAGE_KEY = "flexofficers-landing-language";

export const LANDING_LANGUAGES = ["en", "es"] as const;

export type LandingLanguage = (typeof LANDING_LANGUAGES)[number];

export type LandingTranslations = {
  nav: {
    introduction: string;
    howItWorks: string;
    forCompanies: string;
    forOfficers: string;
    pricing: string;
    getStarted: string;
    signIn: string;
    menu: string;
    language: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    getStarted: string;
    signIn: string;
  };
  introduction: {
    badge: string;
    title: string;
    body: string;
  };
  howItWorks: {
    title: string;
    subtitle: string;
    steps: Array<{ step: string; title: string; description: string }>;
  };
  companies: {
    title: string;
    subtitle: string;
    trialDuration: string;
    trialProfileNote: string;
    trialActiveNote: string;
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
    officersJoinFree: string;
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
};

const en: LandingTranslations = {
  nav: {
    introduction: "Introduction",
    howItWorks: "How It Works",
    forCompanies: "For Companies",
    forOfficers: "For Officers",
    pricing: "Pricing",
    getStarted: "Get Started",
    signIn: "Sign In",
    menu: "Menu",
    language: "Language",
  },
  hero: {
    eyebrow: "Security staffing marketplace",
    title:
      "The Modern Workforce Platform for Security Companies & Security Officers",
    subtitle:
      "Post shifts, discover qualified security officers, and fill open positions faster—all from one platform.",
    getStarted: "Get Started",
    signIn: "Sign In",
  },
  introduction: {
    badge: "INTRODUCTION",
    title: "Meet FlexOfficers",
    body: "FlexOfficers is the ultimate workforce platform for the private security industry. Security companies create profiles, manage their staff, and post shifts—either publicly for any qualified officer or privately for their own team. When extra coverage is needed, companies send direct invitations—no calls, no texts. Officers sign up for free, build profiles, view shift details—including time, location, and pay—and apply to shifts, even from new companies. If an officer declines, the next invited officer steps in. Both companies and officers can track upcoming shifts and assignments. FlexOfficers saves time, fills shifts faster, and keeps everyone covered.",
  },
  howItWorks: {
    title: "How FlexOfficers Works",
    subtitle: "From signup to a staffed workforce—on both sides of the marketplace.",
    steps: [
      {
        step: "Step 1",
        title: "Choose Your Role",
        description:
          "Security companies and security officers create the right account for their needs.",
      },
      {
        step: "Step 2",
        title: "Complete Your Profile",
        description:
          "Companies add business details. Officers add experience, licenses, certifications, availability, and contact info.",
      },
      {
        step: "Step 3",
        title: "Post or Find Shifts",
        description:
          "Companies post open shifts. Officers browse shifts, apply, and receive company invites.",
      },
      {
        step: "Step 4",
        title: "Review & Connect",
        description:
          "Companies review applicants, view officer profiles, verify license info, and manage staff.",
      },
      {
        step: "Step 5",
        title: "Manage Your Workforce",
        description:
          "Companies track applicants, accepted officers, staff, invites, and posted shifts in one place.",
      },
    ],
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
        title: "Unlimited Shift Postings",
        description: "Publish open shifts whenever you need coverage.",
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
        description: "Connect with officers ready to work on short notice.",
      },
      {
        title: "Unlimited Hiring",
        description: "Accept as many officers as your shifts require.",
      },
      {
        title: "Annual Subscription",
        description:
          "7-day free trial, then $599/year for unlimited platform usage. No charge when your trial ends.",
      },
    ],
  },
  officers: {
    title: "Built For Security Officers",
    subtitle: "Find work on your terms—always free.",
    features: [
      {
        title: "Apply For Free",
        description: "Officers never pay to browse or apply for shifts.",
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
        title: "Free Forever",
        description: "FlexOfficers is free for security officers.",
      },
    ],
  },
  pricing: {
    title: "Simple Pricing",
    subtitle: "One plan for companies. Free for officers.",
    annualPlan: "Annual plan",
    planName: "FlexOfficers Company Plan",
    perYear: "/year",
    trialBadge: "7-day free trial",
    trialStartNote:
      "Your trial starts after your company profile is complete. You won't be charged when the trial ends.",
    trialSubscribeNote: "Subscribe when ready to re-unlock company features.",
    features: [
      "Unlimited Shift Postings",
      "Unlimited Officer Applications",
      "Unlimited Hiring",
      "Unlimited Officer Search",
      "Unlimited Platform Usage",
      "No Commission Fees",
    ],
    getStarted: "Get Started",
    officersJoinFree: "Security Officers Join Free",
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
};

const es: LandingTranslations = {
  nav: {
    introduction: "Introducción",
    howItWorks: "Cómo Funciona",
    forCompanies: "Para Empresas",
    forOfficers: "Para Oficiales",
    pricing: "Precios",
    getStarted: "Comenzar",
    signIn: "Iniciar Sesión",
    menu: "Menú",
    language: "Idioma",
  },
  hero: {
    eyebrow: "Mercado de personal de seguridad",
    title:
      "La Plataforma Moderna de Personal para Empresas de Seguridad y Oficiales de Seguridad",
    subtitle:
      "Publica turnos, descubre oficiales de seguridad calificados y cubre vacantes más rápido—todo desde una sola plataforma.",
    getStarted: "Comenzar",
    signIn: "Iniciar Sesión",
  },
  introduction: {
    badge: "INTRODUCCIÓN",
    title: "Conoce FlexOfficers",
    body: "FlexOfficers es la plataforma definitiva de personal para la industria de seguridad privada. Las empresas de seguridad crean perfiles, gestionan su personal y publican turnos—ya sea públicamente para cualquier oficial calificado o de forma privada para su propio equipo. Cuando se necesita cobertura adicional, las empresas envían invitaciones directas—sin llamadas ni mensajes de texto. Los oficiales se registran gratis, crean perfiles, ven los detalles del turno—incluyendo hora, ubicación y pago—y solicitan turnos, incluso de empresas nuevas. Si un oficial declina, el siguiente oficial invitado entra en acción. Tanto empresas como oficiales pueden seguir los turnos y asignaciones próximas. FlexOfficers ahorra tiempo, cubre turnos más rápido y mantiene a todos cubiertos.",
  },
  howItWorks: {
    title: "Cómo Funciona FlexOfficers",
    subtitle:
      "Desde el registro hasta un equipo completo—en ambos lados del mercado.",
    steps: [
      {
        step: "Paso 1",
        title: "Elige Tu Rol",
        description:
          "Las empresas de seguridad y los oficiales crean la cuenta adecuada para sus necesidades.",
      },
      {
        step: "Paso 2",
        title: "Completa Tu Perfil",
        description:
          "Las empresas agregan datos comerciales. Los oficiales agregan experiencia, licencias, certificaciones, disponibilidad e información de contacto.",
      },
      {
        step: "Paso 3",
        title: "Publica o Busca Turnos",
        description:
          "Las empresas publican turnos abiertos. Los oficiales exploran turnos, solicitan y reciben invitaciones de empresas.",
      },
      {
        step: "Paso 4",
        title: "Revisa y Conecta",
        description:
          "Las empresas revisan solicitantes, ven perfiles de oficiales, verifican licencias y gestionan personal.",
      },
      {
        step: "Paso 5",
        title: "Gestiona Tu Personal",
        description:
          "Las empresas siguen solicitantes, oficiales aceptados, personal, invitaciones y turnos publicados en un solo lugar.",
      },
    ],
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
        title: "Publicaciones Ilimitadas de Turnos",
        description: "Publica turnos abiertos cuando necesites cobertura.",
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
        description: "Conéctate con oficiales listos para trabajar con poco aviso.",
      },
      {
        title: "Contratación Ilimitada",
        description: "Acepta tantos oficiales como requieran tus turnos.",
      },
      {
        title: "Suscripción Anual",
        description:
          "Prueba gratuita de 7 días, luego $599/año por uso ilimitado de la plataforma. Sin cargo al finalizar la prueba.",
      },
    ],
  },
  officers: {
    title: "Hecho Para Oficiales de Seguridad",
    subtitle: "Encuentra trabajo en tus términos—siempre gratis.",
    features: [
      {
        title: "Solicita Gratis",
        description: "Los oficiales nunca pagan por explorar o solicitar turnos.",
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
        title: "Gratis Para Siempre",
        description: "FlexOfficers es gratis para oficiales de seguridad.",
      },
    ],
  },
  pricing: {
    title: "Precios Simples",
    subtitle: "Un plan para empresas. Gratis para oficiales.",
    annualPlan: "Plan anual",
    planName: "Plan Empresarial FlexOfficers",
    perYear: "/año",
    trialBadge: "Prueba gratuita de 7 días",
    trialStartNote:
      "Tu prueba comienza cuando tu perfil de empresa esté completo. No se te cobrará al finalizar la prueba.",
    trialSubscribeNote:
      "Suscríbete cuando estés listo para volver a desbloquear funciones empresariales.",
    features: [
      "Publicaciones Ilimitadas de Turnos",
      "Solicitudes Ilimitadas de Oficiales",
      "Contratación Ilimitada",
      "Búsqueda Ilimitada de Oficiales",
      "Uso Ilimitado de la Plataforma",
      "Sin Comisiones",
    ],
    getStarted: "Comenzar",
    officersJoinFree: "Los Oficiales de Seguridad Se Unen Gratis",
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
};

const translations: Partial<Record<LandingLanguage, LandingTranslations>> = {
  en,
  es,
};

export function isLandingLanguage(value: string | null | undefined): value is LandingLanguage {
  return LANDING_LANGUAGES.includes(value as LandingLanguage);
}

export function getLandingTranslations(language: LandingLanguage): LandingTranslations {
  return translations[language] ?? en;
}
