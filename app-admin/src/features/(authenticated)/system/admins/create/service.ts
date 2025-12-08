import type { AdminCreateFormValues } from './schema'
import { supabase } from '@/utils/supabase/supabase'
import { supabaseAdmin } from '@/utils/supabase/supabaseAdmin'

export async function createAdminWithAuth(values: AdminCreateFormValues) {
  const sb = await supabase()

  const { data: userResult, error: userError } = await supabaseAdmin.auth.admin.createUser({
    email: values.email,
    password: values.password,
    email_confirm: true,
    user_metadata: {
      name: values.name,
      phone: values.phone,
    },
  })

  if (userError || !userResult.user) {
    throw new Error(`Failed to create auth user: ${userError?.message ?? 'Unknown error'}`)
  }

  const userId = userResult.user.id

  try {
    const { error: adminError } = await sb
      .schema('ec')
      .from('admins')
      .insert({
        id: userId,
        email: values.email,
        name: values.name || null,
        avatar_url: null,
        phone: values.phone || null,
        status: values.status, // 'active' | 'suspended' | 'revoked'
        role: values.role, // 'admin' | 'manager' | 'viewer' 이거 3개만 추가 가능
        level: values.level, // 1 ~ 6
        last_login: null,
      })

    if (adminError) {
      throw new Error(`Failed to insert ec.admins: ${adminError.message}`)
    }
  } catch (e) {
    await supabaseAdmin.auth.admin.deleteUser(userId)
    throw e
  }
}
