'use client'

import { useQuery } from '@tanstack/react-query'
import { getCategorySubtree } from '@/features/(authenticated)/commerce/categories/detail/getCategorySubtree'

export function useCategorySubtree(categoryId: number) {
  const enabled = categoryId != null

  return useQuery({
    queryKey: enabled ? ['category-subtree', categoryId] : ['__pending__'],
    enabled,
    queryFn: async () => getCategorySubtree(categoryId),
  })
}
