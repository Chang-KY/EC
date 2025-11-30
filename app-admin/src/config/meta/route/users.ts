import { PageMeta, RouteMetaConfig } from '@/config/meta/types'
import { popLast } from '@/utils/popLast'

export const usersRouteMeta: RouteMetaConfig[] = [
  {
    test: (p: string) => p === '/users',
    meta: (): PageMeta => ({
      title: '회원 목록',
      subtitle: '회원 계정을 조회하고 관리합니다.',
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '회원 관리', href: '/users', ariaCurrent: 'page' },
      ],
    }),
  },

  {
    // /users/[id] 상세
    test: (p: string) => p.startsWith('/users/') && !['create', 'update'].includes(popLast(p)),
    meta: (p: string): PageMeta => ({
      title: '회원 상세',
      subtitle: `회원 ID: ${popLast(p)}`,
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '회원 관리', href: '/users', ariaCurrent: 'false' },
        { label: '상세', href: p, ariaCurrent: 'page' },
      ],
    }),
  },

  {
    test: (p: string) => p === '/users/create',
    meta: (p: string): PageMeta => ({
      title: '회원 등록',
      subtitle: '새 회원을 등록합니다.',
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '회원 관리', href: '/users', ariaCurrent: 'false' },
        { label: '회원 등록', href: p, ariaCurrent: 'page' },
      ],
    }),
  },

  {
    test: (p: string) => p === '/users/update',
    meta: (p: string): PageMeta => ({
      title: '회원 정보 수정',
      subtitle: '회원 계정 정보를 수정합니다.',
      breadcrumb: [
        { label: '대시보드', href: '/', ariaCurrent: 'false' },
        { label: '회원 관리', href: '/users', ariaCurrent: 'false' },
        { label: '정보 수정', href: p, ariaCurrent: 'page' },
      ],
    }),
  },
]
