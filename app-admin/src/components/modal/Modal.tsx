'use client'

import React from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { iconButtonClassName } from '@/constants/iconButtonClassName'

export default function Modal({
  headerTitle,
  subHeaderTitle,
  children,
  isOpen,
  onClose,
  closeOnEsc = true,
  closeOnOutsideClick = true,
  custom = false,
  footerButton,
}: {
  headerTitle?: string
  subHeaderTitle?: string
  closeOnOutsideClick?: boolean
  children: React.ReactNode
  isOpen: boolean
  closeOnEsc?: boolean
  onClose?: () => void
  custom?: boolean
  footerButton?: readonly React.ReactNode[]
}) {
  React.useEffect(() => {
    if (!isOpen || !closeOnEsc) return

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.()
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, closeOnEsc, onClose])

  const container =
    typeof document !== 'undefined'
      ? (document.getElementById('modal-root') ?? document.body)
      : null

  if (!isOpen || !container) return null
  return createPortal(
    <div
      aria-hidden={!isOpen}
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      onMouseDown={(e) => {
        if (!closeOnOutsideClick) return
        // overlay 클릭만 닫기
        if (e.target === e.currentTarget) onClose?.()
      }}
    >
      <div
        className="absolute inset-0 bg-black/50 opacity-100 backdrop-blur-[1px] transition-opacity"
        aria-hidden
      />
      <div
        className="relative z-[1001] flex items-center justify-center"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {custom ? (
          children
        ) : (
          <div className="w-[min(560px,90vw)] rounded border border-gray-300 bg-white p-4 shadow">
            <header className="flex items-center justify-between gap-3 pb-2">
              <div className="min-w-0">
                <h2 className="text-base leading-0 font-semibold text-gray-900">{headerTitle}</h2>
              </div>
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className={iconButtonClassName}
                  aria-label="닫기"
                >
                  <X size={16} />
                </button>
              )}{' '}
            </header>
            <div className="mb-3 rounded border border-gray-200 bg-gray-50 px-3 py-2">
              <p className="text-xs text-gray-600">{subHeaderTitle}</p>
            </div>
            {children}
            {footerButton && (
              <footer className="mt-3 flex items-center justify-end gap-3">
                {footerButton.map((item) => item)}
              </footer>
            )}
          </div>
        )}
      </div>
    </div>,
    container,
  )
}
