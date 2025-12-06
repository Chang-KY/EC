'use client'

import { LayoutDashboardIcon, ShoppingCartIcon, SettingsIcon, MegaphoneIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import clsx from 'clsx'
import React from 'react'
import { NAV_SECTION_ID } from '@/constants/navigator/nav/NavSectionId'
import { NAV_SECTION_NAME } from '@/constants/navigator/nav/NavSectionName'

const navSection = [
  {
    id: NAV_SECTION_ID.OVERVIEW,
    name: NAV_SECTION_NAME.OVERVIEW, // 대시보드 / 분석
    icon: LayoutDashboardIcon,
    href: '/overview/analytics',
  },
  {
    id: NAV_SECTION_ID.COMMERCE,
    name: NAV_SECTION_NAME.COMMERCE, // 주문 / 상품 / 카테고리 / 쿠폰 / 리뷰 / 사용자 / 배송 / 정산 / 포인트
    icon: ShoppingCartIcon,
    href: '/commerce/products',
  },
  {
    id: NAV_SECTION_ID.ETC,
    name: NAV_SECTION_NAME.ETC, // 알림 / 파일 / 배너 / 기획전 등
    icon: MegaphoneIcon,
    href: '/etc/notifications',
  },
  {
    id: NAV_SECTION_ID.SYSTEM,
    name: NAV_SECTION_NAME.SYSTEM, // 어드민 / 설정 / 권한 / 로그 등
    icon: SettingsIcon,
    href: '/system/settings',
  },
] as const

const Navigator = () => {
  const pathname = usePathname()
  const [expanded, setExpanded] = React.useState(false)

  return (
    <nav
      className={clsx(
        'relative flex flex-1 flex-col gap-1 border-r px-1.5 py-3',
        'border-gray-300 bg-white text-black',
        'dark:border-gray-800 dark:bg-black dark:text-white',
        'transition-[width] duration-200',
        expanded ? 'w-44' : 'w-[50px]',
      )}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {navSection.map((item) => {
        const active = pathname === '/' + item.id || pathname.startsWith(`/${item.id}/`)
        const baseItemClass =
          'h-9 min-w-[37.45px] pl-[8.725px] rounded-md text-sm transition-colors flex items-center'

        const content = (
          <>
            <item.icon className="size-5 shrink-0 text-black dark:text-white" />
            <span
              className={clsx(
                'flex-1 origin-left text-xs tracking-tight whitespace-nowrap',
                'overflow-hidden transition-all duration-200 ease-out',
                'text-black dark:text-white',
                expanded ? 'ml-4 opacity-100' : 'max-w-0 opacity-0',
              )}
            >
              {item.name}
            </span>
          </>
        )

        if (active) {
          return (
            <React.Fragment key={item.href}>
              {item.id === 'system' && (
                <div className="my-1 h-px rounded-full bg-gray-300 dark:bg-gray-800" />
              )}
              <div
                className={clsx(
                  baseItemClass,
                  'cursor-default bg-gray-200 font-semibold dark:bg-gray-900',
                )}
                aria-current="page"
              >
                {content}
              </div>
            </React.Fragment>
          )
        }

        return (
          <React.Fragment key={item.href}>
            {item.id === 'system' && (
              <div className="my-1 h-px rounded-full bg-gray-300 dark:bg-gray-800" />
            )}
            <Link
              href={item.href}
              className={clsx(
                baseItemClass,
                'hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-900 dark:hover:text-gray-100',
              )}
            >
              {content}
            </Link>
          </React.Fragment>
        )
      })}
    </nav>
  )
}

export default Navigator
