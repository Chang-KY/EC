'use server'

import { ROUTES } from '@/constants/routes'
import { revalidatePath } from 'next/cache'
import { supabase } from '@/utils/supabase/supabase'
import {
  categoriesUpdateSchema,
  CategoryUpdateUpdateFormValue,
} from '@/features/(authenticated)/commerce/categories/update/schema'

async function updateCategory(categoryId?: number, patch?: CategoryUpdateUpdateFormValue) {
  if (!categoryId) return { ok: false as const, message: 'Invalid category ID' }
  if (!patch || Object.keys(patch).length === 0)
    return { ok: false as const, message: 'No fields to update' }

  const sb = await supabase()
  const { error } = await sb.schema('ec').from('categories').update(patch).eq('id', categoryId)
  if (error) return { ok: false as const, message: error.message }

  revalidatePath(`${ROUTES.CATEGORIES}/${categoryId}`)
  return { ok: true as const }
}

export async function categoryUpdateStatusAction(data: CategoryUpdateUpdateFormValue) {
  const { id: categoryId, selectable } = categoriesUpdateSchema.parse(data)
  return updateCategory(categoryId, { selectable })
}

export async function categoryUpdateNameAction(data: CategoryUpdateUpdateFormValue) {
  const { id: categoryId, name } = categoriesUpdateSchema.parse(data)
  return updateCategory(categoryId, { name })
}

export async function categoryUpdateSlugAction(data: CategoryUpdateUpdateFormValue) {
  const { id: categoryId, slug } = categoriesUpdateSchema.parse(data)
  return updateCategory(categoryId, { slug })
}