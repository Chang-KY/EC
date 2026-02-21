'use server'

import 'server-only'
import { supabase } from '@/utils/supabase/supabase'
import { ListParams, listParamsSchema } from '@/types/ListParams'
import { CATEGORIES_TABLE_VIEW, USERS_TABLE } from '@/types/db'

export async function getUsersService(params: ListParams) {
  const { page, size, keyword, order, orderBy } = listParamsSchema.parse(params)

  const sb = await supabase()
  const from = (page - 1) * size
  const to = from + size - 1

  let q = sb
    .schema('ec')
    .from('profiles')
    .select('*', { count: 'exact' })
    .range(from, to)
    .order(orderBy, { ascending: order === 'asc' })

  if (keyword.trim()) {
    const k = keyword.trim()
    q = q.or(`name.ilike.%${k}%`)
  }

  const { data, error, count } = await q.overrideTypes<USERS_TABLE['Row'][], { merge: false }>()

  if (error) throw new Error(error.message)

  return {
    items: data ?? [],
    total: count ?? 0,
    page,
    size,
  }
}
