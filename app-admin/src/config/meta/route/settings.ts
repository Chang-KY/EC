import { PageMeta, RouteMetaConfig } from '@/config/meta/types'
import { popLast } from '@/utils/popLast'
import { SECTION_NAME } from '@/constants/navigator/section/SectionName'
import { SECTION_STATE } from '@/constants/navigator/section/SectionState'

export const settingsRouteMeta: RouteMetaConfig[] = [
  {
    id: `${SECTION_NAME.SETTINGS}_${SECTION_STATE.LIST}`,
    test: (p: string) => p === '/system/settings',
    meta: (): PageMeta => ({
      title: '환경 설정',
      subtitle: '서비스 기본 설정을 관리합니다.',
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '환경 설정', href: '/settings', ariaCurrent: 'page' },
      ],
    }),
  },

  {
    id: `${SECTION_NAME.SETTINGS}_${SECTION_STATE.DETAIL}`,
    test: (p: string) =>
      p.startsWith('/system/settings/') && !['create', 'update'].includes(popLast(p)),
    meta: (p: string): PageMeta => ({
      title: '환경 설정 상세',
      subtitle: `설정 키: ${popLast(p)}`,
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '환경 설정', href: '/settings', ariaCurrent: 'false' },
        { label: '상세 설정', href: p, ariaCurrent: 'page' },
      ],
    }),
  },

  {
    id: `${SECTION_NAME.SETTINGS}_${SECTION_STATE.CREATE}`,
    test: (p: string) => p === '/system/settings/create',
    meta: (p: string): PageMeta => ({
      title: '설정 추가',
      subtitle: '새 설정을 추가합니다.',
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '환경 설정', href: '/settings', ariaCurrent: 'false' },
        { label: '설정 추가', href: p, ariaCurrent: 'page' },
      ],
    }),
  },

  {
    id: `${SECTION_NAME.SETTINGS}_${SECTION_STATE.UPDATE}`,
    test: (p: string) => p === '/system/settings/update',
    meta: (p: string): PageMeta => ({
      title: '설정 수정',
      subtitle: '기존 설정 값을 수정합니다.',
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '환경 설정', href: '/settings', ariaCurrent: 'false' },
        { label: '설정 수정', href: p, ariaCurrent: 'page' },
      ],
    }),
  },
]
