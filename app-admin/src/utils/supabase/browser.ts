'use client'

import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/supabase.types'

let _sb: ReturnType<typeof createBrowserClient<Database>> | null = null

export function supabaseBrowser() {
  if (_sb) return _sb
  _sb = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      db: { schema: 'ec' },
      auth: { persistSession: true, autoRefreshToken: true },
    },
  )
  return _sb
}

export const supabase = supabaseBrowser()
