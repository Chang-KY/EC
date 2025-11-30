import { PageMeta, RouteMetaConfig } from '@/config/meta/types'
import { popLast } from '@/utils/popLast'

export const productRouteMeta: RouteMetaConfig[] = [
  {
    test: (p: string) => p === '/products',
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
    test: (p: string) => p.startsWith('/products/') && !['create', 'update'].includes(popLast(p)),
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
    test: (p: string) => p === '/products/create',
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
    test: (p: string) => p === '/products/update',
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
