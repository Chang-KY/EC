import { PageMeta, RouteMetaConfig } from '@/config/meta/types'
import { popLast } from '@/utils/popLast'

export const reviewsRouteMeta: RouteMetaConfig[] = [
  {
    test: (p: string) => p === '/reviews',
    meta: (): PageMeta => ({
      title: '리뷰 목록',
      subtitle: '상품 리뷰를 조회하고 관리합니다.',
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '리뷰 관리', href: '/reviews', ariaCurrent: 'page' },
      ],
    }),
  },

  {
    // /reviews/[id] 상세
    test: (p: string) => p.startsWith('/reviews/') && !['create', 'update'].includes(popLast(p)),
    meta: (p: string): PageMeta => ({
      title: '리뷰 상세',
      subtitle: `리뷰 ID: ${popLast(p)}`,
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '리뷰 관리', href: '/reviews', ariaCurrent: 'false' },
        { label: '상세', href: p, ariaCurrent: 'page' },
      ],
    }),
  },

  {
    test: (p: string) => p === '/reviews/create',
    meta: (p: string): PageMeta => ({
      title: '리뷰 등록',
      subtitle: '새 리뷰를 등록합니다.',
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '리뷰 관리', href: '/reviews', ariaCurrent: 'false' },
        { label: '리뷰 등록', href: p, ariaCurrent: 'page' },
      ],
    }),
  },

  {
    test: (p: string) => p === '/reviews/update',
    meta: (p: string): PageMeta => ({
      title: '리뷰 수정',
      subtitle: '리뷰 내용을 수정합니다.',
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '리뷰 관리', href: '/reviews', ariaCurrent: 'false' },
        { label: '리뷰 수정', href: p, ariaCurrent: 'page' },
      ],
    }),
  },
]
