import { PageMeta, RouteMetaConfig } from '@/config/meta/types'
import { popLast } from '@/utils/popLast'
import { SECTION_NAME } from '@/constants/navigator/section/SectionName'
import { SECTION_STATE } from '@/constants/navigator/section/SectionState'

export const reviewsRouteMeta: RouteMetaConfig[] = [
  {
    id: `${SECTION_NAME.REVIEWS}_${SECTION_STATE.LIST}`,
    test: (p: string) => p === '/commerce/reviews',
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
    id: `${SECTION_NAME.REVIEWS}_${SECTION_STATE.DETAIL}`,
    test: (p: string) =>
      p.startsWith('/commerce/reviews/') && !['create', 'update'].includes(popLast(p)),
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
    id: `${SECTION_NAME.REVIEWS}_${SECTION_STATE.CREATE}`,
    test: (p: string) => p === '/commerce/reviews/create',
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
    id: `${SECTION_NAME.REVIEWS}_${SECTION_STATE.UPDATE}`,
    test: (p: string) => p === '/commerce/reviews/update',
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
