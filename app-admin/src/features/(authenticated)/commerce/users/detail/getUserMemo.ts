'use server'

import { supabase } from '@/utils/supabase/supabase'
import type { USERS_MEMO_TABLE } from '@/types/db'

export async function getUserMemoAction(memoId: number) {
  const sb = await supabase()

  const { data, error } = await sb
    .schema('ec')
    .from('profile_memos')
    .select('*')
    .eq('id', memoId)
    .eq('is_deleted', false)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data as USERS_MEMO_TABLE['Row'] | null
}
