import './IndividualReportHeader.css'
import type { IndividualReportDetail } from '../types'

function formatDateTime(value: string | null): string {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

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
      <ul className="individual-report-header__meta">
        <li>
          <strong>생성일시</strong>
          {formatDateTime(detail.createdAt)}
        </li>
        <li>
          <strong>수정일시</strong>
          {formatDateTime(detail.updatedAt)}
        </li>
      </ul>
    </header>
  )
}

export default IndividualReportHeader
