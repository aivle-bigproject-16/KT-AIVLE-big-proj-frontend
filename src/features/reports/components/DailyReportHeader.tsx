import './DailyReportHeader.css'
import type { DailyReportDetail } from '../types'

function formatDateTime(value: string | null): string {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

interface DailyReportHeaderProps {
  detail: DailyReportDetail
}

function DailyReportHeader({ detail }: DailyReportHeaderProps) {
  return (
    <header className="daily-report-header">
      <div className="daily-report-header__top">
        <div className="daily-report-header__badges">
          <span className="daily-report-header__badge">ID: RPT-{detail.reportId}</span>
        </div>
        <div className="daily-report-header__actions">
          <button type="button" className="daily-report-header__btn" onClick={() => window.print()}>
            🖨 인쇄하기
          </button>
        </div>
      </div>
      <h1 className="daily-report-header__title">{detail.title ?? `일일 리포트 #${detail.reportId}`}</h1>
      <ul className="daily-report-header__meta">
        <li>
          <strong>기준일</strong>
          {detail.reportDate}
        </li>
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

export default DailyReportHeader
