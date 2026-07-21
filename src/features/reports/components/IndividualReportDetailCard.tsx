import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './IndividualReportDetailCard.css'
import { ROUTES } from '@/core/navigation/routes'
import { useIndividualReportDetailStore } from '../store/useIndividualReportDetailStore'
import IndividualReportHeader from './IndividualReportHeader'
import type { IndividualReportDetail, ImageMapping } from '../types'

interface IndividualReportDetailCardProps {
  reportId: number
}

function IndividualReportDetailCard({ reportId }: IndividualReportDetailCardProps) {
  const detail = useIndividualReportDetailStore((s) => s.detail)
  const isLoading = useIndividualReportDetailStore((s) => s.isLoading)
  const error = useIndividualReportDetailStore((s) => s.error)
  const { fetchDetail } = useIndividualReportDetailStore((s) => s.actions)

  useEffect(() => {
    fetchDetail(reportId)
  }, [fetchDetail, reportId])

  return (
    <section className="individual-detail">
      <Link to={ROUTES.REPORT_INDIVIDUAL} className="individual-detail__back">
        ← 개별 리포트 목록으로
      </Link>

      <div className="individual-detail__card">
        {isLoading && <p className="individual-detail__notice">불러오는 중...</p>}
        {error && <p className="individual-detail__notice individual-detail__notice--error">{error}</p>}

        {detail && detail.status === 'PENDING' && (
          <p className="individual-detail__notice">리포트를 생성하는 중입니다.</p>
        )}

        {detail && detail.status === 'FAILED' && (
          <p className="individual-detail__notice individual-detail__notice--error">
            리포트 생성에 실패했습니다.
          </p>
        )}

        {detail && detail.status === 'COMPLETED' && <IndividualDetailBody detail={detail} />}
      </div>
    </section>
  )
}

function IndividualDetailBody({ detail }: { detail: IndividualReportDetail }) {
  return (
    <>
      <IndividualReportHeader detail={detail} />

      <div className="individual-detail__section">
        <h2 className="individual-detail__section-title">검사 요약</h2>
        {detail.content ? (
          <p className="individual-detail__summary-body">{detail.content}</p>
        ) : (
          <p className="individual-detail__empty">본문이 없습니다.</p>
        )}
      </div>

      {detail.imageMappings.length > 0 && (
        <div className="individual-detail__section">
          <h2 className="individual-detail__section-title">감지 좌표</h2>
          <ul className="individual-detail__coord-list">
            {detail.imageMappings.map((mapping, i) => (
              <CoordItem key={`${mapping.imageType}-${mapping.imageId}-${i}`} mapping={mapping} />
            ))}
          </ul>
        </div>
      )}

      <div className="individual-detail__images-row">
        <ImageGroup title="CT 이미지" images={detail.ctImages} />
        <ImageGroup title="RGB 이미지" images={detail.rgbImages} />
      </div>
    </>
  )
}

function CoordItem({ mapping }: { mapping: ImageMapping }) {
  const { bbox } = mapping
  return (
    <li className="individual-detail__coord-item">
      <span className="individual-detail__coord-type">{mapping.imageType}</span>
      <span className="individual-detail__coord-value">
        x: {bbox.x}, y: {bbox.y}, w: {bbox.width}, h: {bbox.height}
      </span>
    </li>
  )
}

function ImageGroup({ title, images }: { title: string; images: string[] }) {
  return (
    <div className="individual-detail__image-group">
      <h2 className="individual-detail__section-title">{title}</h2>
      {images.length === 0 ? (
        <p className="individual-detail__empty">{title}가 없습니다.</p>
      ) : (
        <div className="individual-detail__image-grid">
          {images.map((src, i) => (
            <img key={src} src={src} alt={`${title} ${i + 1}`} className="individual-detail__image" />
          ))}
        </div>
      )}
    </div>
  )
}

export default IndividualReportDetailCard
