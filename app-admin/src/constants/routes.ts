import { SECTION_NAME } from '@/constants/navigator/section/SectionName'

export const ROUTES = {
  // Login
  [SECTION_NAME.LOGIN]: '/login',

  // Overview
  [SECTION_NAME.DASHBOARD]: '/',
  [SECTION_NAME.ANALYTICS]: '/overview/analytics',
  [SECTION_NAME.REALTIME]: '/overview/realtime',
  [SECTION_NAME.REPORTS]: '/overview/reports',

  // Commerce
  [SECTION_NAME.ORDERS]: '/commerce/orders',
  [SECTION_NAME.PRODUCTS]: '/commerce/products',
  [SECTION_NAME.CATEGORIES]: '/commerce/categories',
  [SECTION_NAME.COUPONS]: '/commerce/coupons',
  [SECTION_NAME.REVIEWS]: '/commerce/reviews',
  [SECTION_NAME.USERS]: '/commerce/users',
  [SECTION_NAME.SHIPPING]: '/commerce/shipping',
  [SECTION_NAME.SETTLEMENTS]: '/commerce/settlements',
  [SECTION_NAME.MEMBERSHIP]: '/commerce/membership',

  // Etc
  [SECTION_NAME.NOTIFICATIONS]: '/etc/notifications',
  [SECTION_NAME.FILES]: '/etc/files',
  [SECTION_NAME.BANNERS]: '/etc/banners',
  [SECTION_NAME.CAMPAIGNS]: '/etc/campaigns',
  [SECTION_NAME.PAGES]: '/etc/pages',
  [SECTION_NAME.SUPPORT]: '/etc/support',

  // System
  [SECTION_NAME.ADMINS]: '/system/admins',
  [SECTION_NAME.SETTINGS]: '/system/settings',
  [SECTION_NAME.ROLES]: '/system/roles',
  [SECTION_NAME.AUDIT_LOGS]: '/system/audit-logs',
  [SECTION_NAME.SYSTEM_STATUS]: '/system/system-status',
} as const
