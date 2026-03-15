import type { PageMeta, RouteMetaConfig } from '@/config/meta/types'
import { NAV_SECTION_NAME } from '@/constants/navigator/nav/NavSectionName'

export const overViewRouteMeta: RouteMetaConfig[] = [
  {
    id: NAV_SECTION_NAME.OVERVIEW,
    test: (p: string) => p === '/overview',
    meta: (): PageMeta => ({
      title: NAV_SECTION_NAME.OVERVIEW,
      subtitle: '운영 현황과 주요 지표를 한눈에 확인합니다.',
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: NAV_SECTION_NAME.OVERVIEW, href: '/overview', ariaCurrent: 'false' },
      ],
    }),
  },
]
