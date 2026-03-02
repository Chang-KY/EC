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

  couponProducts: () => [...couponKeys.all, 'coupon-products'] as const,
  couponProduct: (keyword: string) => [...couponKeys.couponProducts(), keyword] as const,

  couponCategories: () => [...couponKeys.all, 'coupon-categories'] as const,
  categoryRoots: (keyword = '') => [...couponKeys.couponCategories(), 'root', keyword] as const,

  categoryChildren: (parentId: number | string, keyword = '') =>
    [...couponKeys.couponCategories(), 'children', parentId, keyword] as const,
} as const
