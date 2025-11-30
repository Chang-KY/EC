import { PageMeta, RouteMetaConfig } from '@/config/meta/types'
import { popLast } from '@/utils/popLast'

export const categoriesRouteMeta: RouteMetaConfig[] = [
  {
    test: (p: string) => p === '/categories',
    meta: (): PageMeta => ({
      title: '카테고리 목록',
      subtitle: '상품 카테고리를 관리합니다.',
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '카테고리 관리', href: '/categories', ariaCurrent: 'page' },
      ],
    }),
  },

  {
    // /categories/[id] 상세
    test: (p: string) => p.startsWith('/categories/') && !['create', 'update'].includes(popLast(p)),
    meta: (p: string): PageMeta => ({
      title: '카테고리 상세',
      subtitle: `카테고리 ID: ${popLast(p)}`,
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '카테고리 관리', href: '/categories', ariaCurrent: 'false' },
        { label: '상세', href: p, ariaCurrent: 'page' },
      ],
    }),
  },

  {
    test: (p: string) => p === '/categories/create',
    meta: (p: string): PageMeta => ({
      title: '카테고리 생성',
      subtitle: '새 카테고리를 생성합니다.',
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '카테고리 관리', href: '/categories', ariaCurrent: 'false' },
        { label: '신규 생성', href: p, ariaCurrent: 'page' },
      ],
    }),
  },

  {
    test: (p: string) => p === '/categories/update',
    meta: (p: string): PageMeta => ({
      title: '카테고리 수정',
      subtitle: '카테고리 정보를 수정합니다.',
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '카테고리 관리', href: '/categories', ariaCurrent: 'false' },
        { label: '정보 수정', href: p, ariaCurrent: 'page' },
      ],
    }),
  },
]
