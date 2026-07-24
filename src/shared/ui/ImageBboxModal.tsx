import { useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useModalAnimation } from '@/shared/hooks/useModalAnimation'
import './ImageBboxModal.css'

export interface ImageBboxRegion {
  id: string | number
  bbox: { x: number; y: number; width: number; height: number }
  tone?: 'reject' | 'fail' | 'pass' | 'neutral'
}

export interface ImageBboxInfoItem {
  id: string | number
  badgeText?: string
  badgeTone?: 'reject' | 'fail' | 'pass' | 'neutral'
  primaryText: string
  secondaryText?: string
}

interface ImageBboxModalProps {
  title: string
  imageUrl: string
  regions: ImageBboxRegion[]
  infoItems?: ImageBboxInfoItem[]
  open: boolean
  onClose: () => void
}

const TONE_STYLE: Record<string, { stroke: string; fill: string }> = {
  reject: { stroke: '#e60012', fill: 'rgba(230,0,18,0.15)' },
  fail: { stroke: '#f97316', fill: 'rgba(249,115,22,0.15)' },
  pass: { stroke: '#2a78d6', fill: 'rgba(42,120,214,0.15)' },
  neutral: { stroke: '#2a78d6', fill: 'rgba(42,120,214,0.15)' },
}

function renderToBlobUrl(imageUrl: string, regions: ImageBboxRegion[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('canvas context unavailable'))
        return
      }

      ctx.drawImage(img, 0, 0)

      const lw = Math.max(2, Math.round(img.naturalWidth / 800))
      regions.forEach((r) => {
        const style = TONE_STYLE[r.tone ?? 'neutral']
        ctx.lineWidth = lw
        ctx.strokeStyle = style.stroke
        ctx.fillStyle = style.fill
        ctx.fillRect(r.bbox.x, r.bbox.y, r.bbox.width, r.bbox.height)
        ctx.strokeRect(r.bbox.x, r.bbox.y, r.bbox.width, r.bbox.height)
      })

      try {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('toBlob returned null'))
            return
          }
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

function ImageBboxModal({ title, imageUrl, regions, infoItems, open, onClose }: ImageBboxModalProps) {
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

    renderToBlobUrl(imageUrl, regions)
      .then((url) => {
        if (cancelled) {
          URL.revokeObjectURL(url)
          return
        }
        if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current)
        blobUrlRef.current = url
        setRenderedUrl(url)
      })
      .catch(() => {
        // CORS 등 실패 시 원본 URL로 폴백
        if (!cancelled) setRenderedUrl(imageUrl)
      })

    return () => {
      cancelled = true
    }
  }, [imageUrl]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!mounted) return null

  return createPortal(
    <div className="image-bbox-modal-overlay" data-visible={visible} onClick={onClose}>
      <div className="image-bbox-modal" onClick={(e) => e.stopPropagation()}>
        <div className="image-bbox-modal__header">
          <span className="image-bbox-modal__title">{title}</span>
          <button type="button" className="image-bbox-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="image-bbox-modal__body">
          {renderedUrl ? (
            <img src={renderedUrl} alt={title} className="image-bbox-modal__img" />
          ) : (
            <span className="image-bbox-modal__loading">이미지 렌더링 중…</span>
          )}
        </div>

        {infoItems && infoItems.length > 0 && (
          <ul className="image-bbox-modal__info-list">
            {infoItems.map((item) => (
              <li key={item.id} className="image-bbox-modal__info-item">
                {item.badgeText && (
                  <span
                    className={`image-bbox-modal__badge image-bbox-modal__badge--${item.badgeTone ?? 'neutral'}`}
                  >
                    {item.badgeText}
                  </span>
                )}
                <span className="image-bbox-modal__primary">{item.primaryText}</span>
                {item.secondaryText && (
                  <span className="image-bbox-modal__secondary">{item.secondaryText}</span>
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

export { ImageBboxModal }
