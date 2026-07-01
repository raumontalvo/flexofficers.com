export type { NavItem } from "@/lib/nav-items";
export {
  getCompanyNavItems,
  getCompanySidebarItems,
  getOfficerNavItems,
  getOfficerSidebarItems,
} from "@/lib/nav-items";

import { getAppTranslations } from "@/lib/app-i18n";
import {
  getCompanyNavItems,
  getCompanySidebarItems,
  getOfficerNavItems,
  getOfficerSidebarItems,
} from "@/lib/nav-items";

const defaultAppNav = getAppTranslations("en").appNav;

/** @deprecated Use getOfficerNavItems(t.appNav.officerMobile) with translations */
export const officerNavItems = getOfficerNavItems(defaultAppNav.officerMobile);

/** @deprecated Use getOfficerSidebarItems(t.appNav.officerSidebar) with translations */
export const officerSidebarItems = getOfficerSidebarItems(defaultAppNav.officerSidebar);

/** @deprecated Use getCompanyNavItems(t.appNav.companyMobile) with translations */
export const companyNavItems = getCompanyNavItems(defaultAppNav.companyMobile);

/** @deprecated Use getCompanySidebarItems(t.appNav.companySidebar) with translations */
export const companySidebarItems = getCompanySidebarItems(defaultAppNav.companySidebar);
