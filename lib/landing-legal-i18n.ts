import type { LandingLanguage } from "@/lib/landing-i18n";

export type LegalSection = {
  title: string;
  paragraphs: string[];
};

export type LegalPagesTranslations = {
  lastUpdated: string;
  privacy: {
    badge: string;
    title: string;
    subtitle: string;
    lastUpdatedLabel: string;
    lastUpdatedDate: string;
    commitment: {
      title: string;
      body: string;
    };
    cards: Array<{
      title: string;
      intro: string;
      bullets: string[];
    }>;
    wideSections: Array<{
      title: string;
      body: string;
    }>;
    questions: {
      title: string;
      body: string;
      cta: string;
    };
  };
  terms: {
    badge: string;
    title: string;
    subtitle: string;
    agreementNote: string;
    lastUpdatedLabel: string;
    lastUpdatedDate: string;
    sections: Array<{
      title: string;
      body: string;
      bullets?: string[];
      closing?: string;
    }>;
    questions: {
      title: string;
      body: string;
      cta: string;
    };
  };
  contact: {
    title: string;
    subtitle: string;
    getInTouch: {
      title: string;
      intro: string;
      emailLabel: string;
      email: string;
      phoneLabel: string;
      phone: string;
      hoursLabel: string;
      hoursLines: string[];
      supportForLabel: string;
      supportFor: string;
    };
    form: {
      title: string;
      description: string;
      fullNameLabel: string;
      fullNamePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      subjectLabel: string;
      subjectPlaceholder: string;
      messageLabel: string;
      messagePlaceholder: string;
      submit: string;
      submitting: string;
      success: string;
      error: string;
    };
    commitment: string;
  };
};

const en: LegalPagesTranslations = {
  lastUpdated: "Last updated: June 2026",
  privacy: {
    badge: "PRIVACY POLICY",
    title: "Privacy Policy",
    subtitle:
      "Your privacy is important to us. This policy explains how FlexOfficers collects, uses, and protects your information.",
    lastUpdatedLabel: "Last updated:",
    lastUpdatedDate: "July 2026",
    commitment: {
      title: "Our Commitment to Your Privacy",
      body: "FlexOfficers is committed to protecting the privacy and security of your personal information. We use reasonable safeguards to protect your data and do not sell your personal information.",
    },
    cards: [
      {
        title: "1. Information We Collect",
        intro:
          "We collect information that helps us provide and improve our platform.",
        bullets: [
          "Account and profile information such as name, email, phone, and role",
          "Company profile information",
          "Officer licenses, certifications, and experience",
          "Security request details from clients",
          "Payment information processed securely by Stripe",
          "Communications and platform activity",
        ],
      },
      {
        title: "2. How We Use Your Information",
        intro:
          "We use your information to operate, secure, and improve FlexOfficers.",
        bullets: [
          "Create and manage accounts",
          "Connect companies, officers, and clients",
          "Process applications, invites, and security requests",
          "Verify profile and license information when provided",
          "Process payments through Stripe",
          "Provide support and platform updates",
        ],
      },
      {
        title: "3. How We Protect Your Data",
        intro:
          "We use reasonable security practices to protect your information.",
        bullets: [
          "Encrypted data transmission where supported",
          "Secure platform access controls",
          "Limited access to sensitive information",
          "Monitoring for suspicious activity",
          "Reasonable safeguards against unauthorized access or misuse",
        ],
      },
      {
        title: "4. Information Sharing",
        intro: "We do not sell your personal information.",
        bullets: [
          "We may share information with verified users when needed to complete platform actions",
          "Companies may see officer profiles after applications or accepted interactions",
          "Clients may see company profiles when companies apply",
          "Service providers such as Stripe may process payments",
          "We may disclose information if required by law or to protect users",
        ],
      },
      {
        title: "5. Cookies & Tracking",
        intro:
          "We may use cookies and similar technologies to improve your experience.",
        bullets: [
          "Remember preferences such as language",
          "Keep users signed in securely",
          "Understand platform performance",
          "Improve usability and features",
          "Users can manage cookies in browser settings",
        ],
      },
      {
        title: "6. Your Choices",
        intro: "You have control over your information.",
        bullets: [
          "Update your profile information",
          "Manage notification preferences",
          "Request account deletion",
          "Contact us about privacy questions",
          "Some records may be retained when required for legal, billing, or security reasons",
        ],
      },
    ],
    wideSections: [
      {
        title: "7. Children's Privacy",
        body: "FlexOfficers is not intended for individuals under the age of 18. We do not knowingly collect personal information from children.",
      },
      {
        title: "8. Changes to This Policy",
        body: "We may update this Privacy Policy from time to time. Material changes may be communicated through the platform or other reasonable means.",
      },
    ],
    questions: {
      title: "Questions About Your Privacy?",
      body: "If you have questions or concerns about this Privacy Policy, please contact us. We're here to help.",
      cta: "Contact Us",
    },
  },
  terms: {
    badge: "TERMS OF SERVICE",
    title: "Terms of Service",
    subtitle:
      "Please read these terms carefully before using the FlexOfficers platform.",
    agreementNote: "By using our platform, you agree to these Terms of Service.",
    lastUpdatedLabel: "Last updated:",
    lastUpdatedDate: "July 2026",
    sections: [
      {
        title: "Acceptance of Terms",
        body: "By accessing or using FlexOfficers, you agree to these Terms of Service and all applicable laws. If you do not agree with these terms, please do not use the platform.",
      },
      {
        title: "User Roles",
        body: "FlexOfficers serves three user types:",
        bullets: ["Security Companies", "Security Officers", "Clients"],
        closing:
          "Users agree to provide accurate information and use the platform only for its intended purpose.",
      },
      {
        title: "Account Responsibilities",
        body: "You are responsible for maintaining your account credentials and all activity under your account.",
        closing:
          "Keep your information accurate and notify us if your account becomes compromised.",
      },
      {
        title: "Verification & Compliance",
        body: "Security companies are responsible for verifying officer licenses and credentials.",
        closing:
          "Security officers are responsible for maintaining valid licenses and certifications. Clients should review company qualifications before selecting a provider.",
      },
      {
        title: "Acceptable Use",
        body: "Do not use FlexOfficers for illegal activity, fraud, harassment, false information, spam, or misuse of the platform.",
      },
      {
        title: "Security Requests & Applications",
        body: "Clients may post security requests for a fee. Security companies may browse and apply.",
        closing:
          "FlexOfficers does not guarantee responses, hiring, contracts, or outcomes.",
      },
      {
        title: "Payments & Fees",
        body: "Security companies purchase annual subscriptions. Clients pay a one-time fee to post a security request. Payments are securely processed through Stripe.",
        closing: "Pricing may change in the future.",
      },
      {
        title: "No Refunds",
        body: "Company subscriptions may be canceled at any time. If you cancel your subscription, you will continue to have access to your paid features until the end of your current billing period. No partial or prorated refunds will be issued.",
        closing:
          "Security request posting fees are one-time payments and are non-refundable once a security request has been published or submitted.",
      },
      {
        title: "Limitation of Liability",
        body: "FlexOfficers is a marketplace connecting users.",
        closing:
          "We are not responsible for employment decisions, contracts, services performed, payment disputes, or actions taken outside the platform.",
      },
      {
        title: "Changes to Terms",
        body: "These Terms of Service may be updated from time to time.",
        closing:
          "Continued use of FlexOfficers constitutes acceptance of future updates.",
      },
    ],
    questions: {
      title: "Questions?",
      body: "If you have questions about these Terms of Service, please contact us.",
      cta: "Contact Us",
    },
  },
  contact: {
    title: "Contact FlexOfficers",
    subtitle:
      "We're here to help. Reach out to us for platform support, billing questions, account issues, or partnership opportunities.",
    getInTouch: {
      title: "Get in Touch",
      intro:
        "Our team is ready to assist you. Whether you're a security company, officer, or client, we'll get back to you as soon as possible.",
      emailLabel: "Email",
      email: "flexofficer@gmail.com",
      phoneLabel: "Phone",
      phone: "239-900-5653",
      hoursLabel: "Response Time",
      hoursLines: ["We typically respond within 24 hours."],
      supportForLabel: "Support For",
      supportFor:
        "Account Help, Billing, Security Requests, Company Plans, Officer Profiles, and Partnerships",
    },
    form: {
      title: "Send Us a Message",
      description:
        "Fill out the form below and a member of our team will respond to you shortly.",
      fullNameLabel: "Full Name",
      fullNamePlaceholder: "Your full name",
      emailLabel: "Email Address",
      emailPlaceholder: "you@example.com",
      subjectLabel: "Subject",
      subjectPlaceholder: "How can we help?",
      messageLabel: "How can we help you?",
      messagePlaceholder: "Tell us more about your question or request...",
      submit: "Send Message",
      submitting: "Sending...",
      success:
        "Your message has been sent successfully. We'll get back to you within 24 hours.",
      error:
        "Something went wrong. Please try again later or email us directly.",
    },
    commitment:
      "FlexOfficers is committed to providing a secure and reliable platform for security professionals, companies, and clients. Your inquiries help us continue to improve and support our community.",
  },
};

const es: LegalPagesTranslations = {
  lastUpdated: "Última actualización: junio de 2026",
  privacy: {
    badge: "POLÍTICA DE PRIVACIDAD",
    title: "Política de Privacidad",
    subtitle:
      "Tu privacidad es importante para nosotros. Esta política explica cómo FlexOfficers recopila, usa y protege tu información.",
    lastUpdatedLabel: "Última actualización:",
    lastUpdatedDate: "julio de 2026",
    commitment: {
      title: "Nuestro Compromiso con Tu Privacidad",
      body: "FlexOfficers está comprometido con proteger la privacidad y seguridad de tu información personal. Usamos salvaguardas razonables para proteger tus datos y no vendemos tu información personal.",
    },
    cards: [
      {
        title: "1. Información que Recopilamos",
        intro:
          "Recopilamos información que nos ayuda a proporcionar y mejorar nuestra plataforma.",
        bullets: [
          "Información de cuenta y perfil como nombre, correo, teléfono y rol",
          "Información del perfil de la empresa",
          "Licencias, certificaciones y experiencia de oficiales",
          "Detalles de solicitudes de seguridad de clientes",
          "Información de pago procesada de forma segura por Stripe",
          "Comunicaciones y actividad en la plataforma",
        ],
      },
      {
        title: "2. Cómo Usamos Tu Información",
        intro:
          "Usamos tu información para operar, proteger y mejorar FlexOfficers.",
        bullets: [
          "Crear y administrar cuentas",
          "Conectar empresas, oficiales y clientes",
          "Procesar solicitudes, invitaciones y solicitudes de seguridad",
          "Verificar información de perfil y licencias cuando se proporciona",
          "Procesar pagos a través de Stripe",
          "Brindar soporte y actualizaciones de la plataforma",
        ],
      },
      {
        title: "3. Cómo Protegemos Tus Datos",
        intro:
          "Usamos prácticas de seguridad razonables para proteger tu información.",
        bullets: [
          "Transmisión de datos cifrada cuando está disponible",
          "Controles de acceso seguros a la plataforma",
          "Acceso limitado a información sensible",
          "Monitoreo de actividad sospechosa",
          "Salvaguardas razonables contra acceso o uso no autorizado",
        ],
      },
      {
        title: "4. Compartir Información",
        intro: "No vendemos tu información personal.",
        bullets: [
          "Podemos compartir información con usuarios verificados cuando sea necesario para completar acciones en la plataforma",
          "Las empresas pueden ver perfiles de oficiales después de solicitudes o interacciones aceptadas",
          "Los clientes pueden ver perfiles de empresas cuando las empresas solicitan",
          "Proveedores de servicios como Stripe pueden procesar pagos",
          "Podemos divulgar información si la ley lo exige o para proteger a los usuarios",
        ],
      },
      {
        title: "5. Cookies y Seguimiento",
        intro:
          "Podemos usar cookies y tecnologías similares para mejorar tu experiencia.",
        bullets: [
          "Recordar preferencias como el idioma",
          "Mantener a los usuarios conectados de forma segura",
          "Comprender el rendimiento de la plataforma",
          "Mejorar la usabilidad y las funciones",
          "Los usuarios pueden gestionar cookies en la configuración del navegador",
        ],
      },
      {
        title: "6. Tus Opciones",
        intro: "Tienes control sobre tu información.",
        bullets: [
          "Actualizar la información de tu perfil",
          "Gestionar preferencias de notificaciones",
          "Solicitar la eliminación de la cuenta",
          "Contactarnos sobre preguntas de privacidad",
          "Algunos registros pueden conservarse cuando sea necesario por motivos legales, de facturación o de seguridad",
        ],
      },
    ],
    wideSections: [
      {
        title: "7. Privacidad de Menores",
        body: "FlexOfficers no está destinado a personas menores de 18 años. No recopilamos intencionalmente información personal de menores.",
      },
      {
        title: "8. Cambios a Esta Política",
        body: "Podemos actualizar esta Política de Privacidad de vez en cuando. Los cambios importantes pueden comunicarse a través de la plataforma u otros medios razonables.",
      },
    ],
    questions: {
      title: "¿Preguntas Sobre Tu Privacidad?",
      body: "Si tienes preguntas o inquietudes sobre esta Política de Privacidad, contáctanos. Estamos aquí para ayudarte.",
      cta: "Contáctanos",
    },
  },
  terms: {
    badge: "TÉRMINOS DE SERVICIO",
    title: "Términos de Servicio",
    subtitle:
      "Lee estos términos cuidadosamente antes de usar la plataforma FlexOfficers.",
    agreementNote: "Al usar nuestra plataforma, aceptas estos Términos de Servicio.",
    lastUpdatedLabel: "Última actualización:",
    lastUpdatedDate: "julio de 2026",
    sections: [
      {
        title: "Aceptación de los Términos",
        body: "Al acceder o usar FlexOfficers, aceptas estos Términos de Servicio y todas las leyes aplicables. Si no estás de acuerdo con estos términos, no uses la plataforma.",
      },
      {
        title: "Roles de Usuario",
        body: "FlexOfficers atiende a tres tipos de usuarios:",
        bullets: [
          "Empresas de Seguridad",
          "Oficiales de Seguridad",
          "Clientes",
        ],
        closing:
          "Los usuarios aceptan proporcionar información precisa y usar la plataforma solo para su propósito previsto.",
      },
      {
        title: "Responsabilidades de la Cuenta",
        body: "Eres responsable de mantener las credenciales de tu cuenta y toda la actividad bajo tu cuenta.",
        closing:
          "Mantén tu información actualizada y avísanos si tu cuenta se ve comprometida.",
      },
      {
        title: "Verificación y Cumplimiento",
        body: "Las empresas de seguridad son responsables de verificar licencias y credenciales de los oficiales.",
        closing:
          "Los oficiales de seguridad son responsables de mantener licencias y certificaciones válidas. Los clientes deben revisar las calificaciones de las empresas antes de elegir un proveedor.",
      },
      {
        title: "Uso Aceptable",
        body: "No uses FlexOfficers para actividades ilegales, fraude, acoso, información falsa, spam o uso indebido de la plataforma.",
      },
      {
        title: "Solicitudes de Seguridad y Aplicaciones",
        body: "Los clientes pueden publicar solicitudes de seguridad por una tarifa. Las empresas de seguridad pueden explorar y solicitar.",
        closing:
          "FlexOfficers no garantiza respuestas, contratación, contratos ni resultados.",
      },
      {
        title: "Pagos y Tarifas",
        body: "Las empresas de seguridad compran suscripciones anuales. Los clientes pagan una tarifa única para publicar una solicitud de seguridad. Los pagos se procesan de forma segura a través de Stripe.",
        closing: "Los precios pueden cambiar en el futuro.",
      },
      {
        title: "Sin Reembolsos",
        body: "Las suscripciones empresariales pueden cancelarse en cualquier momento. Si cancelas tu suscripción, seguirás teniendo acceso a las funciones pagadas hasta el final de tu período de facturación actual. No se emitirán reembolsos parciales ni prorrateados.",
        closing:
          "Las tarifas de publicación de solicitudes de seguridad son pagos únicos y no son reembolsables una vez que una solicitud de seguridad ha sido publicada o enviada.",
      },
      {
        title: "Limitación de Responsabilidad",
        body: "FlexOfficers es un mercado que conecta usuarios.",
        closing:
          "No somos responsables de decisiones de empleo, contratos, servicios prestados, disputas de pago ni acciones realizadas fuera de la plataforma.",
      },
      {
        title: "Cambios en los Términos",
        body: "Estos Términos de Servicio pueden actualizarse de vez en cuando.",
        closing:
          "El uso continuo de FlexOfficers constituye la aceptación de futuras actualizaciones.",
      },
    ],
    questions: {
      title: "¿Preguntas?",
      body: "Si tienes preguntas sobre estos Términos de Servicio, contáctanos.",
      cta: "Contáctanos",
    },
  },
  contact: {
    title: "Contactar FlexOfficers",
    subtitle:
      "Estamos aquí para ayudarte. Comunícate con nosotros para soporte de la plataforma, preguntas de facturación, problemas de cuenta u oportunidades de alianza.",
    getInTouch: {
      title: "Ponte en Contacto",
      intro:
        "Nuestro equipo está listo para ayudarte. Ya seas una empresa de seguridad, oficial o cliente, te responderemos lo antes posible.",
      emailLabel: "Correo",
      email: "flexofficer@gmail.com",
      phoneLabel: "Teléfono",
      phone: "239-900-5653",
      hoursLabel: "Tiempo de Respuesta",
      hoursLines: ["Normalmente respondemos dentro de 24 horas."],
      supportForLabel: "Soporte Para",
      supportFor:
        "Ayuda con Cuentas, Facturación, Solicitudes de Seguridad, Planes Empresariales, Perfiles de Oficiales y Alianzas",
    },
    form: {
      title: "Envíanos un Mensaje",
      description:
        "Completa el formulario a continuación y un miembro de nuestro equipo te responderá pronto.",
      fullNameLabel: "Nombre Completo",
      fullNamePlaceholder: "Tu nombre completo",
      emailLabel: "Correo Electrónico",
      emailPlaceholder: "tu@ejemplo.com",
      subjectLabel: "Asunto",
      subjectPlaceholder: "¿Cómo podemos ayudarte?",
      messageLabel: "¿Cómo podemos ayudarte?",
      messagePlaceholder: "Cuéntanos más sobre tu pregunta o solicitud...",
      submit: "Enviar Mensaje",
      submitting: "Enviando...",
      success:
        "Tu mensaje ha sido enviado correctamente. Nos pondremos en contacto contigo dentro de 24 horas.",
      error:
        "Algo salió mal. Inténtalo de nuevo más tarde o envíanos un correo directamente.",
    },
    commitment:
      "FlexOfficers está comprometido a ofrecer una plataforma segura y confiable para profesionales de seguridad, empresas y clientes. Tus consultas nos ayudan a seguir mejorando y apoyando a nuestra comunidad.",
  },
};

const translations: Record<LandingLanguage, LegalPagesTranslations> = {
  en,
  es,
};

export function getLegalPagesTranslations(
  language: LandingLanguage
): LegalPagesTranslations {
  return translations[language] ?? en;
}
