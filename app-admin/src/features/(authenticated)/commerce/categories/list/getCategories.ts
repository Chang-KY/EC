import type { paginationOptions } from '@/types/PaginationOptions'
import { CATEGORIES_TABLE } from '@/types/db'
import { queryOptions } from '@tanstack/react-query'
import { getCategoriesService } from '@/features/(authenticated)/commerce/categories/list/getCategories.service'

export const getCategories = (params: paginationOptions<CATEGORIES_TABLE['Row']>) =>
  queryOptions({
    queryKey: [
      'categories',
      params.page,
      params.size,
      params.keyword,
      params.order,
      params.orderBy,
    ],
    queryFn: () => getCategoriesService(params),
    retry: 2,
    staleTime: 300000,
  })
