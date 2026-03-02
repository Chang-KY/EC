'use client'

import { useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { getProductsPage } from '@/features/(authenticated)/commerce/coupons/list/getProductsForCoupon'
import { couponKeys } from '@/features/(authenticated)/commerce/coupons/queryKey'

type UseProductsInfiniteParams = {
  keyword?: string
}

export function useGetProductsForCoupon({ keyword = '' }: UseProductsInfiniteParams) {
  const query = useInfiniteQuery({
    queryKey: couponKeys.couponProduct(keyword),
    queryFn: ({ pageParam }) =>
      getProductsPage({
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
