'use client'

import React from 'react'
import { usePathname } from 'next/navigation'

export default function Selected({
  children,
  currentPath,
}: {
  children: React.ReactNode
  currentPath: string
}) {
  const pathname = usePathname()

  const selected = isPathIncluded(pathname, currentPath)
  if (!selected) return children
  return (
    <div className="pointer-events-none relative z-10 size-full rounded-md bg-gray-200 font-semibold transition duration-200 ease-in-out dark:bg-gray-800">
      {children}
    </div>
  )
}

function isPathIncluded(pathname: string, currentPath: string) {
  if (!currentPath) return false
  if (currentPath === '/') return pathname === '/'
  return pathname === currentPath || pathname.startsWith(currentPath + '/')
}
