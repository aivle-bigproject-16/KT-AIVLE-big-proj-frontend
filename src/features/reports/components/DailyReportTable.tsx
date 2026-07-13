import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/core/navigation/routes'
import { useDailyReportListStore } from '../store/useDailyReportListStore'

const COLUMNS = '140px 100px 1fr 170px 96px'
const BORDER_COLOR = '#E9BCB6'
const ACCENT_COLOR = '#E60012'

const STATUS_LABEL: Record<string, string> = {
  PENDING: '대기중',
  COMPLETED: '완료',
  FAILED: '실패',
}

function ArrowRightIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}

function DailyReportTable() {
  const list = useDailyReportListStore((s) => s.list)
  const isLoading = useDailyReportListStore((s) => s.isLoading)
  const error = useDailyReportListStore((s) => s.error)
  const { fetchList } = useDailyReportListStore((s) => s.actions)

  useEffect(() => {
    fetchList(0, 10)
  }, [fetchList])

  return (
    <section>
      <h2 style={{ marginBottom: 16 }}>일일 리포트</h2>

      {isLoading && <p>로딩 중...</p>}
      {error && <p style={{ color: ACCENT_COLOR }}>{error}</p>}

      <div
        style={{
          background: '#fff',
          border: `1px solid ${BORDER_COLOR}`,
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: COLUMNS,
            padding: '12px 24px',
            borderBottom: `1px solid ${BORDER_COLOR}`,
            fontSize: 13,
            fontWeight: 600,
            color: '#5B5F63',
          }}
        >
          <span>판정일자</span>
          <span>상태</span>
          <span>제목</span>
          <span>생성일시</span>
          <span style={{ textAlign: 'center' }}>상세</span>
        </div>

        {!isLoading && list.length === 0 && (
          <div style={{ padding: 24, textAlign: 'center', color: '#5B5F63' }}>
            등록된 리포트가 없습니다.
          </div>
        )}

        {list.map((item, index) => (
          <div
            key={item.reportId}
            style={{
              display: 'grid',
              gridTemplateColumns: COLUMNS,
              alignItems: 'center',
              padding: '16px 24px',
              borderBottom: index === list.length - 1 ? 'none' : `1px solid ${BORDER_COLOR}`,
              fontSize: 14,
              color: '#191C1D',
            }}
          >
            <span>{item.reportDate}</span>
            <span>{STATUS_LABEL[item.status] ?? item.status}</span>
            <span>{item.title ?? `리포트 #${item.reportId}`}</span>
            <span style={{ color: '#5B5F63' }}>{item.createdAt}</span>
            <span style={{ display: 'flex', justifyContent: 'center' }}>
              <Link
                to={ROUTES.REPORT_DAILY_DETAIL(item.reportId)}
                aria-label="상세보기"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  border: `1px solid ${ACCENT_COLOR}`,
                  color: ACCENT_COLOR,
                  textDecoration: 'none',
                }}
              >
                <ArrowRightIcon />
              </Link>
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default DailyReportTable
