export function makeImageUrl(storagePath: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_PRODUCT_BUCKET!
  // 경로 깨짐 방지
  const clean = storagePath.replace(/^\/+/, '')
  return `${base}/storage/v1/object/public/${bucket}/${encodeURI(clean)}`
}
