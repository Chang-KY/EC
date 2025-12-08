import type { paginationOptions } from '@/types/pagination'
import type { ADMINS_TABLE } from '@/types/db'

export const getAdmins = (params: paginationOptions<ADMINS_TABLE['Row']>) => ({
  queryKey: ['admins', params.page, params.size, params.keyword, params.order, params.orderBy],
  queryFn: async () => {
    const searchParams = new URLSearchParams()

    searchParams.set('page', String(params.page))
    searchParams.set('size', String(params.size))

    const res = await fetch(`/api/system/admins?${searchParams.toString()}`, {
      credentials: 'include',
    })

    if (!res.ok) {
      throw new Error('Failed to fetch admins')
    }

    return res.json()
  },
  retry: 2,
})
