import { useEffect } from 'react'
import './ResultSummary.css'
import { useBatteryListStore } from '@/features/battery'

function ResultSummary() {
  const list = useBatteryListStore((s) => s.list)
  const { fetchList } = useBatteryListStore((s) => s.actions)

  useEffect(() => {
    fetchList()
  }, [fetchList])

  return (
    <div className="result-summary">
      <div className="result-summary__header">
        <h4 className="result-summary__title">검사 요약 목록</h4>
        <button className="result-summary__report-button">일일 리포트 생성</button>
      </div>
      <table className="result-summary__table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Cell ID</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item) => (
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
  )
}

export { ResultSummary }
