'use client'

import React, { ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'

export default function Modal({
  children,
  isOpen,
  onClose,
  closeOnEsc = true,
  closeOnOutsideClick = true,
}: {
  closeOnOutsideClick?: boolean
  children: ReactNode
  isOpen: boolean
  closeOnEsc?: boolean
  onClose: () => void
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
        {children}
      </div>
    </div>,
    container,
  )
}
