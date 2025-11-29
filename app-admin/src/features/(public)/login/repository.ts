import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 서버에서만 돌리는 Supabase 클라이언트라면 별도 util로 뺄 수도 있음
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function findUserByEmail(email: string) {
  const { data, error } = await supabase
    .from('users') // 실제 테이블명으로 수정
    .select('*')
    .eq('email', email)
    .maybeSingle()

  if (error) throw error
  return data // 없으면 null
}
