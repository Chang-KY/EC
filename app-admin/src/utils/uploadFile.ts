import { supabase } from '@/utils/supabase/supabase'
import { sanitizeFileName } from '@/utils/sanitizeFileName'
import { getExt } from '@/utils/getExt'

export async function uploadFile(path: string, file: File, bucket: string) {
  const sb = await supabase()
  const ab = await file.arrayBuffer()
  const ext = getExt(file) ?? 'bin'
  const safeBase = sanitizeFileName(file.name)

  const { error } = await sb.storage
    .from(bucket)
    .upload(`${path}${safeBase}.${ext}`, Buffer.from(ab), {
      contentType: file.type,
      upsert: false,
    })
  if (error) throw new Error(error.message)
  return `${path}${safeBase}.${ext}`
}
