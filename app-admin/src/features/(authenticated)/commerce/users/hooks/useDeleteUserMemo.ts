'use client'

import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query'
import type { USERS_MEMO_TABLE } from '@/types/db'
import { memoDelete } from '@/features/(authenticated)/commerce/users/delete/memoDelete'
import { userMemoKeys } from '@/features/(authenticated)/commerce/users/queryKey'

type Row = USERS_MEMO_TABLE['Row']
type MemoPage = {
  items: Row[]
  nextCursor: string | null
}

export function useDeleteUserMemo(memoId: number, userId: string, adminId: string) {
  const qc = useQueryClient()
  const key = userMemoKeys.list(userId)
  const countKey = userMemoKeys.count(userId)

  return useMutation({
    mutationFn: () => memoDelete(memoId, adminId),

    onMutate: async () => {
      await qc.cancelQueries({ queryKey: key })

      const prev = qc.getQueryData<InfiniteData<MemoPage>>(key)
      const prevCount = qc.getQueryData<number>(countKey)

      qc.setQueryData<InfiniteData<MemoPage>>(key, (old) => {
        if (!old) return old

        const pages = old.pages.map((p) => ({
          ...p,
          items: (p.items ?? []).filter((m) => String(m.id) !== String(memoId)),
        }))

        return { ...old, pages }
      })

      qc.setQueryData<number>(countKey, (c) => Math.max(0, (c ?? 0) - 1))

      return { prev, prevCount }
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(key, ctx.prev)
      if (typeof ctx?.prevCount === 'number') qc.setQueryData(countKey, ctx.prevCount)
    },

    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: key })
      await qc.invalidateQueries({ queryKey: countKey })
    },
  })
}
