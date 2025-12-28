import type { paginationOptions } from '@/types/pagination'
import type { ADMINS_TABLE } from '@/types/db'
import { queryOptions } from '@tanstack/react-query'

export const getAdmins = (params: paginationOptions<ADMINS_TABLE['Row']>) =>
  queryOptions({
    queryKey: ['admins', params.page, params.size, params.keyword, params.order, params.orderBy],
    queryFn: async () => {
      const sp = new URLSearchParams()

      sp.set('page', String(params.page))
      sp.set('size', String(params.size))
      if (params.keyword) sp.set('keyword', params.keyword)
      if (params.order) sp.set('order', params.order)
      if (params.orderBy) sp.set('orderBy', params.orderBy)
      const res = await fetch(`/api/system/admins?${sp.toString()}`, {
        credentials: 'include',
      })
      if (!res.ok) {
        throw new Error('Failed to fetch admins')
      }
      return res.json()
    },
    retry: 2,
    staleTime: 300_000,
  })
