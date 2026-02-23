'use client'

import React, { useMemo, useState } from 'react'
import { AlertCircle, Plus } from 'lucide-react'
import Modal from '@/components/modal/Modal'
import AppButton from '@/components/ui/AppButton'
import clsx from 'clsx'
import { useCreateUserMemo } from '@/features/(authenticated)/commerce/users/hooks/useCraeteUserMemo'
import Checkbox from '@/components/ui/Checkbox'
import { toast } from 'react-toastify'

const maxLen = 150

export default function UserMemoCreateButton({
  adminId,
  userId,
}: {
  adminId: string
  userId: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [memo, setMemo] = useState('')
  const count = memo.length
  const isValid = useMemo(() => memo.trim().length > 0, [memo])
  const { mutate, isPending } = useCreateUserMemo(adminId, userId)

  return (
    <>
      <Plus
        className="cursor-pointer hover:opacity-80 rounded-full hover:bg-indigo-200 p-1 size-6"
        role="button"
        onClick={() => setIsOpen(true)}
      />
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        headerTitle="메모 작성"
        subHeaderTitle="이 사용자에 대한 메모를 작성합니다"
      >
        <main className="space-y-3">
          {/* 입력 카드 */}
          <section className="mt-3 rounded border border-gray-200 p-4 dark:border-gray-800 dark:bg-gray-950">
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="user-memo"
                  className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  내용
                </label>

                <span className="text-xs text-gray-500">
                  {count} / {maxLen}
                </span>
              </div>

              <div className="mt-3">
                <textarea
                  id="user-memo"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value.slice(0, maxLen))}
                  placeholder="예: 2/14 전화, 주소 변경 요청 / 배송지 확인 필요"
                  className={clsx(
                    'min-h-36 w-full resize-none border bg-white px-3 py-2 text-sm',
                    'border-gray-200 text-gray-900 placeholder:text-gray-400',
                    'rounded ring-0 outline-none',
                    'focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200',
                    'dark:border-gray-800 dark:bg-black dark:text-gray-100 dark:placeholder:text-gray-600',
                    'dark:focus:border-indigo-500/60 dark:focus:ring-indigo-500/20',
                  )}
                />
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-start gap-2">
                <Checkbox
                  checked={isVisible}
                  onCheckedChange={setIsVisible}
                  labelClassName="w-29"
                  mention={`공개 여부 - ${isVisible ? '공개' : '비공개'}`}
                />
              </div>
            </div>
          </section>

          <div className="rounded border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p className="leading-relaxed">
                민감정보( 주민번호 / 계좌 / 상세주소 등 )는 기록 금지
              </p>
            </div>
          </div>
        </main>

        <footer className="mt-4 flex items-center justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
          <AppButton variant="cancel" type="button" onClick={() => setIsOpen(false)}>
            취소
          </AppButton>
          <AppButton
            variant="add"
            type="button"
            disabled={!isValid || isPending}
            onClick={() => {
              const trimmed = memo.trim()
              if (!trimmed) return

              mutate(
                { memo: trimmed, visibility: isVisible ? 'public' : 'private' },
                {
                  onSuccess: () => {
                    setIsOpen(false)
                    setIsVisible(true)
                    setMemo('')
                  },
                  onError: (e) => {
                    toast.error(`에러 발생: ${e.message}`, { toastId: 'createUserMemoError' })
                  },
                },
              )
            }}
          >
            {isPending ? '작성 중…' : '작성'}
          </AppButton>
        </footer>
      </Modal>
    </>
  )
}
