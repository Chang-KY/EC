import { supabase } from '@/utils/supabase/supabase'

export async function loginWithEmailPassword(email: string, password: string) {
  const sb = await supabase()

  const { error } = await sb.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw error
  }
}

export async function signOut() {
  const sb = await supabase()
  const { error } = await sb.auth.signOut()
  if (error) throw error
}
