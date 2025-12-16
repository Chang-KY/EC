'use server'

import { supabase } from '@/utils/supabase/supabase'

export async function getAdminDetail(id: string) {
  const sb = await supabase()

  const { data, error } = await sb
    .schema('ec')
    .from('admins')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data
}
