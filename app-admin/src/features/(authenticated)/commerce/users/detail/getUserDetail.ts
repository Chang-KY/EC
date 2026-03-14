'use server'

import { supabase } from '@/utils/supabase/supabase'
import { USERS_TABLE } from '@/types/db'
import { getAdminUser } from '@/lib/getAdminUser'
import { isUuid } from '@/utils/isUuid'

export async function getUserDetail(id: string) {
  const sb = await supabase()

  if (!isUuid(id)) return null
  const { user: adminUser, error: authError } = await getAdminUser()

  if (authError) throw new Error(authError.message)
  if (!adminUser?.id) throw new Error('로그인 정보가 없습니다.')

  const { data: profile, error: profileError } = await sb
    .schema('ec')
    .from('profiles')
    .select('id,email,name,avatar_url,phone,phone_verified,email_verified,bio,created_at')
    .eq('id', id)
    .maybeSingle()
    .overrideTypes<USERS_TABLE['Row'], { merge: false }>()

  if (profileError) throw new Error(profileError.message)
  if (!profile) return null

  const { count, error: countError } = await sb
    .schema('ec')
    .from('profile_memos')
    .select('id', { head: true, count: 'exact' })
    .eq('profile_id', id)
    .eq('is_deleted', false)
    .or(`visibility.eq.public,and(visibility.eq.private,admin_id.eq.${adminUser.id})`)

  if (countError) throw new Error(countError.message)

  return {
    ...profile,
    memo_count: count ?? 0,
  }
}
