'use client'

import UserMemoCreateButton from '@/features/(authenticated)/commerce/users/components/UserMemoCreateButton'
import { useUserMemoCount } from '@/features/(authenticated)/commerce/users/hooks/useUserMemoCount'
import Loading from '@/components/loading/Loading'
import { useUserMemosInfinite } from '@/features/(authenticated)/commerce/users/hooks/useUserMemoList'
import { ExternalLink } from 'lucide-react'
import { USERS_MEMO_TABLE } from '@/types/db'
import clsx from 'clsx'
import { dateTimeFormat } from '@/utils/DateTimeFormat'
import { PRIVATE, PUBLIC } from '@/constants/booleanColor'
import React, { useState } from 'react'
import UserMemoModal from '@/features/(authenticated)/commerce/users/components/UserMemoDetail'

export default function UserMemo({ userId, adminId }: { userId: string; adminId: string }) {
  const { data: memoCount = 0, isLoading: isLoadingCount } = useUserMemoCount(userId)
  const { memos, isLoading: isLoadingMemo } = useUserMemosInfinite(userId)

  return (
    <div className="flex h-60 flex-col gap-4 overflow-y-auto rounded border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-black">
      <div className="absolute top-5 right-5 flex items-center justify-between gap-4">
        <span className="flex items-center gap-2 text-xs font-normal text-gray-500">
          메모 수: {isLoadingCount ? <Loading size={10} /> : `( ${memoCount} )`}
        </span>
        <UserMemoCreateButton userId={userId} adminId={adminId} />
      </div>
      <div className="flex flex-col gap-2">
        {isLoadingMemo ? (
          <div className="absolute top-[50%] left-[calc(50%-60px)]">
            <Loading mention="메모를 불러오고 있습니다." />
          </div>
        ) : memos.length === 0 ? (
          <p className="absolute top-1/2 left-[calc(50%-20px)] text-gray-500">메모 없음</p>
        ) : (
          memos.map((memo) => (
            <MemoItem key={memo.id} memo={memo} userId={userId} adminId={adminId} />
          ))
        )}
      </div>
    </div>
  )
}

function MemoItem({
  memo,
  userId,
  adminId,
}: {
  memo: USERS_MEMO_TABLE['Row']
  userId: string
  adminId: string
}) {
  const isPrivate = memo.visibility === 'private'
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="group rounded border border-gray-200 bg-white px-3 py-2 transition hover:border-gray-300 dark:border-gray-800 dark:bg-black dark:hover:border-gray-700">
        {/* 상단 메타 */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span
              className={clsx(
                'inline-flex items-center gap-1 rounded-full border px-2 text-[11px] font-medium',
                isPrivate ? PUBLIC : PRIVATE,
              )}
            >
              {isPrivate ? '비공개' : '공개'}
            </span>

            <span className="truncate text-[11px] text-gray-500">
              {dateTimeFormat(memo.created_at, 'date')}
              {memo.updated_at ? ` · 수정 ${dateTimeFormat(memo.updated_at, 'date')}` : ''}
            </span>
          </div>

          {/* 액션 (hover 시 노출) */}
          <div className="flex items-center justify-center gap-1 opacity-0 transition group-hover:opacity-100">
            <button
              type="button"
              className="rounded-md p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-700 dark:hover:bg-gray-900 dark:hover:text-gray-200"
              onClick={() => setIsOpen(true)}
            >
              <ExternalLink size={14} />
            </button>
          </div>
        </div>

        {/* 본문 */}
        <p className="mt-2 text-sm leading-relaxed break-words whitespace-pre-wrap text-gray-900 dark:text-gray-100">
          {memo.memo}
        </p>
      </div>
      <UserMemoModal
        memoId={memo.id}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        userId={userId}
        adminId={adminId}
      />
    </>
  )
}
