import { PageMeta, RouteMetaConfig } from '@/config/meta/types'
import { popLast } from '@/utils/popLast'
import { SECTION_NAME } from '@/constants/navigator/section/SectionName'
import { SECTION_STATE } from '@/constants/navigator/section/SectionState'

export const notificationsRouteMeta: RouteMetaConfig[] = [
  {
    id: `${SECTION_NAME.NOTIFICATIONS}_${SECTION_STATE.LIST}`,
    test: (p: string) => p === '/etc/notifications',
    meta: (): PageMeta => ({
      title: '알림 목록',
      subtitle: '시스템 및 사용자 알림을 확인합니다.',
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '알림', href: '/notifications', ariaCurrent: 'page' },
      ],
    }),
  },

  {
    id: `${SECTION_NAME.NOTIFICATIONS}_${SECTION_STATE.DETAIL}`,
    test: (p: string) =>
      p.startsWith('/etc/notifications/') && !['create', 'update'].includes(popLast(p)),
    meta: (p: string): PageMeta => ({
      title: '알림 상세',
      subtitle: `알림 ID: ${popLast(p)}`,
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '알림', href: '/notifications', ariaCurrent: 'false' },
        { label: '상세', href: p, ariaCurrent: 'page' },
      ],
    }),
  },

  {
    id: `${SECTION_NAME.NOTIFICATIONS}_${SECTION_STATE.CREATE}`,
    test: (p: string) => p === '/etc/notifications/create',
    meta: (p: string): PageMeta => ({
      title: '알림 생성',
      subtitle: '새 알림을 등록합니다.',
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '알림', href: '/notifications', ariaCurrent: 'false' },
        { label: '알림 생성', href: p, ariaCurrent: 'page' },
      ],
    }),
  },

  {
    id: `${SECTION_NAME.NOTIFICATIONS}_${SECTION_STATE.UPDATE}`,
    test: (p: string) => p === '/etc/notifications/update',
    meta: (p: string): PageMeta => ({
      title: '알림 수정',
      subtitle: '알림 내용을 수정합니다.',
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '알림', href: '/notifications', ariaCurrent: 'false' },
        { label: '알림 수정', href: p, ariaCurrent: 'page' },
      ],
    }),
  },
]
