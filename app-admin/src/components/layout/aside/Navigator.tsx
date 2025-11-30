'use client'

import {
  LayoutDashboardIcon,
  TicketIcon,
  PackageIcon,
  UserCogIcon,
  ShoppingCartIcon,
  MessageSquareIcon,
  BarChart3Icon,
  SettingsIcon,
  FolderIcon,
  BellIcon,
  Tags,
  ShieldCheck,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import clsx from 'clsx'
import { ROUTES } from '@/constants/routes'
import React, { useState } from 'react'

const navigation = [
  { name: '대시보드', href: ROUTES.DASHBOARD, icon: LayoutDashboardIcon },
  { name: '어드민', href: ROUTES.ADMIN, icon: ShieldCheck },
  { name: '분석', href: ROUTES.ANALYTICS, icon: BarChart3Icon },
  { name: '카테고리', href: ROUTES.CATEGORIES, icon: Tags },
  { name: '쿠폰', href: ROUTES.COUPONS, icon: TicketIcon },
  { name: '파일 관리', href: ROUTES.FILES, icon: FolderIcon },
  { name: '알림', href: ROUTES.NOTIFICATIONS, icon: BellIcon },
  { name: '주문 관리', href: ROUTES.ORDERS, icon: ShoppingCartIcon },
  { name: '상품 관리', href: ROUTES.PRODUCTS, icon: PackageIcon },
  { name: '리뷰 관리', href: ROUTES.REVIEWS, icon: MessageSquareIcon },
  { name: '설정', href: ROUTES.SETTINGS, icon: SettingsIcon },
  { name: '사용자 관리', href: ROUTES.USERS, icon: UserCogIcon },
]

const Navigator = () => {
  const pathname = usePathname()
  const [expanded, setExpanded] = React.useState(false)

  return (
    <nav
      className={clsx(
        'relative flex flex-1 flex-col gap-1 border-r border-gray-800 bg-black px-1.5 py-3',
        'transition-[width] duration-200',
        expanded ? 'w-44' : 'w-[50px]',
      )}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {navigation.map((item) => {
        const active =
          pathname === item.href ||
          (pathname.startsWith(item.href + '/') && item.href !== ROUTES.ADMIN)

        const baseItemClass =
          'h-9 min-w-[37.45px] pl-[8.725px] rounded-md text-sm transition-colors flex items-center'

        const content = (
          <>
            <item.icon className="size-5 shrink-0" />
            <span
              className={clsx(
                'flex-1 origin-left text-xs tracking-tight whitespace-nowrap',
                'overflow-hidden transition-all duration-200 ease-out',
                expanded ? 'ml-4 opacity-100' : 'max-w-0 opacity-0',
              )}
            >
              {item.name}
            </span>
          </>
        )

        if (active) {
          return (
            <div
              key={item.href}
              className={clsx(baseItemClass, 'cursor-default bg-gray-900 text-white')}
              aria-current="page"
            >
              {content}
            </div>
          )
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(baseItemClass, 'text-gray-400 hover:bg-gray-900 hover:text-gray-100')}
            aria-current={undefined}
          >
            {content}
          </Link>
        )
      })}
    </nav>
  )
}

export default Navigator
