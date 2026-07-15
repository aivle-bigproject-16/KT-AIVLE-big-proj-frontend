import { Link } from 'react-router-dom'
import './DetailLinkButton.css'

function ChevronRightIcon() {
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

interface DetailLinkButtonProps {
  to: string
  ariaLabel?: string
}

function DetailLinkButton({ to, ariaLabel = '상세보기' }: DetailLinkButtonProps) {
  return (
    <Link to={to} aria-label={ariaLabel} className="detail-link-button">
      <ChevronRightIcon />
    </Link>
  )
}

export { DetailLinkButton }
