import { PageMeta, RouteMetaConfig } from '@/config/meta/types'
import { popLast } from '@/utils/popLast'
import { SECTION_NAME } from '@/constants/navigator/section/SectionName'
import { SECTION_STATE } from '@/constants/navigator/section/SectionState'

export const couponsRouteMeta: RouteMetaConfig[] = [
  {
    id: `${SECTION_NAME.COUPONS}_${SECTION_STATE.LIST}`,
    test: (p: string) => p === '/commerce/coupons',
    meta: (): PageMeta => ({
      title: '쿠폰 목록',
      subtitle: '프로모션 및 할인 쿠폰을 관리합니다.',
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '쿠폰 관리', href: '/coupons', ariaCurrent: 'page' },
      ],
    }),
  },

  {
    id: `${SECTION_NAME.COUPONS}_${SECTION_STATE.DETAIL}`,
    test: (p: string) =>
      p.startsWith('/commerce/coupons/') && !['create', 'update'].includes(popLast(p)),
    meta: (p: string): PageMeta => ({
      title: '쿠폰 상세',
      subtitle: `쿠폰 ID: ${popLast(p)}`,
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '쿠폰 관리', href: '/coupons', ariaCurrent: 'false' },
        { label: '상세', href: p, ariaCurrent: 'page' },
      ],
    }),
  },

  {
    id: `${SECTION_NAME.COUPONS}_${SECTION_STATE.CREATE}`,
    test: (p: string) => p === '/commerce/coupons/create',
    meta: (p: string): PageMeta => ({
      title: '쿠폰 생성',
      subtitle: '새 쿠폰을 생성합니다.',
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '쿠폰 관리', href: '/coupons', ariaCurrent: 'false' },
        { label: '신규 생성', href: p, ariaCurrent: 'page' },
      ],
    }),
  },

  {
    id: `${SECTION_NAME.COUPONS}_${SECTION_STATE.UPDATE}`,
    test: (p: string) => p === '/commerce/coupons/update',
    meta: (p: string): PageMeta => ({
      title: '쿠폰 수정',
      subtitle: '쿠폰 정보를 수정합니다.',
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '쿠폰 관리', href: '/coupons', ariaCurrent: 'false' },
        { label: '정보 수정', href: p, ariaCurrent: 'page' },
      ],
    }),
  },
]
