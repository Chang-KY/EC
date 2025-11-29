'use client'

import React from 'react'
import Navigator from '@/components/layout/aside/Navigator'

const Aside = () => {
  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      {/* 사이드 바 */}
      <div className="relative flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-800 bg-black px-6">
        <div className="relative flex h-16 shrink-0 items-center">
          <p className="font-bold text-black dark:text-white">EC</p>
        </div>
        <nav className="relative flex flex-1 flex-col">
          <Navigator />
        </nav>
      </div>
    </aside>
  )
}

export default Aside
