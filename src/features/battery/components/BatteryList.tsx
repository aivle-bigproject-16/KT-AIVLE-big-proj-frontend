import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './BatteryList.css'
import { useBatteryListStore } from '../store/useBatteryListStore'
import { ROUTES } from '@/core/navigation/routes'

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3v12M7 10l5 5 5-5" />
      <path d="M4 19h16" />
    </svg>
  )
}

function FilterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 5h16l-6 8v6l-4-2v-4L4 5Z" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}

function ChevronLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 6l-6 6 6 6" />
    </svg>
  )
}

function ChevronRightSmallIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}

function formatDateTime(value: string | null): string {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

type HistoryTab = 'ALL' | 'DEFECT'

function BatteryList() {
  const list = useBatteryListStore((s) => s.list)
  const pageable = useBatteryListStore((s) => s.pageable)
  const isLoading = useBatteryListStore((s) => s.isLoading)
  const error = useBatteryListStore((s) => s.error)
  const { fetchList } = useBatteryListStore((s) => s.actions)

  const [activeTab, setActiveTab] = useState<HistoryTab>('ALL')

  useEffect(() => {
    fetchList()
  }, [fetchList])

  const total = pageable?.totalElements ?? list.length

  return (
    <div className="battery-list">
      <div className="battery-list__header">
        <div>
          <h1 className="battery-list__title">
            배터리별 점검 기록 <span className="battery-list__title-en">(Battery History)</span>
          </h1>
          <p className="battery-list__subtitle">
            Track and analyze individual battery cell inspection results across all production lines.
          </p>
        </div>
        <div className="battery-list__header-actions">
          <button type="button" className="battery-list__btn battery-list__btn--outline">
            <DownloadIcon />
            Export CSV
          </button>
          <button type="button" className="battery-list__btn battery-list__btn--primary">
            + New Query
          </button>
        </div>
      </div>

      <div className="battery-list__toolbar">
        <div className="battery-list__tabs">
          <button
            type="button"
            className={
              activeTab === 'ALL'
                ? 'battery-list__tab battery-list__tab--active'
                : 'battery-list__tab'
            }
            onClick={() => setActiveTab('ALL')}
          >
            전체 이력 (All History)
          </button>
          <button
            type="button"
            className={
              activeTab === 'DEFECT'
                ? 'battery-list__tab battery-list__tab--active'
                : 'battery-list__tab'
            }
            onClick={() => setActiveTab('DEFECT')}
          >
            불량 이력 (Defect History)
          </button>
        </div>
        <div className="battery-list__filters">
          <button type="button" className="battery-list__filter">
            <FilterIcon />
            Line A1
            <ChevronDownIcon />
          </button>
          <button type="button" className="battery-list__filter">
            <CalendarIcon />
            2024-05-12 - Today
          </button>
        </div>
      </div>

      <div className="battery-list__panel" />

      <div className="battery-list__table-card">
        {isLoading && <p className="battery-list__status">로딩 중...</p>}
        {error && <p className="battery-list__status battery-list__status--error">{error}</p>}

        <table className="battery-list__table">
          <colgroup>
            <col className="battery-list__col-index" />
            <col className="battery-list__col-id" />
            <col className="battery-list__col-model" />
            <col className="battery-list__col-date" />
            <col className="battery-list__col-result" />
            <col className="battery-list__col-detail" />
          </colgroup>
          <thead>
            <tr>
              <th>#</th>
              <th>배터리 ID (Battery ID)</th>
              <th>모델 (Model)</th>
              <th>최종 점검일 (Last Inspection)</th>
              <th>판정 결과 (Result)</th>
              <th>상세 보기 (Detail)</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => {
              const isReject = item.latestFinalLabel === 'REJECT' || item.latestFinalLabel === 'FAIL'
              return (
                <tr key={item.batteryCellId}>
                  <td>{index + 1}</td>
                  <td
                    className={
                      isReject
                        ? 'battery-list__id battery-list__id--reject'
                        : 'battery-list__id'
                    }
                  >
                    {item.cellSerialNo ?? `CELL-${item.batteryCellId}`}
                  </td>
                  <td>{item.modelName ?? '-'}</td>
                  <td>{formatDateTime(item.latestAnalyzedAt)}</td>
                  <td>
                    <span className="battery-list__result">
                      <span
                        className={
                          isReject
                            ? 'battery-list__dot battery-list__dot--reject'
                            : 'battery-list__dot battery-list__dot--pass'
                        }
                      />
                      {item.latestFinalLabel ?? '-'}
                    </span>
                  </td>
                  <td>
                    <Link
                      to={ROUTES.BATTERY_DETAIL(item.batteryCellId)}
                      className="battery-list__detail-link"
                    >
                      <ChevronRightIcon />
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <div className="battery-list__footer">
          <span className="battery-list__footer-text">
            Showing {list.length === 0 ? 0 : 1} to {list.length} of {total} entries
          </span>
          <div className="battery-list__pagination">
            <button type="button" className="battery-list__page-btn">
              <ChevronLeftIcon />
            </button>
            <button type="button" className="battery-list__page-btn battery-list__page-btn--active">
              1
            </button>
            <button type="button" className="battery-list__page-btn">
              2
            </button>
            <button type="button" className="battery-list__page-btn">
              3
            </button>
            <span className="battery-list__page-ellipsis">...</span>
            <button type="button" className="battery-list__page-btn">
              <ChevronRightSmallIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export { BatteryList }
