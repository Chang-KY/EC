'use server'

import { supabase } from '@/utils/supabase/supabase'
import { CATEGORIES_TABLE } from '@/types/db'

export type CategoryListItem = CATEGORIES_TABLE['Row'] & {
  childCount: number
  hasChildren: boolean
}

export async function getCategoriesForCoupon(): Promise<CategoryListItem[]> {
  const sb = await supabase()

  const { data: categories, error } = await sb
    .schema('ec')
    .from('categories')
    .select('*')
    .order('path', { ascending: true })

  if (error) throw new Error(error.message)

  const allCategories = categories ?? []

  const childCountMap = new Map<number, number>()

  for (const category of allCategories) {
    childCountMap.set(category.id, 0)
  }

  for (const category of allCategories) {
    if (category.parent_id == null) continue

    childCountMap.set(category.parent_id, (childCountMap.get(category.parent_id) ?? 0) + 1)
  }

  const items: CategoryListItem[] = allCategories.map((category) => {
    const childCount = childCountMap.get(category.id) ?? 0

    return {
      ...category,
      childCount,
      hasChildren: childCount > 0,
    }
  })

  return items
}
