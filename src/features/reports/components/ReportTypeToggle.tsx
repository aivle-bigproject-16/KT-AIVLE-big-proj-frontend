import { Link, useLocation } from 'react-router-dom'
import './ReportTypeToggle.css'
import { ROUTES } from '@/core/navigation/routes'

function ReportTypeToggle() {
  const { pathname } = useLocation()
  const isDaily = pathname.startsWith(ROUTES.REPORT_DAILY)

  return (
    <div className="report-type-toggle">
      <Link
        to={ROUTES.REPORT_DAILY}
        className={
          isDaily
            ? 'report-type-toggle__item report-type-toggle__item--active'
            : 'report-type-toggle__item'
        }
      >
        일일 리포트
      </Link>
      <Link
        to={ROUTES.REPORT_INDIVIDUAL}
        className={
          !isDaily
            ? 'report-type-toggle__item report-type-toggle__item--active'
            : 'report-type-toggle__item'
        }
      >
        개별 리포트
      </Link>
    </div>
  )
}

export { ReportTypeToggle }
