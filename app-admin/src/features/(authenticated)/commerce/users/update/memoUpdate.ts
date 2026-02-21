'use server'

import { MemoVisibility } from '@/types/enum'
import { supabase } from '@/utils/supabase/supabase'

export async function memoUpdate(input: {
  memoId: number
  memo?: string
  visibility?: MemoVisibility
}) {
  const { memoId, memo, visibility } = input
  const sb = await supabase()
  const now = new Date().toISOString()

  const patch: Record<string, string> = { updated_at: now }
  if (typeof memo === 'string') patch.memo = memo
  if (typeof visibility === 'string') patch.visibility = visibility

  if (!('memo' in patch) && !('visibility' in patch)) {
    throw new Error('Nothing to update')
  }

  const { data, error } = await sb
    .schema('ec')
    .from('profile_memos')
    .update(patch)
    .eq('id', memoId)
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return data
}
