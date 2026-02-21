import { paginationOptions } from '@/types/PaginationOptions'
import { COUPONS_TABLE } from '@/types/db'

export const couponKeys = {
  all: ['coupon'] as const,

  lists: () => [...couponKeys.all, 'list'] as const,

  list: (p: paginationOptions<COUPONS_TABLE['Row']>) =>
    [
      ...couponKeys.lists(),
      p.page,
      p.size,
      p.keyword ?? '',
      p.order ?? '',
      p.orderBy ?? '',
    ] as const,

  details: () => [...couponKeys.all, 'detail'] as const,
  detail: (couponId: string | number) => [...couponKeys.details(), couponId] as const,
} as const
