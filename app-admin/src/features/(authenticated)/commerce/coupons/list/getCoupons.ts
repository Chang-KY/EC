import type { paginationOptions } from '@/types/PaginationOptions'
import { COUPONS_TABLE } from '@/types/db'
import { queryOptions } from '@tanstack/react-query'
import { couponKeys } from '@/features/(authenticated)/commerce/coupons/queryKey'
import { getCouponsService } from '@/features/(authenticated)/commerce/coupons/list/getCoupons.service'

export const getCoupons = (params: paginationOptions<COUPONS_TABLE['Row']>) =>
  queryOptions({
    queryKey: couponKeys.list(params),
    queryFn: () => getCouponsService(params),
    retry: 2,
  })
