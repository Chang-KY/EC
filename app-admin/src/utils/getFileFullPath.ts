export const getFileFullPath = (path: string) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  // 앞에 / 있으면 제거
  const cleanPath = path.replace(/^\/+/, '')
  return `${supabaseUrl}/storage/v1/object/public/${cleanPath}`
}
