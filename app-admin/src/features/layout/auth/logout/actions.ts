'use server'

import { redirect } from 'next/navigation'
import { supabase } from '@/utils/supabase/supabase'
import { ROUTES } from '@/constants/routes'

export async function logoutAction() {
  const sb = await supabase()
  await sb.auth.signOut()
  redirect(ROUTES.LOGIN)
}
