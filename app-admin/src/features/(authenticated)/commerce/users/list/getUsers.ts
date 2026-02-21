import type { paginationOptions } from '@/types/PaginationOptions'
import {  USERS_TABLE } from '@/types/db'
import { queryOptions } from '@tanstack/react-query'
import { getUsersService } from '@/features/(authenticated)/commerce/users/list/getUsers.service'

export const getUsers = (params: paginationOptions<USERS_TABLE['Row']>) =>
  queryOptions({
    queryKey: ['users', params.page, params.size, params.keyword, params.order, params.orderBy],
    queryFn: () => getUsersService(params),
    retry: 2,
    staleTime: 300000,
  })
