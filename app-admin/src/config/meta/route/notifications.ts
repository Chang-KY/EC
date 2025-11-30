import { PageMeta, RouteMetaConfig } from '@/config/meta/types'
import { popLast } from '@/utils/popLast'

export const notificationsRouteMeta: RouteMetaConfig[] = [
  {
    test: (p: string) => p === '/notifications',
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
    // /notifications/[id] 상세
    test: (p: string) =>
      p.startsWith('/notifications/') && !['create', 'update'].includes(popLast(p)),
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
    test: (p: string) => p === '/notifications/create',
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
    test: (p: string) => p === '/notifications/update',
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
