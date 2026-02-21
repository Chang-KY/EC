import { redirect } from 'next/navigation'
import { supabase } from '@/utils/supabase/supabase'
import { getAdminUser } from '@/lib/getAdminUser'

export async function requireRole(roles: Array<'admin' | 'super_admin'>) {
  const sb = await supabase()
  const { user: adminUser, error: authError } = await getAdminUser()

  const { data } = await sb
    .schema('ec')
    .from('profiles')
    .select('role, level')
    .eq('user_id', user.id)
    .single()

  if (!data || !roles.includes(data.role as any)) redirect('/forbidden')
  return { user, authz: data }
}
