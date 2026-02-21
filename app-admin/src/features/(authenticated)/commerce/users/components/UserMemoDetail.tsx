'use client'

import { useUserMemo } from '@/features/(authenticated)/commerce/users/hooks/useUserMemo'
import clsx from 'clsx'
import Modal from '@/components/modal/Modal'
import { dateTimeFormat } from '@/utils/DateTimeFormat'
import Button from '@/components/ui/Button'
import React, { useState } from 'react'
import { useDeleteUserMemo } from '@/features/(authenticated)/commerce/users/hooks/useDeleteUserMemo'
import { toast } from 'react-toastify'
import Loading from '@/components/loading/Loading'
import { PRIVATE, PUBLIC } from '@/constants/booleanColor'
import { Check, Pencil, Undo2 } from 'lucide-react'
import { useUpdateUserMemo } from '@/features/(authenticated)/commerce/users/hooks/useUpdateUserMemo'
import MetaChip from '@/components/ui/MetaChip'
import InfoRowSelectUpdate from '@/components/ui/InfoRowSelectUpdate'
import { UpdateAction } from '@/components/ui/InfoRowInputUpdate'
import { MemoVisibility } from '@/types/enum'

export default function UserMemoModal({
  memoId,
  userId,
  adminId,
  isOpen,
  onClose,
}: {
  memoId: number
  userId: string
  adminId: string
  isOpen: boolean
  onClose: () => void
}) {
  const [isEditMemo, setIsEditMemo] = useState(false)
  const { data: memo, isLoading, isError, error } = useUserMemo(memoId, isOpen)
  const { mutate: deleteMemo, isPending: deleteIsPending } = useDeleteUserMemo(
    memoId,
    userId,
    adminId,
  )
  const [memoText, setMemoText] = useState('')
  const { mutate: updateMemo, isPending: updateIsPending } = useUpdateUserMemo(memoId, userId)

  const action: UpdateAction<number> = async (payload) => {
    try {
      updateMemo({ visibility: payload.visibility as MemoVisibility })
      return { ok: true }
    } catch (e) {
      return { ok: false, message: e instanceof Error ? e.message : '업데이트 실패' }
    }
  }

  return (
    <Modal
      headerTitle="메모"
      subHeaderTitle="이 사용자에 대한 메모"
      isOpen={isOpen}
      onClose={onClose}
    >
      <main className="relative min-h-[95px] space-y-3">
        {updateIsPending && (
          <div className="absolute inset-0 flex min-h-[170px] items-center justify-center rounded border border-gray-200 p-4 text-sm text-gray-500 dark:border-gray-800">
            <Loading mention="수정 중..." />
          </div>
        )}
        {/* 상태 */}
        {isLoading && (
          <div className="flex min-h-[170px] items-center justify-center rounded border border-gray-200 p-4 text-sm text-gray-500 dark:border-gray-800">
            <Loading mention="불러오는 중..." />
          </div>
        )}

        {isError && (
          <div className="rounded border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200">
            {error instanceof Error ? error.message : '메모 조회 실패'}
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && !memo && (
          <div className="rounded border border-gray-200 p-6 text-center text-sm text-gray-500 dark:border-gray-800">
            메모 없음
          </div>
        )}

        {/* List */}
        {!isLoading && !isError && memo && (
          <div className="relative flex min-h-[170px] flex-col justify-between rounded border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-black">
            {isEditMemo ? (
              <div className="relative">
                <textarea
                  id="user-memo-edit"
                  defaultValue={memo?.memo ?? ''}
                  maxLength={150}
                  onChange={(e) => setMemoText(e.target.value.slice(0, 150))}
                  placeholder="예: 2/14 전화, 주소 변경 요청 / 배송지 확인 필요"
                  className={clsx(
                    'min-h-22 w-full resize-none bg-white text-sm',
                    'text-gray-900 placeholder:text-gray-400',
                    'rounded ring-0 outline-none',
                    'focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200',
                    'dark:bg-black dark:text-gray-100 dark:placeholder:text-gray-600',
                    'dark:focus:border-indigo-500/60 dark:focus:ring-indigo-500/20',
                  )}
                />
                <span className="absolute right-1 bottom-1 text-[10px]">
                  {memoText.length} / 150
                </span>
              </div>
            ) : (
              <p className="text-sm break-words whitespace-pre-wrap text-gray-900 dark:text-gray-100">
                {memo.memo}
              </p>
            )}
            {isEditMemo && (
              <span
                role="button"
                onClick={() => {
                  updateMemo({ memo: memoText })
                  setIsEditMemo(false)
                  toast.info('변경이 완료되었습니다.', { toastId: 'updateMemo' })
                }}
                className="absolute bottom-4 left-9.5 flex size-5.5 cursor-pointer items-center justify-center rounded-full p-1 hover:bg-indigo-200"
              >
                <Check className="size-4" />
              </span>
            )}
            <span
              role="button"
              onClick={() => setIsEditMemo(!isEditMemo)}
              className="absolute bottom-4 left-2.5 flex size-5.5 cursor-pointer items-center justify-center rounded-full p-1 hover:bg-indigo-200"
            >
              {isEditMemo ? <Undo2 className="size-4" /> : <Pencil className="size-4" />}
            </span>

            <div className="mt-2 flex flex-wrap items-center justify-end gap-2 text-xs text-gray-500">
              <MetaChip
                label={memo.visibility === 'private' ? '비공개' : '공개'}
                className={memo.visibility === 'private' ? PUBLIC : PRIVATE}
                menuElement={[
                  {
                    id: 'visibility:public',
                    element: (
                      <InfoRowSelectUpdate<number>
                        id={memoId}
                        field="visibility"
                        label="공개"
                        disabled={memo.visibility === 'public'}
                        value="public"
                        action={action}
                      />
                    ),
                  },
                  {
                    id: 'visibility:private',
                    element: (
                      <InfoRowSelectUpdate<number>
                        id={memoId}
                        field="visibility"
                        label="비공개"
                        disabled={memo.visibility === 'private'}
                        value="private"
                        action={action}
                      />
                    ),
                  },
                ]}
              />

              <span className="text-gray-300 dark:text-gray-700">•</span>

              <span>{dateTimeFormat(memo.created_at, 'datetime')}</span>
            </div>
          </div>
        )}
      </main>
      <footer className="mt-4 flex items-center justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
        <Button
          variant="cancel"
          type="button"
          onClick={() => {
            onClose()
            setIsEditMemo(false)
          }}
        >
          취소
        </Button>
        <Button
          variant="delete"
          type="button"
          disabled={!memo || deleteIsPending}
          onClick={() => {
            if (!memo) return
            deleteMemo(undefined, {
              onSuccess: () => {
                onClose()
                toast.info('삭제 되었습니다.')
              },
              onError: (e) => {
                toast.error(`에러 발생: ${e.message}`)
              },
            })
          }}
        >
          {deleteIsPending ? '삭제 중…' : '삭제'}
        </Button>
      </footer>
    </Modal>
  )
}
