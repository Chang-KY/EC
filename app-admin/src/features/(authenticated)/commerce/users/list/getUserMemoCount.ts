'use server'
import { supabase } from '@/utils/supabase/supabase'
import { getAdminUser } from '@/lib/getAdminUser'

export async function getUserMemoCount(profileId: string) {
  const sb = await supabase()

  const { user: adminUser, error: authError } = await getAdminUser()
  if (authError) throw new Error(authError.message)
  if (!adminUser?.id) throw new Error('로그인 정보가 없습니다.')

  const { count, error } = await sb
    .schema('ec')
    .from('profile_memos')
    .select('id', { head: true, count: 'exact' })
    .eq('profile_id', profileId)
    .eq('is_deleted', false)
    .or(`visibility.eq.public,and(visibility.eq.private,admin_id.eq.${adminUser.id})`)

  if (error) throw new Error(error.message)
  return count ?? 0
}
