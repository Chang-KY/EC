import React from 'react'
import { Bell } from 'lucide-react'
import Image from 'next/image'
import Breadcrumb from '@/components/ui/Breadcrumb'
import AsideMenuButton from '@/components/layout/header/AsideMenuButton'
import NotificationButton from '@/components/layout/header/NotificationButton'
import ProfileButton from '@/components/layout/header/ProfileButton'

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

      <div className="px-5 md:hidden">
        <AsideMenuButton />
      </div>

      <div className="hidden items-center gap-4 px-5 md:flex">
        <Breadcrumb />

        <NotificationButton />

        <ProfileButton />
      </div>
    </header>
  )
}

export default Header
