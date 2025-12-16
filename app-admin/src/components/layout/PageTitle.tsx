import React from 'react'
import { getPageMeta } from '@/lib/getPageMeta'

export default async function PageTitle({
  pathName,
  children,
}: {
  pathName: string
  children?: React.ReactNode
}) {
  const { title, subtitle } = getPageMeta(pathName)
  return (
    <div className="flex h-28 items-center justify-between px-20 leading-none">
      <div className="flex flex-col gap-3">
        <h1 className="leading-tight font-semibold text-black dark:text-gray-50">{title}</h1>
        {subtitle && <p className="text-xs text-gray-700 dark:text-gray-400">- [ {subtitle} ]</p>}
      </div>
      {/* 이곳은 다른 버튼들 혹은 여러 요소들이 들어오는 장소입니다. */}
      <div className="flex">{children}</div>
    </div>
  )
}
