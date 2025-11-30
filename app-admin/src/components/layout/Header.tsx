import React from 'react'
import { Bell } from 'lucide-react'
import Image from 'next/image'
import Breadcrumb from '@/components/ui/Breadcrumb'

const Header = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-10 items-center justify-between border-b border-gray-800 bg-black/90 text-white backdrop-blur">
      <div className="flex min-w-0 items-center">
        <Image
          src="/ec-logo.svg"
          alt="EC Admin"
          width={200}
          height={40}
          priority
          className="max-h-10 w-[100px] filter dark:invert"
        />
      </div>

      <div className="flex items-center gap-4 px-5">
        <Breadcrumb />

        <button className="hidden rounded-full p-2 hover:bg-white/5 sm:inline-flex">
          <Bell className="size-4" />
        </button>

        <button
          type="button"
          className="flex size-6 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-xs shadow-md hover:brightness-110"
        >
          <span className="sr-only">Your profile</span>
          AD
        </button>
      </div>
    </header>
  )
}

export default Header
