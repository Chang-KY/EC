import type { PageMeta, RouteMetaConfig } from '@/config/meta/types'
import { SECTION_NAME } from '@/constants/navigator/section/SectionName'

export const dashboardRouteMeta: RouteMetaConfig[] = [
  {
    id: SECTION_NAME.DASHBOARD,
    test: (p: string) => p === '/overview',
    meta: (): PageMeta => ({
      title: '대시보드',
      subtitle: '서비스 주요 지표를 한눈에 확인합니다.',
      breadcrumb: [
        {
          label: '대시보드',
          href: '/',
          ariaCurrent: 'page',
        },
      ],
    }),
  },
]
