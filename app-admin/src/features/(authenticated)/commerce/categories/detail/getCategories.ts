'use server'

import { supabase } from '@/utils/supabase/supabase'
import { CATEGORIES_TABLE_VIEW } from '@/types/db'

export async function getCategoryDetail(id: number) {
  const sb = await supabase()
  const { data, error } = await sb
    .schema('ec')
    .from('categories_with_breadcrumb')
    .select('*')
    .eq('id', id)
    .maybeSingle()
    .overrideTypes<CATEGORIES_TABLE_VIEW, { merge: false }>()

  if (error) throw new Error(error.message)
  if (!data) return null

  return data
}
