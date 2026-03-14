'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { couponKeys } from '@/features/(authenticated)/commerce/coupons/queryKey'
import { getCategoriesForCoupon } from '@/features/(authenticated)/commerce/coupons/list/getCategoriesForCoupon'

type UseGetCategoriesForCouponParams = {
  keyword?: string
  enabled: boolean
}

export function useGetCategoriesForCoupon({
  keyword = '',
  enabled,
}: UseGetCategoriesForCouponParams) {
  const query = useQuery({
    queryKey: couponKeys.couponCategory(keyword),
    queryFn: () => getCategoriesForCoupon(),
    enabled,
  })

  const items = useMemo(() => {
    const all = query.data ?? []
    const q = keyword.trim().toLowerCase()

    if (!q) return all

    return all.filter((item) => {
      return (
        String(item.name).toLowerCase().includes(q) || String(item.slug).toLowerCase().includes(q)
      )
    })
  }, [query.data, keyword])

  return {
    ...query,
    items,
  }
}
