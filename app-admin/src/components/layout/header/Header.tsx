import React from 'react'
import { Bell } from 'lucide-react'
import Image from 'next/image'
import Breadcrumb from '@/components/ui/Breadcrumb'
import AsideMenuButton from '@/components/layout/header/AsideMenuButton'
import NotificationButton from '@/components/layout/header/NotificationButton'
import ProfileButton from '@/components/layout/header/ProfileButton'
import Link from 'next/link'

const Header = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-10 items-center justify-between border-b border-gray-300 backdrop-blur dark:border-gray-800 dark:bg-black dark:text-white">
      <div className="flex min-w-0 items-center">
        <Link href="/" title="EC Admin Home">
          <Image
            src="/ec-logo.svg"
            alt="EC Admin"
            width={200}
            height={40}
            priority
            className="max-h-10 w-[100px] filter transition duration-200 hover:scale-105 hover:opacity-80 dark:invert"
          />
        </Link>
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
