'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getPageMeta } from '@/lib/getPageMeta'

const Breadcrumb = () => {
  const pathname = usePathname() || '/'
  const { breadcrumb } = getPageMeta(pathname)

  return (
    <nav className="flex items-center text-[10px] text-gray-700 dark:text-gray-500">
      <ol className="flex flex-wrap items-center">
        {breadcrumb?.map((b, i) => {
          const isCurrent = b.ariaCurrent === 'page'

          return (
            <li key={i} className="flex items-center">
              {i !== 0 && <span className="mx-2 text-gray-600">/</span>}
              {isCurrent || !b.href ? (
                <span
                  aria-current={b.ariaCurrent}
                  className={isCurrent ? 'font-medium text-white' : undefined}
                >
                  {b.label}
                </span>
              ) : (
                <Link href={b.href} className="hover:underline">
                  {b.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumb
