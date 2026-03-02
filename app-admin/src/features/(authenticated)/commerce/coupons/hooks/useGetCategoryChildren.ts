'use client'

import { useQuery } from '@tanstack/react-query'
import { getCategoryChildren } from '@/features/(authenticated)/commerce/coupons/list/getCategoryChildren'
import { couponKeys } from '@/features/(authenticated)/commerce/coupons/queryKey'

type UseGetCategoryChildrenParams = {
  parentId: number
  keyword?: string
  enabled?: boolean
}

export function useGetCategoryChildren({
  parentId,
  keyword = '',
  enabled = true,
}: UseGetCategoryChildrenParams) {
  return useQuery({
    queryKey: couponKeys.categoryChildren(parentId, keyword),
    queryFn: () => getCategoryChildren({ parentId, keyword }),
    enabled,
  })
}
