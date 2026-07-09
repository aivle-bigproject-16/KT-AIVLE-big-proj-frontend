export const ROUTES = {
  AUTH_LOGIN: '/auth/login',
  AUTH_SIGNUP: '/auth/signup',
  DASHBOARD: '/dashboard',
  BATTERY: '/battery',
  BATTERY_DETAIL: (batteryCellId: string | number) => `/battery/${batteryCellId}`,
  REPORT_INDIVIDUAL: '/report/individual',
  REPORT_INDIVIDUAL_DETAIL: (reportId: string | number) => `/report/individual/${reportId}`,
  REPORT_DAILY: '/report/daily',
  REPORT_DAILY_DETAIL: (reportId: string | number) => `/report/daily/${reportId}`,
} as const
