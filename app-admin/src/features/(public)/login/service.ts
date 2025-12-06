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

export async function getCurrentUser() {
  const sb = await supabase()
  const { data, error } = await sb.auth.getUser()

  // 세션 없으면 user가 null 이라서 여기서 로그인 안 된 상태로 간주
  if (error || !data.user) return null
  return data.user
}
