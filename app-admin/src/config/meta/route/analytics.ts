import { PageMeta, RouteMetaConfig } from '@/config/meta/types'
import { popLast } from '@/utils/popLast'

export const analyticsRouteMeta: RouteMetaConfig[] = [
  {
    test: (p: string) => p === '/analytics',
    meta: (): PageMeta => ({
      title: '분석',
      subtitle: '서비스 지표를 한눈에 확인합니다.',
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '분석', href: '/analytics', ariaCurrent: 'page' },
      ],
    }),
  },

  {
    // /analytics/[id] 상세
    test: (p: string) => p.startsWith('/analytics/') && !['create', 'update'].includes(popLast(p)),
    meta: (p: string): PageMeta => ({
      title: '분석 리포트 상세',
      subtitle: `리포트 ID: ${popLast(p)}`,
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '분석', href: '/analytics', ariaCurrent: 'false' },
        { label: '리포트 상세', href: p, ariaCurrent: 'page' },
      ],
    }),
  },

  {
    test: (p: string) => p === '/analytics/create',
    meta: (p: string): PageMeta => ({
      title: '분석 리포트 생성',
      subtitle: '새 분석 리포트를 생성합니다.',
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '분석', href: '/analytics', ariaCurrent: 'false' },
        { label: '리포트 생성', href: p, ariaCurrent: 'page' },
      ],
    }),
  },

  {
    test: (p: string) => p === '/analytics/update',
    meta: (p: string): PageMeta => ({
      title: '분석 리포트 수정',
      subtitle: '분석 리포트 설정을 수정합니다.',
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '분석', href: '/analytics', ariaCurrent: 'false' },
        { label: '리포트 수정', href: p, ariaCurrent: 'page' },
      ],
    }),
  },
]
