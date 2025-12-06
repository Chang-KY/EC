import { PageMeta, RouteMetaConfig } from '@/config/meta/types'
import { popLast } from '@/utils/popLast'
import { SECTION_NAME } from '@/constants/navigator/section/SectionName'
import { SECTION_STATE } from '@/constants/navigator/section/SectionState'

export const analyticsRouteMeta: RouteMetaConfig[] = [
  {
    id: `${SECTION_NAME.ANALYTICS}_${SECTION_STATE.LIST}`,
    test: (p: string) => p === '/overview/analytics',
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
    id: `${SECTION_NAME.ANALYTICS}_${SECTION_STATE.DETAIL}`,
    test: (p: string) =>
      p.startsWith('/overview/analytics/') && !['create', 'update'].includes(popLast(p)),
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
    id: `${SECTION_NAME.ANALYTICS}_${SECTION_STATE.CREATE}`,
    test: (p: string) => p === '/overview/analytics/create',
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
    id: `${SECTION_NAME.ANALYTICS}_${SECTION_STATE.UPDATE}`,
    test: (p: string) => p === '/overview/analytics/update',
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
