import { PageMeta, RouteMetaConfig } from '@/config/meta/types'
import { popLast } from '@/utils/popLast'
import { SECTION_NAME } from '@/constants/navigator/section/SectionName'
import { SECTION_STATE } from '@/constants/navigator/section/SectionState'

export const adminRouteMeta: RouteMetaConfig[] = [
  {
    id: `${SECTION_NAME.ADMINS}_${SECTION_STATE.LIST}`,
    test: (p: string) => p === '/system/admins',
    meta: (): PageMeta => ({
      title: '관리자 목록',
      subtitle: '관리자 계정 관리',
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '관리자 계정', href: '/admins', ariaCurrent: 'page' },
      ],
    }),
  },

  {
    id: `${SECTION_NAME.ADMINS}_${SECTION_STATE.DETAIL}`,
    test: (p: string) =>
      p.startsWith('/system/admins/') && !['create', 'update'].includes(popLast(p)),
    meta: (p: string): PageMeta => ({
      title: '관리자 상세',
      subtitle: `ID: ${popLast(p)}`,
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '관리자 계정', href: '/admins', ariaCurrent: 'false' },
        { label: '상세', href: p, ariaCurrent: 'page' },
      ],
    }),
  },

  {
    id: `${SECTION_NAME.ADMINS}_${SECTION_STATE.CREATE}`,
    test: (p: string) => p === '/system/admins/create',
    meta: (p: string): PageMeta => ({
      title: '관리자 등록',
      subtitle: '새 관리자 계정을 생성합니다.',
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '관리자 계정', href: '/admins', ariaCurrent: 'false' },
        { label: '신규 등록', href: p, ariaCurrent: 'page' },
      ],
    }),
  },

  {
    id: `${SECTION_NAME.ADMINS}_${SECTION_STATE.UPDATE}`,
    test: (p: string) => p === '/system/admins/update',
    meta: (p: string): PageMeta => ({
      title: '관리자 정보 수정',
      subtitle: '관리자 계정 정보를 수정합니다.',
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '관리자 계정', href: '/admins', ariaCurrent: 'false' },
        { label: '정보 수정', href: p, ariaCurrent: 'page' },
      ],
    }),
  },
]
