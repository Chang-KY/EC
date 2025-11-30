import type { PageMeta, RouteMetaConfig } from '@/config/meta/types'

export const dashboardRouteMeta: RouteMetaConfig[] = [
  {
    test: (p: string) => p === '/',
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
