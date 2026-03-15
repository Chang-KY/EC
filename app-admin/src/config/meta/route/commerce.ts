import type { PageMeta, RouteMetaConfig } from '@/config/meta/types'
import { NAV_SECTION_NAME } from '@/constants/navigator/nav/NavSectionName'

export const commerceRouteMeta: RouteMetaConfig[] = [
  {
    id: NAV_SECTION_NAME.COMMERCE,
    test: (p: string) => p === '/commerce',
    meta: (): PageMeta => ({
      title: NAV_SECTION_NAME.COMMERCE,
      subtitle: '커머스 운영 전반을 한 곳에서 관리합니다.',
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: NAV_SECTION_NAME.COMMERCE, href: '/commerce', ariaCurrent: 'false' },
      ],
    }),
  },
]
