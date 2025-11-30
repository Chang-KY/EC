'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { getPageMeta } from '@/lib/getPageMeta'
import { Icon, PlusIcon } from 'lucide-react'

const MainStatus = () => {
  const pathname = usePathname() || '/'
  const { title, subtitle } = getPageMeta(pathname)
  return (
    <div className="h-full w-64 border-r border-gray-800">
      <div className="space-y-2 border-b border-gray-800 px-3 py-2.5">
        <h1 className="text-lg leading-tight font-semibold text-gray-50">{title}</h1>

        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>

      {/* 오른쪽 액션 영역 (페이지마다 다르게 써도 됨) */}
      <div className="flex items-center gap-2">
        {/* 쿠폰 페이지 예시: “새 쿠폰” 버튼 */}
        {pathname.startsWith('/admin/coupons') && (
          <button className="inline-flex items-center gap-1 rounded-md bg-emerald-500 px-3 py-1.5 text-xs font-medium text-black hover:bg-emerald-400">
            <PlusIcon className="size-3.5" />새 쿠폰
          </button>
        )}
      </div>
    </div>
  )
}

export default MainStatus
