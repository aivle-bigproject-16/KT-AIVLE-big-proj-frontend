import './IndividualReportHeader.css'
import type { IndividualReportDetail } from '../types'

interface IndividualReportHeaderProps {
  detail: IndividualReportDetail
}

function IndividualReportHeader({ detail }: IndividualReportHeaderProps) {
  return (
    <header className="individual-report-header">
      <div className="individual-report-header__badges">
        <span className="individual-report-header__badge">ID: RPT-{detail.reportId}</span>
        <span className="individual-report-header__badge">{detail.cellSerialNo}</span>
      </div>
      <h1 className="individual-report-header__title">{detail.title ?? `개별 리포트 #${detail.reportId}`}</h1>
    </header>
  )
}

export default IndividualReportHeader
