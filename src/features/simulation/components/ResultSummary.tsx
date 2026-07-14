import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ResultSummary.css'
import { useBatteryListStore } from '@/features/battery'
import { useSimulationStore } from '../store/useSimulationStore'
import type { FinalLabel } from '@/features/battery/types'
import { ROUTES } from '@/core/navigation/routes'

type ResultLabel = FinalLabel | 'FAIL'
type ResultFilter = ResultLabel | 'ALL'

function formatDateTime(value: string | null): string {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

interface CompletedCellRow {
  batteryCellId: number
  inspectionId: number
  latestFinalLabel: ResultLabel | null
}

function ResultSummary() {
  const navigate = useNavigate()
  const { fetchList } = useBatteryListStore((s) => s.actions)
  const completed = useSimulationStore((s) => s.completed)
  const [resultFilter, setResultFilter] = useState<ResultFilter>('ALL')

  useEffect(() => {
    fetchList()
  }, [fetchList])

  const displayList: CompletedCellRow[] = completed.flatMap((batch) =>
    batch.cells.map((cell) => ({
      batteryCellId: cell.batteryCellId,
      inspectionId: cell.inspectionId,
      latestFinalLabel: cell.finalLabel,
    })),
  )

  const filteredList = displayList.filter(
    (item) => resultFilter === 'ALL' || item.latestFinalLabel === resultFilter,
  )

  return (
    <div className="result-summary">
      <div className="result-summary__header">
        <h4 className="result-summary__title">검사 요약 목록</h4>
        <div className="result-summary__actions">
          <select
            className="result-summary__filter"
            value={resultFilter}
            onChange={(e) => setResultFilter(e.target.value as ResultFilter)}
          >
            <option value="ALL">전체</option>
            <option value="PASS">PASS</option>
            <option value="REJECT">REJECT</option>
            <option value="FAIL">FAIL</option>
          </select>
          <button className="result-summary__report-button">일일 리포트 생성</button>
        </div>
      </div>
      <div className="result-summary__table-wrapper">
        <table className="result-summary__table">
          <colgroup>
            <col className="result-summary__col-id" />
            <col className="result-summary__col-result" />
            <col className="result-summary__col-time" />
          </colgroup>
          <thead>
            <tr>
              <th>Cell ID</th>
              <th>Result</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map((item) => (
              <tr
                key={item.batteryCellId}
                className="result-summary__row--clickable"
                onClick={() => navigate(ROUTES.BATTERY_DETAIL(item.batteryCellId))}
              >
                <td>CELL-{item.batteryCellId}</td>
                <td className="result-summary__result">
                  <span
                    className={
                      item.latestFinalLabel === 'REJECT'
                        ? 'result-summary__dot result-summary__dot--reject'
                        : 'result-summary__dot'
                    }
                  />
                  {item.latestFinalLabel}
                </td>
                <td>-</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export { ResultSummary }
