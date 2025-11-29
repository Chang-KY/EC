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
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import clsx from 'clsx'
import { ROUTES } from '@/constants/routes'

const navigation = [
  { name: '대시보드', href: ROUTES.DASHBOARD, icon: LayoutDashboardIcon },
  { name: '어드민', href: ROUTES.ADMIN, icon: LayoutDashboardIcon },
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

  return (
    <>
      {navigation.map((item) => {
        const active =
          pathname === item.href || (pathname.startsWith(item.href + '/') && item.href !== '/admin')

        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'flex items-center gap-2 rounded px-3 py-2 text-sm',
              active ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-900',
            )}
            aria-current={active ? 'page' : undefined}
          >
            <item.icon className="size-4.5" />
            <span>{item.name}</span>
          </Link>
        )
      })}
    </>
  )
}

export default Navigator
