import { PageMeta, RouteMetaConfig } from '@/config/meta/types'
import { SECTION_NAME } from '@/constants/navigator/section/SectionName'
import { SECTION_STATE } from '@/constants/navigator/section/SectionState'

const isId = (s: string) => !!s && !['create', 'update'].includes(s)
const getSegments = (p: string) => p.split('?')[0].split('#')[0].split('/').filter(Boolean)
const getAdminIdFromPath = (p: string) => {
  const seg = getSegments(p)
  return seg[0] === 'system' && seg[1] === 'admins' ? seg[2] : undefined
}

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
    id: `${SECTION_NAME.ADMINS}_${SECTION_STATE.CREATE}`,
    test: (p: string) => p === '/system/admins/create',
    meta: (p: string): PageMeta => ({
      title: '관리자 등록',
      subtitle: '새 관리자 계정을 생성합니다.',
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '관리자 계정', href: '/system/admins', ariaCurrent: 'false' },
        { label: '신규 등록', href: p, ariaCurrent: 'page' },
      ],
    }),
  },
  {
    id: `${SECTION_NAME.ADMINS}_${SECTION_STATE.UPDATE}`,
    test: (p: string) => {
      const seg = getSegments(p)
      return seg[0] === 'system' && seg[1] === 'admins' && isId(seg[2] ?? '') && seg[3] === 'update'
    },
    meta: (p: string): PageMeta => {
      const adminId = getAdminIdFromPath(p) ?? ''
      const detailHref = `/system/admins/${adminId}`
      return {
        title: '관리자 정보 수정',
        subtitle: `ID: ${adminId}`,
        breadcrumb: [
          { label: '대시보드', href: '/', ariaCurrent: 'false' },
          { label: '관리자 계정', href: '/system/admins', ariaCurrent: 'false' },
          { label: '상세', href: detailHref, ariaCurrent: 'false' },
          { label: '정보 수정', href: p, ariaCurrent: 'page' },
        ],
      }
    },
  },

  {
    id: `${SECTION_NAME.ADMINS}_${SECTION_STATE.DETAIL}`,
    test: (p: string) => {
      const seg = getSegments(p)
      return seg[0] === 'system' && seg[1] === 'admins' && isId(seg[2] ?? '') && !seg[3]
    },
    meta: (p: string): PageMeta => {
      const adminId = getAdminIdFromPath(p) ?? ''
      return {
        title: '관리자 상세',
        subtitle: `ID: ${adminId}`,
        breadcrumb: [
          { label: '대시보드', href: '/', ariaCurrent: 'false' },
          { label: '관리자 계정', href: '/system/admins', ariaCurrent: 'false' },
          { label: '상세', href: p, ariaCurrent: 'page' },
        ],
      }
    },
  },
]
