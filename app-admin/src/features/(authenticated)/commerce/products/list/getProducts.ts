import type { paginationOptions } from '@/types/PaginationOptions'
import { PRODUCTS_TABLE } from '@/types/db'
import { queryOptions } from '@tanstack/react-query'
import { getProductsService } from '@/features/(authenticated)/commerce/products/list/getProducts.service'

export const getProducts = (
  params: paginationOptions<PRODUCTS_TABLE['Row'] & { final_price: number }>,
) =>
  queryOptions({
    queryKey: ['products', params.page, params.size, params.keyword, params.order, params.orderBy],
    queryFn: () => getProductsService(params),
    retry: 2,
  })
