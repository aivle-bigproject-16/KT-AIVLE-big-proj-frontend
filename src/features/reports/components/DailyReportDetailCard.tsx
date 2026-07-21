import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './DailyReportDetailCard.css'
import { ROUTES } from '@/core/navigation/routes'
import { useDailyReportDetailStore } from '../store/useDailyReportDetailStore'
import DailyReportHeader from './DailyReportHeader'
import DefectDistribution from './DefectDistribution'
import type { DailyReportDetail } from '../types'

const FAILURE_REASON_LABEL: Record<string, string> = {
  INCOMPLETE_SET: '당일 검사 데이터가 충분하지 않습니다.',
  AI_SERVER_ERROR: 'AI 서버 오류가 발생했습니다.',
  TIMEOUT: '리포트 생성 시간이 초과되었습니다.',
  MALFORMED_RESPONSE: 'AI 응답 형식이 올바르지 않습니다.',
  PARTIAL_ANALYSIS_FAILURE: '일부 검사 결과 분석에 실패했습니다.',
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
  const image = detail.ctImageUrl ?? detail.rgbImageUrl
  const imageType = detail.ctImageUrl ? 'CT' : 'RGB'

  return (
    <>
      <DailyReportHeader detail={detail} />

      <div className="daily-detail__summary-row">
        <div className="daily-detail__kpi-col">
          <div className="daily-detail__kpi-card">
            <span className="daily-detail__kpi-label">총 검사 수량 (TOTAL SCANNED)</span>
            <span className="daily-detail__kpi-value">{totalCount.toLocaleString()}</span>
          </div>
          <div className="daily-detail__kpi-card daily-detail__kpi-card--accent">
            <span className="daily-detail__kpi-label">종합 불량률 (OVERALL DEFECT RATE)</span>
            <span className="daily-detail__kpi-value daily-detail__kpi-value--accent">
              {defectRate.toFixed(2)}%
            </span>
          </div>
        </div>

        <DefectDistribution defects={defects} />
      </div>

      <div className="daily-detail__notes-row">
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
      </div>
    </>
  )
}

export default DailyReportDetailCard
