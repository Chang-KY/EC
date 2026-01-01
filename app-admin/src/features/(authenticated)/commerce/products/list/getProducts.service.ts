'use server'

import 'server-only'
import { supabase } from '@/utils/supabase/supabase'
import { ListParams, listParamsSchema } from '@/types/ListParams'

export async function getProductsService(params: ListParams) {
  const { page, size, keyword, order, orderBy } = listParamsSchema.parse(params)

  const sb = await supabase()
  const from = (page - 1) * size
  const to = from + size - 1

  let q = sb
    .schema('ec')
    .from('products')
    .select('*', { count: 'exact' })
    .range(from, to)
    .order(orderBy, { ascending: order === 'asc' })

  if (keyword.trim()) {
    const k = keyword.trim()
    q = q.or(`name.ilike.%${k}%,email.ilike.%${k}%`)
  }

  const { data, error, count } = await q
  if (error) {
    throw new Error(error.message)
  }

  return {
    items: data ?? [],
    total: count ?? 0,
    page,
    size,
  }
}
