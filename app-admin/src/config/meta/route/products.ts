import { PageMeta, RouteMetaConfig } from '@/config/meta/types'
import { popLast } from '@/utils/popLast'
import { SECTION_NAME } from '@/constants/navigator/section/SectionName'
import { SECTION_STATE } from '@/constants/navigator/section/SectionState'

export const productRouteMeta: RouteMetaConfig[] = [
  {
    id: `${SECTION_NAME.PRODUCTS}_${SECTION_STATE.LIST}`,
    test: (p: string) => p === '/commerce/products',
    meta: (): PageMeta => ({
      title: '상품 목록',
      subtitle: '상품을 조회하고 관리합니다.',
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '상품 관리', href: '/products', ariaCurrent: 'page' },
      ],
    }),
  },

  {
    id: `${SECTION_NAME.PRODUCTS}_${SECTION_STATE.DETAIL}`,
    test: (p: string) =>
      p.startsWith('/commerce/products/') && !['create', 'update'].includes(popLast(p)),
    meta: (p: string): PageMeta => ({
      title: '상품 상세',
      subtitle: `상품 ID: ${popLast(p)}`,
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '상품 관리', href: '/products', ariaCurrent: 'false' },
        { label: '상세', href: p, ariaCurrent: 'page' },
      ],
    }),
  },

  {
    id: `${SECTION_NAME.PRODUCTS}_${SECTION_STATE.CREATE}`,
    test: (p: string) => p === '/commerce/products/create',
    meta: (p: string): PageMeta => ({
      title: '상품 등록',
      subtitle: '새 상품을 등록합니다.',
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '상품 관리', href: '/products', ariaCurrent: 'false' },
        { label: '신규 등록', href: p, ariaCurrent: 'page' },
      ],
    }),
  },

  {
    id: `${SECTION_NAME.PRODUCTS}_${SECTION_STATE.UPDATE}`,
    test: (p: string) => p === '/commerce/products/update',
    meta: (p: string): PageMeta => ({
      title: '상품 정보 수정',
      subtitle: '상품 정보를 수정합니다.',
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '상품 관리', href: '/products', ariaCurrent: 'false' },
        { label: '정보 수정', href: p, ariaCurrent: 'page' },
      ],
    }),
  },
]
