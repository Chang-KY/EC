'use client'

import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { getCategoriesByParentDepth } from '@/features/(authenticated)/commerce/products/list/getCategoriesByParentDepth'

type Params = {
  parentId?: number | null
  depth: number
  enabled?: boolean
}

export function useCategoriesByParentDepth({ parentId, depth, enabled = true }: Params) {
  return useQuery({
    queryKey: ['categories', 'by-parent-depth', { parentId, depth }],
    queryFn: () => getCategoriesByParentDepth({ parentId, depth }),
    enabled,
    placeholderData: keepPreviousData,
  })
}
