'use client'

import { useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { couponKeys } from '@/features/(authenticated)/commerce/coupons/queryKey'
import { getCategoriesRootPage } from '@/features/(authenticated)/commerce/coupons/list/getCategoryRootForCoupon'

type UseCategoryInfiniteParams = {
  keyword?: string
}

export function useGetCategoriesRootForCoupon({ keyword = '' }: UseCategoryInfiniteParams) {
  const query = useInfiniteQuery({
    queryKey: couponKeys.categoryRoots(keyword),
    queryFn: ({ pageParam }) =>
      getCategoriesRootPage({
        pageParam: pageParam as number,
        keyword,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  })

  const items = useMemo(() => {
    return query.data?.pages.flatMap((page) => page.items) ?? []
  }, [query.data])

  return {
    ...query,
    items,
  }
}
