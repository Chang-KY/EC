import { cache } from 'react'
import { supabase } from '@/utils/supabase/supabase'

export const getAdminUser = cache(async () => {
  const sb = await supabase()
  const { data, error } = await sb.auth.getUser()
  return { user: data?.user ?? null, error }
})
