import { Modal } from '@/shared/ui/Modal'
import type { BatchProgress } from '../types'
import './SimulationCardModal.css'

interface SimulationCardModalProps {
  open: boolean
  onClose: () => void
  label: string
  batches: BatchProgress[]
}

function SimulationCardModal({ open, onClose, label, batches }: SimulationCardModalProps) {
  const rows = batches.flatMap((batch) =>
    batch.cells.map((cell) => ({
      batchId: batch.batchId,
      batteryCellId: cell.batteryCellId,
      status: batch.status,
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
        <p className="simulation-card-modal__empty">현재 처리 중인 셀이 없습니다.</p>
      ) : (
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
              <tr key={`${row.batchId}-${row.batteryCellId}`}>
                <td>{row.batchId}</td>
                <td>{row.batteryCellId}</td>
                <td>
                  <span className={`simulation-card-modal__status simulation-card-modal__status--${row.status.toLowerCase()}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Modal>
  )
}

export { SimulationCardModal }
