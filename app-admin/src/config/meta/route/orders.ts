import { PageMeta, RouteMetaConfig } from '@/config/meta/types'
import { popLast } from '@/utils/popLast'

export const ordersRouteMeta: RouteMetaConfig[] = [
  {
    test: (p: string) => p === '/orders',
    meta: (): PageMeta => ({
      title: '주문 목록',
      subtitle: '주문을 조회하고 관리합니다.',
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '주문 관리', href: '/orders', ariaCurrent: 'page' },
      ],
    }),
  },

  {
    // /orders/[id] 상세
    test: (p: string) => p.startsWith('/orders/') && !['create', 'update'].includes(popLast(p)),
    meta: (p: string): PageMeta => ({
      title: '주문 상세',
      subtitle: `주문 번호: ${popLast(p)}`,
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '주문 관리', href: '/orders', ariaCurrent: 'false' },
        { label: '상세', href: p, ariaCurrent: 'page' },
      ],
    }),
  },

  {
    test: (p: string) => p === '/orders/create',
    meta: (p: string): PageMeta => ({
      title: '주문 생성',
      subtitle: '새 주문을 생성합니다.',
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '주문 관리', href: '/orders', ariaCurrent: 'false' },
        { label: '주문 생성', href: p, ariaCurrent: 'page' },
      ],
    }),
  },

  {
    test: (p: string) => p === '/orders/update',
    meta: (p: string): PageMeta => ({
      title: '주문 정보 수정',
      subtitle: '주문 정보를 수정합니다.',
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '주문 관리', href: '/orders', ariaCurrent: 'false' },
        { label: '정보 수정', href: p, ariaCurrent: 'page' },
      ],
    }),
  },
]
