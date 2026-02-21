'use server'

import { supabase } from '@/utils/supabase/supabase'
import { UserMemoInfinite } from '@/features/(authenticated)/commerce/users/type/UserMemoInfinite'
import { getAdminUser } from '@/lib/getAdminUser'

export async function getUserMemosPage(params: {
  userId: string
  cursor?: string | null
  limit?: number
}): Promise<UserMemoInfinite> {
  const { userId, cursor = null, limit = 20 } = params
  const sb = await supabase()

  const { user: adminUser, error: authError } = await getAdminUser()

  if (authError) throw new Error(authError.message)
  if (!adminUser?.id) throw new Error('로그인 정보가 없습니다.')

  let q = sb
    .schema('ec')
    .from('profile_memos')
    .select('*')
    .eq('profile_id', userId)
    .eq('is_deleted', false)
    .or(`visibility.eq.public,and(visibility.eq.private,admin_id.eq.${adminUser.id})`)
    .order('id', { ascending: false })
    .limit(limit)

  if (cursor) {
    q = q.lt('id', cursor)
  }

  const { data, error } = await q
  if (error) throw new Error(error.message)

  const items = data ?? []
  const nextCursor = items.length === limit ? String(items[items.length - 1].id) : null

  return { items, nextCursor }
}
