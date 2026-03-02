'use server'

import { supabase } from '@/utils/supabase/supabase'
import { CATEGORIES_TABLE } from '@/types/db'

export type CategoryChildItem = CATEGORIES_TABLE['Row'] & {
  childCount: number
  hasChildren: boolean
}

type GetCategoryChildrenParams = {
  parentId: number
  keyword?: string
}

export async function getCategoryChildren({
  parentId,
  keyword = '',
}: GetCategoryChildrenParams): Promise<CategoryChildItem[]> {
  const sb = await supabase()

  let query = sb
    .schema('ec')
    .from('categories')
    .select('*')
    .eq('parent_id', parentId)
    .order('id', { ascending: true })

  if (keyword.trim()) {
    query = query.ilike('name', `%${keyword.trim()}%`)
  }

  const { data: categories, error } = await query

  if (error) throw new Error(error.message)

  const ids = (categories ?? []).map((category) => category.id)
  const childCountMap = new Map<number, number>()

  for (const id of ids) {
    childCountMap.set(id, 0)
  }

  if (ids.length > 0) {
    const { data: children, error: childError } = await sb
      .schema('ec')
      .from('categories')
      .select('id,parent_id')
      .in('parent_id', ids)

    if (childError) throw new Error(childError.message)

    for (const child of children ?? []) {
      if (child.parent_id == null) continue
      childCountMap.set(child.parent_id, (childCountMap.get(child.parent_id) ?? 0) + 1)
    }
  }

  return (categories ?? []).map((category) => {
    const childCount = childCountMap.get(category.id) ?? 0

    return {
      ...category,
      childCount,
      hasChildren: childCount > 0,
    }
  })
}
