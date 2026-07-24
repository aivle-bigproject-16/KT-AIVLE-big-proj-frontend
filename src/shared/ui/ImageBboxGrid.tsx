import { useRef, useState } from 'react'
import { ImageBboxModal } from './ImageBboxModal'
import type { ImageBboxRegion, ImageBboxInfoItem } from './ImageBboxModal'
import './ImageBboxGrid.css'

export interface ImageBboxGridItem {
  id: string | number
  imageUrl: string
  title: string
  typeLabel?: string
  regions: ImageBboxRegion[]
  infoItems?: ImageBboxInfoItem[]
}

interface ImageBboxGridProps {
  items: ImageBboxGridItem[]
  emptyText: string
}

function useThumbnailScale() {
  const imgRef = useRef<HTMLImageElement>(null)
  const [scale, setScale] = useState<{ sx: number; sy: number; ox: number; oy: number } | null>(null)

  const handleLoad = () => {
    const img = imgRef.current
    if (!img || !img.naturalWidth) return
    const nw = img.naturalWidth
    const nh = img.naturalHeight
    const dw = img.clientWidth
    const dh = img.clientHeight
    const s = Math.max(dw / nw, dh / nh)
    setScale({ sx: s, sy: s, ox: (dw - nw * s) / 2, oy: (dh - nh * s) / 2 })
  }

  return { imgRef, scale, handleLoad }
}

function GridThumbnail({ item, onClick }: { item: ImageBboxGridItem; onClick: () => void }) {
  const { imgRef, scale, handleLoad } = useThumbnailScale()

  return (
    <button type="button" className="image-bbox-grid__item" onClick={onClick}>
      <img
        ref={imgRef}
        src={item.imageUrl}
        alt={item.title}
        className="image-bbox-grid__img"
        onLoad={handleLoad}
      />
      {item.typeLabel && <span className="image-bbox-grid__type-badge">{item.typeLabel}</span>}
      {scale &&
        item.regions.map((r) => (
          <div
            key={r.id}
            className={`image-bbox-grid__region image-bbox-grid__region--${r.tone ?? 'neutral'}`}
            style={{
              left: scale.ox + r.bbox.x * scale.sx,
              top: scale.oy + r.bbox.y * scale.sy,
              width: r.bbox.width * scale.sx,
              height: r.bbox.height * scale.sy,
            }}
          />
        ))}
    </button>
  )
}

function ImageBboxGrid({ items, emptyText }: ImageBboxGridProps) {
  const [openId, setOpenId] = useState<string | number | null>(null)
  const openItem = items.find((item) => item.id === openId) ?? null

  if (items.length === 0) {
    return <p className="image-bbox-grid__empty">{emptyText}</p>
  }

  return (
    <>
      <div className="image-bbox-grid">
        {items.map((item) => (
          <GridThumbnail key={item.id} item={item} onClick={() => setOpenId(item.id)} />
        ))}
      </div>

      {openItem && (
        <ImageBboxModal
          title={openItem.title}
          imageUrl={openItem.imageUrl}
          regions={openItem.regions}
          infoItems={openItem.infoItems}
          open={openId !== null}
          onClose={() => setOpenId(null)}
        />
      )}
    </>
  )
}

export { ImageBboxGrid }
