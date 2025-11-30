import { PageMeta, RouteMetaConfig } from '@/config/meta/types'
import { popLast } from '@/utils/popLast'

export const settingsRouteMeta: RouteMetaConfig[] = [
  {
    test: (p: string) => p === '/settings',
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
    // /settings/[id] 상세 (예: /settings/profile, /settings/notifications 등)
    test: (p: string) => p.startsWith('/settings/') && !['create', 'update'].includes(popLast(p)),
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
    test: (p: string) => p === '/settings/create',
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
    test: (p: string) => p === '/settings/update',
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
