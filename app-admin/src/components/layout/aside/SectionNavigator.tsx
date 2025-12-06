import React from 'react'
import { ROUTES } from '@/constants/routes'
import {
  BadgePercentIcon,
  BarChart3Icon,
  BellIcon,
  FolderIcon,
  LayoutDashboardIcon,
  MessageSquareIcon,
  PackageIcon,
  ReceiptIcon,
  SettingsIcon,
  ShieldCheck,
  ShoppingCartIcon,
  Tags,
  TicketIcon,
  TruckIcon,
  UserCogIcon,
} from 'lucide-react'
import Link from 'next/link'
import Selected from '@/components/ui/Selected'
import { NAV_SECTION_NAME } from '@/constants/navigator/nav/NavSectionName'

const overviewNavigation = [
  { name: '대시보드', href: ROUTES.DASHBOARD, icon: LayoutDashboardIcon },
  { name: '분석', href: ROUTES.ANALYTICS, icon: BarChart3Icon },
  // { name: '실시간 모니터링', href: ROUTES.REALTIME, icon: ActivityIcon },
  // { name: '매출 리포트', href: ROUTES.REPORTS, icon: LineChartIcon },
] as const

const commerceNavigation = [
  { name: '주문 관리', href: ROUTES.ORDERS, icon: ShoppingCartIcon },
  { name: '상품 관리', href: ROUTES.PRODUCTS, icon: PackageIcon },
  { name: '카테고리', href: ROUTES.CATEGORIES, icon: Tags },
  { name: '쿠폰', href: ROUTES.COUPONS, icon: TicketIcon },
  { name: '리뷰 관리', href: ROUTES.REVIEWS, icon: MessageSquareIcon },
  { name: '사용자 관리', href: ROUTES.USERS, icon: UserCogIcon },
  { name: '배송 관리', href: ROUTES.SHIPPING, icon: TruckIcon },
  { name: '정산 / 환불', href: ROUTES.SETTLEMENTS, icon: ReceiptIcon },
  { name: '포인트 / 등급', href: ROUTES.MEMBERSHIP, icon: BadgePercentIcon },
] as const

const etcNavigation = [
  { name: '알림', href: ROUTES.NOTIFICATIONS, icon: BellIcon },
  { name: '파일 관리', href: ROUTES.FILES, icon: FolderIcon },
  // { name: '배너 관리', href: ROUTES.BANNERS, icon: ImageIcon },
  // { name: '프로모션 / 기획전', href: ROUTES.CAMPAIGNS, icon: MegaphoneIcon },
  // { name: '콘텐츠 관리', href: ROUTES.PAGES, icon: FileTextIcon },
  // { name: '고객센터', href: ROUTES.SUPPORT, icon: HeadphonesIcon },
] as const

const systemNavigation = [
  { name: '어드민', href: ROUTES.ADMINS, icon: ShieldCheck },
  { name: '설정', href: ROUTES.SETTINGS, icon: SettingsIcon },
  // { name: '역할 / 권한', href: ROUTES.ROLES, icon: ShieldCheckIcon },
  // { name: '활동 로그', href: ROUTES.AUDIT_LOGS, icon: ListOrderedIcon },
  // { name: '시스템 상태', href: ROUTES.SYSTEM_STATUS, icon: ServerIcon },
] as const

export const navigationBySection = {
  overview: overviewNavigation,
  commerce: commerceNavigation,
  etc: etcNavigation,
  system: systemNavigation,
}

const sectionTitle: Record<SectionKey, string> = {
  overview: NAV_SECTION_NAME.OVERVIEW,
  commerce: NAV_SECTION_NAME.COMMERCE,
  etc: NAV_SECTION_NAME.ETC,
  system: NAV_SECTION_NAME.SYSTEM,
}
type SectionKey = 'overview' | 'commerce' | 'etc' | 'system'

export default async function SectionNavigator({
  sn,
  children,
}: {
  sn: 'overview' | 'commerce' | 'etc' | 'system'
  children: React.ReactNode
}) {
  const menus = navigationBySection[sn]
  const title = sectionTitle[sn]

  return (
    <section className="flex size-full">
      <div className="h-full w-60 border-r border-gray-300 bg-white dark:border-gray-800 dark:bg-black">
        <h2 className="flex h-12 items-center border-b border-gray-300 px-6 py-2.5 text-base leading-none font-semibold dark:border-gray-800">
          {title}
        </h2>
        <div className="py-5">
          <h3 className="pl-6 text-[10px] text-gray-500">CONFIGURATION</h3>
          <nav className="mt-3 px-3 text-black dark:text-white">
            <ul className="space-y-1">
              {menus.map((item) => {
                return (
                  <li key={item.href}>
                    <Selected currentPath={item.href}>
                      <Link
                        href={item.href}
                        className="group flex items-center gap-2 rounded-md px-3 py-2 text-xs transition-colors duration-150 hover:bg-gray-100 hover:dark:bg-gray-900"
                      >
                        {/*<item.icon size={14} className="text-gray-700 transition-colors" />*/}
                        <span>{item.name}</span>
                      </Link>
                    </Selected>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </div>
      <div className="w-full">{children}</div>
    </section>
  )
}
