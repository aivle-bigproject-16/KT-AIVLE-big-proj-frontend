import { useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useModalAnimation } from '@/shared/hooks/useModalAnimation'
import './BatteryImageModal.css'
import type { InspectionImage, DefectResult } from '../types'

interface Props {
  image: InspectionImage
  defects: DefectResult[]
  open: boolean
  onClose: () => void
}

const BBOX_STYLE: Record<string, { stroke: string; fill: string }> = {
  REJECT: { stroke: '#e60012', fill: 'rgba(230,0,18,0.15)' },
  FAIL:   { stroke: '#f97316', fill: 'rgba(249,115,22,0.15)' },
  PASS:   { stroke: '#2a78d6', fill: 'rgba(42,120,214,0.15)' },
}

function renderToBlobUrl(imageUrl: string, defects: DefectResult[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) { reject(new Error('canvas context unavailable')); return }

      ctx.drawImage(img, 0, 0)

      const lw = Math.max(2, Math.round(img.naturalWidth / 800))
      defects.forEach((d) => {
        if (!d.bbox) return
        const style = BBOX_STYLE[d.label] ?? BBOX_STYLE.PASS
        ctx.lineWidth = lw
        ctx.strokeStyle = style.stroke
        ctx.fillStyle = style.fill
        ctx.fillRect(d.bbox.x, d.bbox.y, d.bbox.width, d.bbox.height)
        ctx.strokeRect(d.bbox.x, d.bbox.y, d.bbox.width, d.bbox.height)
      })

      try {
        canvas.toBlob((blob) => {
          if (!blob) { reject(new Error('toBlob returned null')); return }
          resolve(URL.createObjectURL(blob))
        }, 'image/png')
      } catch (e) {
        reject(e)
      }
    }

    img.onerror = () => reject(new Error('image load failed'))
    img.src = imageUrl
  })
}

export function BatteryImageModal({ image, defects, open, onClose }: Props) {
  const { mounted, visible } = useModalAnimation(open)
  const [renderedUrl, setRenderedUrl] = useState<string | null>(null)
  const blobUrlRef = useRef<string | null>(null)

  // 언마운트 시 blob URL 해제
  useEffect(() => {
    return () => {
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current)
    }
  }, [])

  // 이미지 변경 시 canvas에 렌더링 → blob URL 생성
  useEffect(() => {
    setRenderedUrl(null)
    let cancelled = false

    renderToBlobUrl(image.imageUrl, defects)
      .then((url) => {
        if (cancelled) { URL.revokeObjectURL(url); return }
        if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current)
        blobUrlRef.current = url
        setRenderedUrl(url)
      })
      .catch(() => {
        // CORS 등 실패 시 원본 URL로 폴백
        if (!cancelled) setRenderedUrl(image.imageUrl)
      })

    return () => { cancelled = true }
  }, [image.imageId]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!mounted) return null

  return createPortal(
    <div
      className="battery-image-modal-overlay"
      data-visible={visible}
      onClick={onClose}
    >
      <div className="battery-image-modal" onClick={(e) => e.stopPropagation()}>
        <div className="battery-image-modal__header">
          <span className="battery-image-modal__title">
            {image.imageType} · ID {image.imageId}
          </span>
          <button type="button" className="battery-image-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="battery-image-modal__body">
          {renderedUrl ? (
            <img
              src={renderedUrl}
              alt={`${image.imageType} ${image.imageId}`}
              className="battery-image-modal__img"
            />
          ) : (
            <span className="battery-image-modal__loading">이미지 렌더링 중…</span>
          )}
        </div>

        {defects.length > 0 && (
          <ul className="battery-image-modal__defects">
            {defects.map((d) => (
              <li key={d.defectResultId} className="battery-image-modal__defect-item">
                <span className={`battery-image-modal__badge battery-image-modal__badge--${d.label.toLowerCase()}`}>
                  {d.label}
                </span>
                <span className="battery-image-modal__defect-type">{d.defectType}</span>
                <span className="battery-image-modal__image-type">{d.imageType}</span>
                <span className="battery-image-modal__conf">
                  신뢰도 {Math.round(d.confidence * 100)}%
                </span>
                {d.bbox && (
                  <span className="battery-image-modal__bbox-info">
                    bbox ({d.bbox.x}, {d.bbox.y}) {d.bbox.width}×{d.bbox.height}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>,
    document.body,
  )
}
