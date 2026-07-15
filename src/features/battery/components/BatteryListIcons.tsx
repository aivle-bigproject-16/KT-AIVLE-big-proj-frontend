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

function WarningIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3.3 21.7 20.3H2.3L12 3.3Z"
        fill="#ffcc00"
        stroke="#e60012"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <rect x="11.1" y="9.2" width="1.8" height="6" rx="0.9" fill="#191c1d" />
      <circle cx="12" cy="17" r="1.15" fill="#191c1d" />
    </svg>
  )
}

export {
  DownloadIcon,
  FilterIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightSmallIcon,
  WarningIcon,
}
