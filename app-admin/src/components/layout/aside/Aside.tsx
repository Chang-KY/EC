import React from 'react'
import Navigator from '@/components/layout/aside/Navigator'

const Aside = () => {
  return (
    <aside className="hidden lg:fixed lg:top-10 lg:bottom-0 lg:z-50 lg:flex lg:flex-col">
      <div className="relative flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-800 bg-black">
        <Navigator />
      </div>
    </aside>
  )
}

export default Aside
