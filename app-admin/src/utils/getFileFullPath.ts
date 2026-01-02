export const getFileFullPath = (path: string) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const bucket = process.env.NEXT_PUBLIC_PRODUCT_BUCKET!

  const cleanPath = path.replace(/^\/+/, '') // 앞에 / 있으면 제거
  // console.log(`${supabaseUrl}/storage/v1/object/public/${bucket}/${cleanPath}`)
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${cleanPath}`
}
