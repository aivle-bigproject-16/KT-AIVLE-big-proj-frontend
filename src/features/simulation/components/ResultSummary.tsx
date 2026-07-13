import { useEffect, useState } from 'react'
import './ResultSummary.css'
import { useBatteryListStore } from '@/features/battery'
import type { BatteryListItem, FinalLabel } from '@/features/battery/types'

type ResultFilter = FinalLabel | 'ALL'

// 스크롤 동작 확인용 더미 목록 (실제 응답이 5개 미만이라 스크롤이 필요한 상황을 재현하기 위함)
const DUMMY_ITEMS: BatteryListItem[] = [
  { inspectionId: 101, batteryCellId: 1001, cellSerialNo: 'CELL-101', modelName: 'MODEL-A', cellType: 'POUCH', latestFinalLabel: 'PASS', latestAnalyzedAt: '2026-07-07T09:00:00' },
  { inspectionId: 102, batteryCellId: 1002, cellSerialNo: 'CELL-102', modelName: 'MODEL-A', cellType: 'POUCH', latestFinalLabel: 'REJECT', latestAnalyzedAt: '2026-07-07T09:05:00' },
  { inspectionId: 103, batteryCellId: 1003, cellSerialNo: 'CELL-103', modelName: 'MODEL-B', cellType: 'CYLINDRICAL', latestFinalLabel: 'PASS', latestAnalyzedAt: '2026-07-07T09:10:00' },
  { inspectionId: 104, batteryCellId: 1004, cellSerialNo: 'CELL-104', modelName: 'MODEL-B', cellType: 'CYLINDRICAL', latestFinalLabel: 'PASS', latestAnalyzedAt: '2026-07-07T09:15:00' },
  { inspectionId: 105, batteryCellId: 1005, cellSerialNo: 'CELL-105', modelName: 'MODEL-C', cellType: 'PRISMATIC', latestFinalLabel: 'REJECT', latestAnalyzedAt: '2026-07-07T09:20:00' },
  { inspectionId: 106, batteryCellId: 1006, cellSerialNo: 'CELL-106', modelName: 'MODEL-C', cellType: 'PRISMATIC', latestFinalLabel: 'PASS', latestAnalyzedAt: '2026-07-07T09:25:00' },
  { inspectionId: 107, batteryCellId: 1007, cellSerialNo: 'CELL-107', modelName: 'MODEL-A', cellType: 'POUCH', latestFinalLabel: 'PASS', latestAnalyzedAt: '2026-07-07T09:30:00' },
  { inspectionId: 108, batteryCellId: 1008, cellSerialNo: 'CELL-108', modelName: 'MODEL-B', cellType: 'CYLINDRICAL', latestFinalLabel: 'REJECT', latestAnalyzedAt: '2026-07-07T09:35:00' },
]

function ResultSummary() {
  const list = useBatteryListStore((s) => s.list)
  const { fetchList } = useBatteryListStore((s) => s.actions)
  const [resultFilter, setResultFilter] = useState<ResultFilter>('ALL')

  useEffect(() => {
    fetchList()
  }, [fetchList])

  const displayList = [...list, ...DUMMY_ITEMS].filter(
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
          </select>
          <button className="result-summary__report-button">일일 리포트 생성</button>
        </div>
      </div>
      <div className="result-summary__table-wrapper">
        <table className="result-summary__table">
          <colgroup>
            <col className="result-summary__col-time" />
            <col className="result-summary__col-id" />
            <col className="result-summary__col-result" />
          </colgroup>
          <thead>
            <tr>
              <th>Time</th>
              <th>Cell ID</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {displayList.map((item) => (
              <tr key={item.batteryCellId}>
                <td>{item.latestAnalyzedAt}</td>
                <td>{item.cellSerialNo}</td>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export { ResultSummary }
