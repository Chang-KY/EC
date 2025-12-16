import { PageMeta, RouteMetaConfig } from '@/config/meta/types'

export const noDataRouteMeta: RouteMetaConfig[] = [
  {
    id: `not-found`,
    test: (p: string) => p === 'not-found',
    meta: (p: string): PageMeta => ({
      title: '데이터를 찾을 수 없습니다',
      subtitle: '존재하지 않거나 삭제된 데이터입니다.',
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '관리자 계정', href: '/system/admins', ariaCurrent: 'false' },
        { label: '데이터 없음', href: p, ariaCurrent: 'page' },
      ],
    }),
  },
]
