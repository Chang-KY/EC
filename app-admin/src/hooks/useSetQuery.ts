'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useTransition } from 'react'

export function useSetQuery() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const setQuery = useCallback(
    (
      patch: Record<string, string | number | null>,
      opts?: { replace?: boolean; scroll?: boolean },
    ) => {
      const sp = new URLSearchParams(searchParams.toString())

      for (const [k, v] of Object.entries(patch)) {
        if (v === null) sp.delete(k)
        else sp.set(k, String(v))
      }

      const qs = sp.toString()
      const url = qs ? `${pathname}?${qs}` : pathname
      const scroll = opts?.scroll ?? false

      startTransition(() => {
        if (opts?.replace === false) router.push(url, { scroll })
        else router.replace(url, { scroll })
      })
    },
    [router, pathname, searchParams, startTransition],
  )

  return { setQuery }
}
