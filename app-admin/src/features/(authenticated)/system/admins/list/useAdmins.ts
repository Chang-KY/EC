'use client'

import { useQuery } from '@tanstack/react-query'
import { getAdmins } from '@/features/(authenticated)/system/admins/list/getAdmins'
import type { paginationOptions } from '@/types/pagination'
import type { ADMINS_TABLE } from '@/types/db'

export function useAdmins(params: paginationOptions<ADMINS_TABLE['Row']>) {
  return useQuery(getAdmins(params))
}
