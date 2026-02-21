'use server'

import { MemoVisibility } from '@/types/enum'
import { supabase } from '@/utils/supabase/supabase'

export async function memoCreate(input: {
  userId: string
  adminId: string
  memo: string
  visibility: MemoVisibility
}) {
  const { userId, adminId, visibility, memo } = input
  const sb = await supabase()
  const { data, error } = await sb
    .schema('ec')
    .from('profile_memos')
    .insert({
      profile_id: userId,
      admin_id: adminId,
      memo,
      visibility,
    })
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return data
}
