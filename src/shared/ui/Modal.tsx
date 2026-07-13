import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useModalAnimation } from '@/shared/hooks/useModalAnimation'
import './Modal.css'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

function Modal({ open, onClose, children, className = '' }: ModalProps) {
  const { mounted, visible } = useModalAnimation(open)

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!mounted) return null

  return createPortal(
    <div
      className="modal-overlay"
      data-visible={visible}
      onClick={onClose}
    >
      <div
        className={`modal-content${className ? ` ${className}` : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}

export { Modal }
