'use client'

import { useQuery } from '@tanstack/react-query'
import { getUserMemoAction } from '@/features/(authenticated)/commerce/users/detail/getUserMemo'
import { userMemoKeys } from '@/features/(authenticated)/commerce/users/queryKey'

export function useUserMemo(memoId: number, enabled: boolean) {
  const key = userMemoKeys.detail(memoId)
  return useQuery({
    queryKey: key,
    queryFn: () => getUserMemoAction(memoId),
    enabled: enabled && memoId > 0,
  })
}
