import { PageMeta, RouteMetaConfig } from '@/config/meta/types'
import { popLast } from '@/utils/popLast'
import { SECTION_NAME } from '@/constants/navigator/section/SectionName'
import { SECTION_STATE } from '@/constants/navigator/section/SectionState'

export const ordersRouteMeta: RouteMetaConfig[] = [
  {
    id: `${SECTION_NAME.ORDERS}_${SECTION_STATE.LIST}`,
    test: (p: string) => p === '/commerce/orders',
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
    id: `${SECTION_NAME.ORDERS}_${SECTION_STATE.DETAIL}`,
    test: (p: string) =>
      p.startsWith('/commerce/orders/') && !['create', 'update'].includes(popLast(p)),
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
    id: `${SECTION_NAME.ORDERS}_${SECTION_STATE.CREATE}`,
    test: (p: string) => p === '/commerce/orders/create',
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
    id: `${SECTION_NAME.ORDERS}_${SECTION_STATE.UPDATE}`,
    test: (p: string) => p === '/commerce/orders/update',
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
