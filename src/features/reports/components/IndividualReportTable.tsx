import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import './ReportTable.css'
import './IndividualReportTable.css'
import { ROUTES } from '@/core/navigation/routes'
import { DetailLinkButton } from '@/shared/ui/DetailLinkButton'
import { Pagination } from '@/shared/ui/Pagination'
import { useIndividualReportListStore } from '../store/useIndividualReportListStore'

const PAGE_SIZE = 20

const STATUS_LABEL: Record<string, string> = {
  PENDING: '대기중',
  COMPLETED: '완료',
  FAILED: '실패',
}


function formatDateTime(value: string | null): string {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

interface IndividualReportTableProps {
  headerActions?: ReactNode
}

function IndividualReportTable({ headerActions }: IndividualReportTableProps) {
  const navigate = useNavigate()
  const list = useIndividualReportListStore((s) => s.list)
  const isLoading = useIndividualReportListStore((s) => s.isLoading)
  const error = useIndividualReportListStore((s) => s.error)
  const { fetchList } = useIndividualReportListStore((s) => s.actions)

  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchList(0, 100)
  }, [fetchList])

  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE))
  const pagedList = list.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const rangeStart = list.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, list.length)

  return (
    <section>
      <div className="report-table__header">
        <div>
          <h1 className="report-table__title">
            개별 리포트 <span className="report-table__title-en">(Individual Report)</span>
          </h1>
          <p className="report-table__subtitle">
            Review detailed inspection reports for individual battery cells across all production lines.
          </p>
        </div>
        {headerActions}
      </div>

      <div className="report-table__card">
        {isLoading && <p className="report-table__status">로딩 중...</p>}
        {error && <p className="report-table__status report-table__status--error">{error}</p>}

        <table className="report-table__table">
          <colgroup>
            <col className="individual-report-table__col-status" />
            <col className="individual-report-table__col-title" />
            <col className="individual-report-table__col-created" />
            <col className="individual-report-table__col-detail" />
          </colgroup>
          <thead>
            <tr>
              <th>상태</th>
              <th>제목</th>
              <th>생성일시</th>
              <th>상세</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading && list.length === 0 && (
              <tr>
                <td colSpan={4} className="report-table__empty">
                  등록된 리포트가 없습니다.
                </td>
              </tr>
            )}
            {pagedList.map((item) => (
              <tr key={item.reportId} onClick={() => navigate(ROUTES.REPORT_INDIVIDUAL_DETAIL(item.reportId))} style={{ cursor: 'pointer' }}>
                <td>
                  <span className="report-table__status-cell">
                    <span className="report-table__status-icon">
                      {item.status === 'FAILED' && (
                        <span className="report-table__dot report-table__dot--failed" />
                      )}
                      {item.status === 'COMPLETED' && (
                        <span className="report-table__dot report-table__dot--completed" />
                      )}
                      {item.status === 'PENDING' && (
                        <span className="report-table__dot report-table__dot--pending" />
                      )}
                    </span>
                    {STATUS_LABEL[item.status] ?? item.status}
                  </span>
                </td>
                <td>{item.title ?? `리포트 #${item.reportId}`}</td>
                <td className="report-table__created">{formatDateTime(item.createdAt)}</td>
                <td>
                  <DetailLinkButton to={ROUTES.REPORT_INDIVIDUAL_DETAIL(item.reportId)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="report-table__footer">
          <span className="report-table__footer-text">
            Showing {rangeStart} to {rangeEnd} of {list.length} entries
          </span>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>
    </section>
  )
}

export default IndividualReportTable
