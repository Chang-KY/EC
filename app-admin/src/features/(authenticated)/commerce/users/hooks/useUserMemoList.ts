import { useInfiniteQuery } from '@tanstack/react-query'
import { getUserMemosPage } from '@/features/(authenticated)/commerce/users/list/getUserMemos'
import { USERS_MEMO_TABLE } from '@/types/db'
import { userMemoKeys } from '@/features/(authenticated)/commerce/users/queryKey'

export function useUserMemosInfinite(userId: string, limit = 20) {
  const key = userMemoKeys.list(userId)

  const query = useInfiniteQuery({
    queryKey: key,
    queryFn: ({ pageParam }) =>
      getUserMemosPage({
        userId,
        cursor: pageParam ?? null,
        limit,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!userId,
  })

  const memos: USERS_MEMO_TABLE['Row'][] = query.data?.pages.flatMap((p) => p.items) ?? []

  return {
    ...query,
    memos,
  }
}
