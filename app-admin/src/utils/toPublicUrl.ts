'use server'

import { supabase } from '@/utils/supabase/supabase'

export async function toPublicUrl({
  bucket,
  path,
}: {
  bucket?: string | null
  path?: string | null
}) {
  if (!path) return null
  if (!bucket) return null
  const sb = await supabase()
  const { data } = sb.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}
