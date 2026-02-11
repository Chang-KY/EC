'use server'

import 'server-only'
import { supabase } from '@/utils/supabase/supabase'
import { DepthCategoryTypes } from '@/features/(authenticated)/commerce/categories/types/DepthCategoryTypes'

export async function getDepthCategoriesService(params: DepthCategoryTypes) {
  const { parentId, depth, limit, cursor } = params
  const sb = await supabase()

  let q = sb
    .schema('ec')
    .from('categories')
    .select('*')
    .eq('depth', depth)
    .order('id', { ascending: true })
    .limit(limit)

  q = parentId == null ? q.is('parent_id', null) : q.eq('parent_id', parentId)

  // keyset pagination
  if (cursor != null) q = q.gt('id', cursor)

  const { data, error } = await q
  if (error) throw error

  const rows = data ?? []
  const nextCursor = rows.length === limit ? rows[rows.length - 1].id : null

  return { data: rows, nextCursor }
}
