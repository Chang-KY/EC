'use client'

import React from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getDepthCategories } from '@/features/(authenticated)/commerce/categories/list/getDepthCategories'

export default function CategoryList({
  parentId,
  depth,
}: {
  parentId: number | null
  depth: 1 | 2
}) {
  const { data, isFetching } = useQuery({
    ...getDepthCategories(parentId, depth),
    placeholderData: keepPreviousData,
  })

  return <div></div>
}
