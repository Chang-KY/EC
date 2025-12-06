import { PageMeta, RouteMetaConfig } from '@/config/meta/types'
import { popLast } from '@/utils/popLast'
import { SECTION_NAME } from '@/constants/navigator/section/SectionName'
import { SECTION_STATE } from '@/constants/navigator/section/SectionState'

export const filesRouteMeta: RouteMetaConfig[] = [
  {
    id: `${SECTION_NAME.COUPONS}_${SECTION_STATE.LIST}`,
    test: (p: string) => p === '/etc/files',
    meta: (): PageMeta => ({
      title: '파일 관리',
      subtitle: '업로드된 파일을 조회하고 관리합니다.',
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '파일 관리', href: '/files', ariaCurrent: 'page' },
      ],
    }),
  },

  {
    id: `${SECTION_NAME.COUPONS}_${SECTION_STATE.DETAIL}`,
    test: (p: string) => p.startsWith('/etc/files/') && !['create', 'update'].includes(popLast(p)),
    meta: (p: string): PageMeta => ({
      title: '파일 상세',
      subtitle: `파일 ID: ${popLast(p)}`,
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '파일 관리', href: '/files', ariaCurrent: 'false' },
        { label: '상세', href: p, ariaCurrent: 'page' },
      ],
    }),
  },

  {
    id: `${SECTION_NAME.COUPONS}_${SECTION_STATE.CREATE}`,
    test: (p: string) => p === '/etc/files/create',
    meta: (p: string): PageMeta => ({
      title: '파일 업로드',
      subtitle: '새 파일을 업로드합니다.',
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '파일 관리', href: '/files', ariaCurrent: 'false' },
        { label: '파일 업로드', href: p, ariaCurrent: 'page' },
      ],
    }),
  },

  {
    id: `${SECTION_NAME.COUPONS}_${SECTION_STATE.UPDATE}`,
    test: (p: string) => p === '/etc/files/update',
    meta: (p: string): PageMeta => ({
      title: '파일 정보 수정',
      subtitle: '파일 정보를 수정합니다.',
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '파일 관리', href: '/files', ariaCurrent: 'false' },
        { label: '정보 수정', href: p, ariaCurrent: 'page' },
      ],
    }),
  },
]
