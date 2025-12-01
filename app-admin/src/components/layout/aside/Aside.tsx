import React from 'react'
import Navigator from '@/components/layout/aside/Navigator'

const Aside = () => {
  return (
    <aside className="hidden md:fixed md:top-10 md:bottom-0 md:z-50 md:flex md:flex-col">
      <div className="relative flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-800 bg-black">
        <Navigator />
      </div>
    </aside>
  )
}

export default Aside
