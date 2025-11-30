'use client'

import { usePathname } from 'next/navigation'
import { getPageMeta } from '@/lib/getPageMeta'

export function usePageMeta() {
  const pathname = usePathname() || '/'
  return getPageMeta(pathname)
}
