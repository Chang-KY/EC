'use client'

import { useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export function useSetQuery() {
  const router = useRouter()
  const pathname = usePathname()

  const setQuery = useCallback(
    (
      patch: Record<string, string | number | null>,
      opts?: { replace?: boolean; scroll?: boolean },
    ) => {
      const sp = new URLSearchParams(window.location.search)

      for (const [k, v] of Object.entries(patch)) {
        if (v === null) sp.delete(k)
        else sp.set(k, String(v))
      }

      const qs = sp.toString()
      const url = qs ? `${pathname}?${qs}` : pathname
      const scroll = opts?.scroll ?? false

      if (opts?.replace === false) router.push(url, { scroll })
      else router.replace(url, { scroll })
    },
    [router, pathname],
  )

  return { setQuery }
}
