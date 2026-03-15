'use server'

import { supabase } from '@/utils/supabase/supabase'
import { CATEGORIES_TABLE } from '@/types/db'

type Params = {
  parentId?: number | null
  depth: number
}

export async function getCategoriesByParentDepth({
  parentId,
  depth,
}: Params): Promise<CATEGORIES_TABLE['Row'][]> {
  const sb = await supabase()

  let query = sb
    .schema('ec')
    .from('categories')
    .select('*')
    .eq('depth', depth)
    .order('path', { ascending: true })

  query = parentId == null ? query.is('parent_id', null) : query.eq('parent_id', parentId)

  const { data: categories, error } = await query

  if (error) throw new Error(error.message)

  return categories ?? []
}
