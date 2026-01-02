import 'dotenv/config'
import { supabaseAdmin } from '@/utils/supabase/supabaseAdmin'

type EnsureBucketOptions = {
  public?: boolean
  fileSizeLimit?: string
  allowedMimeTypes?: string[]
}

function isNotFound(e: unknown) {
  const err = e as { status?: number; statusCode?: number; message?: string }
  const status = Number(err?.status ?? err?.statusCode ?? 0)
  const msg = String(err?.message ?? '').toLowerCase()
  return status === 404 || msg.includes('bucket not found') || msg.includes('no such bucket')
}

function isAlreadyExists(e: unknown) {
  const err = e as { status?: number; statusCode?: number; message?: string }
  const status = Number(err?.status ?? err?.statusCode ?? 0)
  const msg = String(err?.message ?? '').toLowerCase()
  return status === 409 || msg.includes('already exists') || msg.includes('duplicate')
}

async function ensureBucket(bucket: string, options: EnsureBucketOptions = {}) {
  const { data, error } = await supabaseAdmin.storage.getBucket(bucket)
  if (data) return { created: false, bucket: data }

  // "없음"이면 create로 진행
  if (error && !isNotFound(error)) {
    throw new Error(`getBucket failed: ${error.message}`)
  }

  const { data: created, error: createErr } = await supabaseAdmin.storage.createBucket(bucket, {
    public: options.public ?? false,
    fileSizeLimit: options.fileSizeLimit,
    allowedMimeTypes: options.allowedMimeTypes,
  })

  if (createErr) {
    // 동시 실행 시 이미 생성된 경우 방어
    if (isAlreadyExists(createErr)) return { created: false, bucket: null }
    throw new Error(`createBucket failed: ${createErr.message}`)
  }

  return { created: true, bucket: created }
}

async function main() {
  const res = await ensureBucket(process.env.NEXT_PUBLIC_PRODUCT_BUCKET!, {
    public: true,
    allowedMimeTypes: ['image/*'],
    fileSizeLimit: '10MB',
  })
  console.log(res.created ? 'bucket created' : 'bucket already exists')
}

main().catch((e) => {
  console.error('❌', e)
  process.exit(1)
})
