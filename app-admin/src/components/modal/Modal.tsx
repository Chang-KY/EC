'use client'

import React, { ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

export default function Modal({
  headerTitle,
  subHeaderTitle,
  children,
  isOpen,
  onClose,
  closeOnEsc = true,
  closeOnOutsideClick = true,
  custom = false,
}: {
  headerTitle: string
  subHeaderTitle: string
  closeOnOutsideClick?: boolean
  children: ReactNode
  isOpen: boolean
  closeOnEsc?: boolean
  onClose: () => void
  custom?: boolean
}) {
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
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
        if (e.target === e.currentTarget) onClose()
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
          <div className="w-[min(520px,90vw)] rounded-xl border border-gray-200 bg-white p-4 shadow-xl">
            <header className="flex items-center justify-between gap-3 pb-2">
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-gray-900">{headerTitle}</h2>
                <p className="mt-1 text-xs text-gray-500">{subHeaderTitle}</p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                aria-label="닫기"
              >
                <X className="size-4" />
              </button>
            </header>
            {children}
          </div>
        )}
      </div>
    </div>,
    container,
  )
}
