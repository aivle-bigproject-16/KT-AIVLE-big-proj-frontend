import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './DailyReportDetailCard.css'
import { ROUTES } from '@/core/navigation/routes'
import { useDailyReportDetailStore } from '../store/useDailyReportDetailStore'
import type { DailyReportDetail } from '../types'

const DEFECT_COLORS = ['#2a78d6', '#008300', '#e87ba4', '#eda100']

const FAILURE_REASON_LABEL: Record<string, string> = {
  INCOMPLETE_SET: '당일 검사 데이터가 충분하지 않습니다.',
  AI_SERVER_ERROR: 'AI 서버 오류가 발생했습니다.',
  TIMEOUT: '리포트 생성 시간이 초과되었습니다.',
  MALFORMED_RESPONSE: 'AI 응답 형식이 올바르지 않습니다.',
  PARTIAL_ANALYSIS_FAILURE: '일부 검사 결과 분석에 실패했습니다.',
}

function formatDateTime(value: string | null): string {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

interface DailyReportDetailCardProps {
  reportId: number
}

function DailyReportDetailCard({ reportId }: DailyReportDetailCardProps) {
  const detail = useDailyReportDetailStore((s) => s.detail)
  const isLoading = useDailyReportDetailStore((s) => s.isLoading)
  const error = useDailyReportDetailStore((s) => s.error)
  const { fetchDetail } = useDailyReportDetailStore((s) => s.actions)

  useEffect(() => {
    fetchDetail(reportId)
  }, [fetchDetail, reportId])

  return (
    <section className="daily-detail">
      <Link to={ROUTES.REPORT_DAILY} className="daily-detail__back">
        ← 일일 리포트 목록으로
      </Link>

      <div className="daily-detail__card">
        {isLoading && <p className="daily-detail__notice">불러오는 중...</p>}
        {error && <p className="daily-detail__notice daily-detail__notice--error">{error}</p>}

        {detail && detail.status === 'PENDING' && (
          <p className="daily-detail__notice">리포트를 생성하는 중입니다.</p>
        )}

        {detail && detail.status === 'FAILED' && (
          <p className="daily-detail__notice daily-detail__notice--error">
            {detail.failureReason
              ? (FAILURE_REASON_LABEL[detail.failureReason] ?? detail.failureReason)
              : '리포트 생성에 실패했습니다.'}
          </p>
        )}

        {detail && detail.status === 'COMPLETED' && <DailyDetailBody detail={detail} />}
      </div>
    </section>
  )
}

function DailyDetailBody({ detail }: { detail: DailyReportDetail }) {
  const { totalCount, rejectCount, defects } = detail.summary
  const defectRate = totalCount > 0 ? (rejectCount / totalCount) * 100 : 0
  const defectTotal = defects.reduce((sum, d) => sum + d.count, 0)
  const image = detail.ctImageUrl ?? detail.rgbImageUrl
  const imageType = detail.ctImageUrl ? 'CT' : 'RGB'

  return (
    <>
      <header className="daily-detail__header">
        <div className="daily-detail__header-top">
          <div className="daily-detail__badges">
            <span className="daily-detail__badge">ID: RPT-{detail.reportId}</span>
          </div>
          <div className="daily-detail__actions">
            <button type="button" className="daily-detail__btn" onClick={() => window.print()}>
              🖨 인쇄하기
            </button>
          </div>
        </div>
        <h1 className="daily-detail__title">{detail.title ?? `일일 리포트 #${detail.reportId}`}</h1>
        <ul className="daily-detail__meta">
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

      <div className="daily-detail__kpi-row">
        <div className="daily-detail__kpi-card">
          <span className="daily-detail__kpi-label">총 검사 수량 (TOTAL SCANNED)</span>
          <span className="daily-detail__kpi-value">{totalCount.toLocaleString()}</span>
        </div>
        <div className="daily-detail__kpi-card daily-detail__kpi-card--accent">
          <span className="daily-detail__kpi-label">종합 불량률 (OVERALL DEFECT RATE)</span>
          <span className="daily-detail__kpi-value daily-detail__kpi-value--accent">{defectRate.toFixed(2)}%</span>
        </div>
      </div>

      <div className="daily-detail__distribution">
        <h2 className="daily-detail__section-title">결함 유형별 분포 (DEFECT DISTRIBUTION)</h2>
        {defectTotal === 0 ? (
          <p className="daily-detail__empty">집계된 결함이 없습니다.</p>
        ) : (
          <div className="daily-detail__distribution-body">
            <ul className="daily-detail__legend">
              {defects.map((d, i) => (
                <li key={d.defectType} className="daily-detail__legend-item">
                  <span
                    className="daily-detail__legend-dot"
                    style={{ background: DEFECT_COLORS[i % DEFECT_COLORS.length] }}
                  />
                  <span className="daily-detail__legend-label">{d.defectType}</span>
                  <span className="daily-detail__legend-value">
                    {((d.count / defectTotal) * 100).toFixed(0)}% ({d.count})
                  </span>
                </li>
              ))}
            </ul>
            <DefectDonut defects={defects} total={defectTotal} />
          </div>
        )}
      </div>

      <div className="daily-detail__notes">
        <h2 className="daily-detail__section-title">작업자 특이사항</h2>
        {detail.content ? (
          <p className="daily-detail__notes-body">{detail.content}</p>
        ) : (
          <p className="daily-detail__empty">본문이 없습니다.</p>
        )}
      </div>

      <div className="daily-detail__reference">
        <h2 className="daily-detail__section-title">참조 이미지</h2>
        {image ? (
          <figure className="daily-detail__reference-image">
            <img src={image} alt="대표 이미지" />
            <figcaption>{imageType} 이미지</figcaption>
          </figure>
        ) : (
          <p className="daily-detail__empty">참조 이미지가 없습니다.</p>
        )}
      </div>
    </>
  )
}

function DefectDonut({ defects, total }: { defects: DailyReportDetail['summary']['defects']; total: number }) {
  const radius = 70
  const strokeWidth = 24
  const circumference = 2 * Math.PI * radius

  const segments = defects.reduce<{ defectType: string; dash: number; offset: number }[]>((acc, d) => {
    const prevOffset = acc.length > 0 ? acc[acc.length - 1].offset + acc[acc.length - 1].dash : 0
    const dash = (d.count / total) * circumference
    acc.push({ defectType: d.defectType, dash, offset: prevOffset })
    return acc
  }, [])

  return (
    <div className="daily-detail__donut-wrap">
      <svg viewBox="0 0 200 200" className="daily-detail__donut" role="img" aria-label="결함 유형별 분포">
        <circle cx="100" cy="100" r={radius} fill="none" stroke="#e1e0d9" strokeWidth={strokeWidth} />
        {segments.map((s, i) => (
          <circle
            key={s.defectType}
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={DEFECT_COLORS[i % DEFECT_COLORS.length]}
            strokeWidth={strokeWidth}
            strokeDasharray={`${s.dash} ${circumference - s.dash}`}
            strokeDashoffset={-s.offset}
            transform="rotate(-90 100 100)"
          />
        ))}
      </svg>
      <div className="daily-detail__donut-center">
        <span className="daily-detail__donut-total">{total.toLocaleString()}</span>
        <span className="daily-detail__donut-total-label">Total</span>
      </div>
    </div>
  )
}

export default DailyReportDetailCard
