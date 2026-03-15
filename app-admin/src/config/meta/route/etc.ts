import type { PageMeta, RouteMetaConfig } from '@/config/meta/types'
import { NAV_SECTION_NAME } from '@/constants/navigator/nav/NavSectionName'

export const etcRouteMeta: RouteMetaConfig[] = [
  {
    id: NAV_SECTION_NAME.ETC,
    test: (p: string) => p === '/etc',
    meta: (): PageMeta => ({
      title: NAV_SECTION_NAME.ETC,
      subtitle: '서비스 운영에 필요한 환경과 정책을 설정합니다.',
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: NAV_SECTION_NAME.ETC, href: '/etc', ariaCurrent: 'false' },
      ],
    }),
  },
]
