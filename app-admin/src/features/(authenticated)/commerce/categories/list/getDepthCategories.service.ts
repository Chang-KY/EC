'use server'

import 'server-only'
import { supabase } from '@/utils/supabase/supabase'

export async function getDepthCategoriesService(parentId: number | null, depth: 1 | 2) {
  const sb = await supabase()

  let q = sb.schema('ec').from('categories').select('*').eq('depth', depth)

  q = parentId == null ? q.is('parent_id', null) : q.eq('parent_id', parentId)

  const { data, error } = await q

  if (error) throw error
  return { data: data ?? [] }
}
