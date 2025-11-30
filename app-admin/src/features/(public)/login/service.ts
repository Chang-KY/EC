import { supabaseServer } from '@/utils/supabase/server'

export async function loginWithEmailPassword(email: string, password: string) {
  const supabase = await supabaseServer()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw error
  }
}

export async function signOut() {
  const supabase = await supabaseServer()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const supabase = await supabaseServer()
  const { data, error } = await supabase.auth.getUser()

  // 세션 없으면 user가 null 이라서 여기서 로그인 안 된 상태로 간주
  if (error || !data.user) return null
  return data.user
}
