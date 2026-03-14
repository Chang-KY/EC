'use server'

import { supabase } from '@/utils/supabase/supabase'
import { isUuid } from '@/utils/isUuid'

export async function getAdminDetail(id: string) {
  if (!isUuid(id)) return null

  const sb = await supabase()

  const { data, error } = await sb
    .schema('ec')
    .from('admins')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!data) return null

  return data
}
