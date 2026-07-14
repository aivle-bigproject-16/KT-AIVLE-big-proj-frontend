import { useNavigate } from 'react-router-dom'
import { Modal } from '@/shared/ui/Modal'
import type { FinalLabel } from '@/features/battery/types'
import type { BatchProgress } from '../types'
import { ROUTES } from '@/core/navigation/routes'
import './SimulationCardModal.css'

interface SimulationCardModalProps {
  open: boolean
  onClose: () => void
  label: string
  batches: BatchProgress[]
  statusSource?: 'batch' | 'finalLabel'
  finalLabelFilter?: FinalLabel
  emptyMessage?: string
}

function normalizeStatusClass(status: string) {
  return status.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

function SimulationCardModal({
  open,
  onClose,
  label,
  batches,
  statusSource = 'batch',
  finalLabelFilter,
  emptyMessage = '현재 처리 중인 셀이 없습니다.',
}: SimulationCardModalProps) {
  const navigate = useNavigate()
  const rows = batches.flatMap((batch) =>
    batch.cells
      .filter((cell) => (finalLabelFilter ? cell.finalLabel === finalLabelFilter : true))
      .map((cell) => ({
        batchId: batch.batchId,
        batteryCellId: cell.batteryCellId,
        status: statusSource === 'finalLabel' ? (cell.finalLabel ?? '-') : batch.status,
      })),
  )

  return (
    <Modal open={open} onClose={onClose} className="simulation-card-modal">
      <div className="simulation-card-modal__header">
        <h3 className="simulation-card-modal__title">{label}</h3>
        <button className="simulation-card-modal__close" onClick={onClose} aria-label="닫기">
          ✕
        </button>
      </div>

      {rows.length === 0 ? (
        <p className="simulation-card-modal__empty">{emptyMessage}</p>
      ) : (
        <div className="simulation-card-modal__table-wrap">
          <table className="simulation-card-modal__table">
            <thead>
              <tr>
                <th>Batch ID</th>
                <th>Cell ID</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={`${row.batchId}-${row.batteryCellId}`}
                  className="simulation-card-modal__row--clickable"
                  onClick={() => navigate(ROUTES.BATTERY_DETAIL(row.batteryCellId))}
                >
                  <td>{row.batchId}</td>
                  <td>{row.batteryCellId}</td>
                  <td>
                    <span
                      className={`simulation-card-modal__status simulation-card-modal__status--${normalizeStatusClass(
                        row.status,
                      )}`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  )
}

export { SimulationCardModal }
