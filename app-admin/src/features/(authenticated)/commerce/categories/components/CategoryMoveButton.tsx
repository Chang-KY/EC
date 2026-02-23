'use client'

import React, { useState } from 'react'
import Modal from '@/components/modal/Modal'
import clsx from 'clsx'
import { FolderTree, Hash, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/constants/routes'
import AppButton from '@/components/ui/AppButton'

export default function CategoryMoveButton({
  children,
  categoryName,
  categoryId,
  disabled,
  className,
}: {
  categoryName: string
  categoryId: number
  children: React.ReactNode
  className: string
  disabled?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={clsx(
          'flex h-28 w-1/4 min-w-0 flex-col overflow-hidden rounded border',
          'hover:opacity-80',
          className,
        )}
      >
        {children}
      </button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        headerTitle="카테고리 페이지로 이동"
        subHeaderTitle="선택한 카테고리로 이동할지 확인해주세요."
      >
        <main className="py-4">
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            <div className="flex min-w-0 items-center gap-2">
              <FolderTree className="h-4 w-4 text-gray-600" />
              <p className="min-w-0 truncate text-sm font-medium text-gray-900">{categoryName}</p>
              <span className="ml-auto inline-flex items-center gap-1 rounded border border-gray-200 bg-white px-2 py-0.5 text-[11px] text-gray-600">
                <Hash className="h-3 w-3" />
                {categoryId}
              </span>
            </div>

            <div className="mt-2 text-xs text-gray-500">
              이동 경로:{' '}
              <code className="rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[11px] text-gray-700">
                {`${ROUTES.CATEGORIES}/${categoryId}`}
              </code>
            </div>
          </div>

          <p className="mt-3 text-sm text-gray-700">이 카테고리 페이지로 이동하시겠습니까?</p>
        </main>

        <footer className="flex items-center justify-end gap-2 border-t border-gray-100 pt-4">
          <AppButton variant="cancel" type="button" onClick={() => setIsOpen(false)}>
            취소
          </AppButton>
          <AppButton
            variant="confirm"
            type="button"
            onClick={() => {
              setIsOpen(false)
              router.push(`${ROUTES.CATEGORIES}/${categoryId}`)
            }}
          >
            이동
          </AppButton>
        </footer>
      </Modal>
    </>
  )
}
