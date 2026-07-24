import { ImageBboxGrid } from '@/shared/ui/ImageBboxGrid'
import type { ImageBboxGridItem } from '@/shared/ui/ImageBboxGrid'
import './InspectionImageSection.css'
import type { Inspection } from '../types'

const LABEL_TONE: Record<string, 'reject' | 'fail' | 'pass'> = {
  REJECT: 'reject',
  FAIL: 'fail',
  PASS: 'pass',
}

export function ImageSection({
  images,
  defects,
}: {
  images: Inspection['image']
  defects: Inspection['defectResults']
}) {
  const items: ImageBboxGridItem[] = images.map((img) => {
    const imgDefects = defects.filter((d) => d.imageId === img.imageId)

    return {
      id: img.imageId,
      imageUrl: img.imageUrl,
      title: `${img.imageType} · ID ${img.imageId}`,
      typeLabel: img.imageType,
      regions: imgDefects
        .filter((d) => d.bbox)
        .map((d) => ({ id: d.defectResultId, bbox: d.bbox!, tone: LABEL_TONE[d.label] ?? 'pass' })),
      infoItems: imgDefects.map((d) => ({
        id: d.defectResultId,
        badgeText: d.label,
        badgeTone: LABEL_TONE[d.label] ?? 'pass',
        primaryText: d.defectType,
        secondaryText: `${d.imageType} · 신뢰도 ${Math.round(d.confidence * 100)}%${
          d.bbox ? ` · bbox (${d.bbox.x}, ${d.bbox.y}) ${d.bbox.width}×${d.bbox.height}` : ''
        }`,
      })),
    }
  })

  return (
    <div className="battery-detail__image-section">
      <ImageBboxGrid items={items} emptyText="이미지가 없습니다." />
    </div>
  )
}
