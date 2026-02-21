'use client'

import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query'
import { memoCreate } from '@/features/(authenticated)/commerce/users/create/memoCreate'
import { USERS_MEMO_TABLE } from '@/types/db'
import { MemoVisibility } from '@/types/enum'
import { userMemoKeys } from '@/features/(authenticated)/commerce/users/queryKey'

type Row = USERS_MEMO_TABLE['Row']
type MemoPage = {
  items: Row[]
  nextCursor: string | null
}

export function useCreateUserMemo(adminId: string, userId: string) {
  const qc = useQueryClient()
  const key = userMemoKeys.list(userId)
  const countKey = userMemoKeys.count(userId)

  return useMutation({
    mutationFn: (payload: { memo: string; visibility: MemoVisibility }) =>
      memoCreate({ adminId, userId, ...payload }),

    onMutate: async (variables) => {
      await qc.cancelQueries({ queryKey: key })

      const prev = qc.getQueryData<Row[]>(key)

      const optimisticId = -Date.now()
      const draft: Row = {
        id: optimisticId,
        profile_id: userId,
        admin_id: adminId,
        memo: variables.memo,
        visibility: variables.visibility,
        created_at: new Date().toISOString(),
        updated_at: null,
        is_deleted: false,
        deleted_at: null,
        deleted_by: null,
      }

      qc.setQueryData<InfiniteData<MemoPage>>(key, (old) => {
        // 캐시가 비어있던 경우
        if (!old) {
          return {
            pages: [{ items: [draft], nextCursor: null }],
            pageParams: [null],
          }
        }

        const first = old.pages[0] ?? { items: [], nextCursor: null }
        const newFirst: MemoPage = {
          ...first,
          items: [draft, ...(first.items ?? [])],
        }

        return {
          ...old,
          pages: [newFirst, ...old.pages.slice(1)],
        }
      })

      qc.setQueryData<number>(countKey, (old) => (old ?? 0) + 1)

      return { prev, optimisticId }
    },

    onError: (_err, _vars, ctx) => {
      console.log(_err)
      if (ctx?.prev) qc.setQueryData(key, ctx.prev)
    },

    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: key })
      await qc.invalidateQueries({ queryKey: countKey })
    },
  })
}
