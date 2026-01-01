import { supabase } from '@/utils/supabase/supabase'
import { sanitizeFileName } from '@/utils/sanitizeFileName'

export async function uploadFile(path: string, file: File, bucket: string) {
  const sb = await supabase()
  const ab = await file.arrayBuffer()
  const { error } = await sb.storage
    .from(bucket)
    .upload(`${path}${sanitizeFileName(file.name)}`, Buffer.from(ab), {
      contentType: file.type,
      upsert: false,
    })
  if (error) throw new Error(error.message)
  return path
}
