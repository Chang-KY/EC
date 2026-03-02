'use server'

import { supabase } from '@/utils/supabase/supabase'
import { CATEGORIES_TABLE } from '@/types/db'
import { SCROLL_PAGE } from '@/constants/page/PAGE_SIZE_LIST'

export type CategoryListItem = CATEGORIES_TABLE['Row'] & {
  childCount: number
  hasChildren: boolean
}

type GetCategoriesRootPageParams = {
  pageParam?: number
  keyword?: string
}

type CategoriesRootPage = {
  items: CategoryListItem[]
  nextPage: number | undefined
}

export async function getCategoriesRootPage({
  pageParam = 0,
  keyword = '',
}: GetCategoriesRootPageParams): Promise<CategoriesRootPage> {
  const sb = await supabase()
  const from = pageParam * SCROLL_PAGE
  const to = from + SCROLL_PAGE - 1

  let query = sb
    .schema('ec')
    .from('categories')
    .select('*')
    .is('parent_id', null)
    .order('id', { ascending: true })
    .range(from, to)

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

  const items: CategoryListItem[] = (categories ?? []).map((category) => {
    const childCount = childCountMap.get(category.id) ?? 0

    return {
      ...category,
      childCount,
      hasChildren: childCount > 0,
    }
  })

  return {
    items,
    nextPage: items.length < SCROLL_PAGE ? undefined : pageParam + 1,
  }
}
