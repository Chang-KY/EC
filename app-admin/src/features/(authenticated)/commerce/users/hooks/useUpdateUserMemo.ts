'use client'

import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query'
import type { USERS_MEMO_TABLE } from '@/types/db'
import { userMemoKeys } from '@/features/(authenticated)/commerce/users/queryKey'
import { memoUpdate } from '@/features/(authenticated)/commerce/users/update/memoUpdate'
import { MemoVisibility } from '@/types/enum'

type Row = USERS_MEMO_TABLE['Row']
type MemoPage = {
  items: Row[]
  nextCursor: string | null
}

export function useUpdateUserMemo(memoId: number, userId: string) {
  const qc = useQueryClient()
  const listKey = userMemoKeys.list(userId)
  const detailKey = userMemoKeys.detail(memoId)

  return useMutation({
    mutationFn: ({ memo, visibility }: { memo?: string; visibility?: MemoVisibility }) =>
      memoUpdate({ memoId, memo, visibility }),

    onMutate: async (variables) => {
      await qc.cancelQueries({ queryKey: listKey })
      await qc.cancelQueries({ queryKey: detailKey })

      const prevList = qc.getQueryData<InfiniteData<MemoPage>>(listKey)
      const prevDetail = qc.getQueryData<Row | null>(detailKey)

      const now = new Date().toISOString()

      qc.setQueryData<InfiniteData<MemoPage>>(listKey, (old) => {
        if (!old) return old

        return {
          ...old,
          pages: old.pages.map((p) => ({
            ...p,
            items: (p.items ?? []).map((m) => {
              if (String(m.id) !== String(memoId)) return m
              return {
                ...m,
                ...(variables.memo !== undefined ? { memo: variables.memo } : {}),
                ...(variables.visibility !== undefined ? { visibility: variables.visibility } : {}),
                updated_at: now,
              }
            }),
          })),
        }
      })

      qc.setQueryData<Row | null>(detailKey, (old) => {
        if (!old) return old

        return {
          ...old,
          ...(variables.memo !== undefined ? { memo: variables.memo } : {}),
          ...(variables.visibility !== undefined ? { visibility: variables.visibility } : {}),
          updated_at: now,
        }
      })

      return { prevList, prevDetail, detailKey }
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prevList) qc.setQueryData(listKey, ctx.prevList)
      if (ctx?.detailKey) qc.setQueryData(ctx.detailKey, ctx.prevDetail ?? null)
    },

    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: listKey })
      await qc.invalidateQueries({ queryKey: detailKey })
    },
  })
}
