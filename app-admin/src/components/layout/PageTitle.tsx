import React from 'react'
import { getPageMeta } from '@/lib/getPageMeta'

const PageTitle = ({ pathName, children }: { pathName: string; children: React.ReactNode }) => {
  const { title, subtitle } = getPageMeta(pathName)

  return (
    <div className="flex items-center justify-between border-b border-gray-800 px-6 py-1.5">
      <div className="flex items-end gap-3">
        <h1 className="text-lg leading-tight font-semibold text-gray-50">{title}</h1>
        {subtitle && <p className="text-xs text-gray-400">[ {subtitle} ]</p>}
      </div>
      <div className="flex">{children}</div>
    </div>
  )
}

export default PageTitle
