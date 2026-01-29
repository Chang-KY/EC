import { queryOptions } from '@tanstack/react-query'
import { getDepthCategoriesService } from '@/features/(authenticated)/commerce/categories/list/getDepthCategories.service'

export const getDepthCategories = (parentId: number | null, depth: 1 | 2) =>
  queryOptions({
    queryKey: ['categories', parentId ?? '', depth],
    queryFn: () => getDepthCategoriesService(parentId, depth),
  })
