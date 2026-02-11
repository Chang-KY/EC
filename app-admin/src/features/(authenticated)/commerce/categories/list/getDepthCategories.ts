import { infiniteQueryOptions } from '@tanstack/react-query'
import { getDepthCategoriesService } from '@/features/(authenticated)/commerce/categories/list/getDepthCategories.service'
import { DepthCategoryTypes } from '@/features/(authenticated)/commerce/categories/types/DepthCategoryTypes'

export const categoryInfiniteKeys = {
  all: ['categories'] as const,
  depthInfinite: (params: DepthCategoryTypes) =>
    [...categoryInfiniteKeys.all, 'depthInfinite', params] as const,
}

export const getDepthCategories = (params: {
  parentId: number | null
  depth: 1 | 2
  limit?: number
}) => {
  const limit = params.limit ?? 20

  return infiniteQueryOptions({
    queryKey: categoryInfiniteKeys.depthInfinite({parentId: params.parentId, depth: params.depth, limit}),
    initialPageParam: null as number | null,
    queryFn: ({ pageParam }) =>
      getDepthCategoriesService({
        parentId: params.parentId,
        depth: params.depth,
        limit,
        cursor: pageParam,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  })
}
