import { createBrowserRouter } from 'react-router-dom'
import MainMockPage from '@/pages/MainMockPage'
import AuthMockPage from '@/pages/AuthMockPage'
import BatteryMockPage from '@/pages/BatteryMockPage'
import BatteryDetailMockPage from '@/pages/BatteryDetailMockPage'
import DashboardMockPage from '@/pages/DashboardMockPage'
import IndividualReportMockPage from '@/pages/IndividualReportMockPage'
import IndividualReportDetailMockPage from '@/pages/IndividualReportDetailMockPage'
import DailyReportMockPage from '@/pages/DailyReportMockPage'
import DailyReportDetailMockPage from '@/pages/DailyReportDetailMockPage'

export const routerMock = createBrowserRouter([
  { path: '/', element: <MainMockPage /> },
  { path: '/auth', element: <AuthMockPage /> },
  { path: '/battery', element: <BatteryMockPage /> },
  { path: '/battery/:batteryCellId', element: <BatteryDetailMockPage /> },
  { path: '/dashboard', element: <DashboardMockPage /> },
  { path: '/report/individual', element: <IndividualReportMockPage /> },
  { path: '/report/individual/:reportId', element: <IndividualReportDetailMockPage /> },
  { path: '/report/daily', element: <DailyReportMockPage /> },
  { path: '/report/daily/:reportId', element: <DailyReportDetailMockPage /> },
])
