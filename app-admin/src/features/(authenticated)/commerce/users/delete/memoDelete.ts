'use server'

import { supabase } from '@/utils/supabase/supabase'

export async function memoDelete(memoId: number, adminId: string) {
  const sb = await supabase()

  const now = new Date().toISOString()
  const { data, error } = await sb
    .schema('ec')
    .from('profile_memos')
    .update({
      is_deleted: true,
      deleted_at: now,
      deleted_by: adminId,
      updated_at: now,
    })
    .eq('id', memoId)
    .eq('is_deleted', false)
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return data
}
