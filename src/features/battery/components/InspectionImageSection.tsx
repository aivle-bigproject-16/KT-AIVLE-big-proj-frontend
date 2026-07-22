import { useState, useRef } from 'react'
import { BatteryImageModal } from './BatteryImageModal'
import './InspectionImageSection.css'
import type { Inspection } from '../types'

type LightboxImg = Inspection['image'][number]

function useBboxScale() {
  const imgRef = useRef<HTMLImageElement>(null)
  const [bboxScale, setBboxScale] = useState<{
    sx: number; sy: number; ox: number; oy: number
  } | null>(null)

  const handleLoad = () => {
    const img = imgRef.current
    if (!img || !img.naturalWidth) return
    const nw = img.naturalWidth
    const nh = img.naturalHeight
    const dw = img.clientWidth
    const dh = img.clientHeight
    const s = Math.max(dw / nw, dh / nh)
    setBboxScale({ sx: s, sy: s, ox: (dw - nw * s) / 2, oy: (dh - nh * s) / 2 })
  }

  return { imgRef, bboxScale, handleLoad }
}

function BboxOverlays({
  defects,
  scale,
}: {
  defects: Inspection['defectResults']
  scale: { sx: number; sy: number; ox: number; oy: number }
}) {
  return (
    <>
      {defects.map((d) => {
        if (!d.bbox) return null
        return (
          <div
            key={d.defectResultId}
            className={`battery-detail__bbox-rect battery-detail__bbox-rect--${d.label.toLowerCase()}`}
            style={{
              left: scale.ox + d.bbox.x * scale.sx,
              top: scale.oy + d.bbox.y * scale.sy,
              width: d.bbox.width * scale.sx,
              height: d.bbox.height * scale.sy,
            }}
          />
        )
      })}
    </>
  )
}

function ImageWithBbox({
  image,
  defects,
  onClick,
}: {
  image: LightboxImg
  defects: Inspection['defectResults']
  onClick: () => void
}) {
  const { imgRef, bboxScale, handleLoad } = useBboxScale()

  return (
    <button type="button" className="battery-detail__image-wrap" onClick={onClick}>
      <img
        ref={imgRef}
        src={image.imageUrl}
        alt={`${image.imageType} ${image.imageId}`}
        className="battery-detail__image"
        onLoad={handleLoad}
      />
      <span className="battery-detail__image-type-overlay">{image.imageType}</span>
      {bboxScale && <BboxOverlays defects={defects} scale={bboxScale} />}
    </button>
  )
}

export function ImageSection({
  images,
  defects,
}: {
  images: Inspection['image']
  defects: Inspection['defectResults']
}) {
  const [lightboxImg, setLightboxImg] = useState<LightboxImg | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const openLightbox = (img: LightboxImg) => {
    setLightboxImg(img)
    setLightboxOpen(true)
  }

  const closeLightbox = () => setLightboxOpen(false)

  return (
    <div className="battery-detail__image-section">
      {images.length === 0 ? (
        <p className="battery-detail__empty">이미지가 없습니다.</p>
      ) : (
        <div className="battery-detail__image-grid">
          {images.map((img) => (
            <ImageWithBbox
              key={img.imageId}
              image={img}
              defects={defects.filter((d) => d.imageId === img.imageId)}
              onClick={() => openLightbox(img)}
            />
          ))}
        </div>
      )}

      {lightboxImg && (
        <BatteryImageModal
          image={lightboxImg}
          defects={defects.filter((d) => d.imageId === lightboxImg.imageId)}
          open={lightboxOpen}
          onClose={closeLightbox}
        />
      )}
    </div>
  )
}
