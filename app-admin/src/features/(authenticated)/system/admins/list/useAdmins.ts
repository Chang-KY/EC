'use client'

import { useQuery } from '@tanstack/react-query'
import { paginationOptions } from '@/types/pagination'
import { ADMINS_TABLE } from '@/types/db'

export function useAdmins({
  page,
  size,
  keyword,
  order,
  orderBy,
}: paginationOptions<ADMINS_TABLE['Row']>) {
  return useQuery({
    queryKey: ['admins', page, size, keyword, order, orderBy],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        size: String(size),
        keyword,
        order,
        orderBy,
      })
      const res = await fetch(`/api/system/admins?${params.toString()}`, {
        credentials: 'include',
      })
      if (!res.ok) {
        throw new Error('Failed to fetch admins')
      }
      return res.json()
    },
    retry: 2,
  })
}
