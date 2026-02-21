import { useQuery } from '@tanstack/react-query'
import { getUserMemoCount } from '@/features/(authenticated)/commerce/users/list/getUserMemoCount'
import { userMemoKeys } from '@/features/(authenticated)/commerce/users/queryKey'

export function useUserMemoCount(userId: string) {
  const key = userMemoKeys.count(userId)

  return useQuery({
    queryKey: key,
    queryFn: () => getUserMemoCount(userId),
    enabled: !!userId,
  })
}
