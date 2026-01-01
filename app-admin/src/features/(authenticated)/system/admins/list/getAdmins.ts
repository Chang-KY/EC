import type { paginationOptions } from '@/types/pagination'
import type { ADMINS_TABLE } from '@/types/db'
import { queryOptions } from '@tanstack/react-query'
import { getAdminsService } from '@/features/(authenticated)/system/admins/list/getAdmins.service'

export const getAdmins = (params: paginationOptions<ADMINS_TABLE['Row']>) =>
  queryOptions({
    queryKey: ['admins', params.page, params.size, params.keyword, params.order, params.orderBy],
    queryFn: () =>
      getAdminsService({
        page: params.page,
        size: params.size,
        keyword: params.keyword,
        order: params.order,
        orderBy: params.orderBy,
      }),
    retry: 2,
    staleTime: 300000,
  })
