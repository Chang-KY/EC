// src/lib/env.ts
export const env = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  PRODUCT_BUCKET: process.env.NEXT_PUBLIC_PRODUCT_BUCKET ?? '',
} as const

export const isLocalSupabase = (() => {
  const u = env.SUPABASE_URL
  return u.includes('127.0.0.1') || u.includes('localhost')
})()
