import { redirect } from 'next/navigation'
import { supabase } from '@/utils/supabase/supabase'

export async function requireRole(roles: Array<'admin' | 'super_admin'>) {
  const sb = await supabase()
  const {
    data: { user },
  } = await sb.auth.getUser()
  if (!user) redirect('/signin')

  const { data } = await sb
    .schema('ec')
    .from('profiles')
    .select('role, level')
    .eq('user_id', user.id)
    .single()

  if (!data || !roles.includes(data.role as any)) redirect('/forbidden')
  return { user, authz: data }
}
