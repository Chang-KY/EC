import { z } from 'zod'
import { Briefcase, Eye, LucideIcon, Shield, User } from 'lucide-react'
import { BadgeCheck, CheckCircle2, Crown, PauseCircle, XCircle } from 'lucide-react'

export const adminStatusSchema = z.enum(['active', 'suspended', 'revoked']).default('active')
export type AdminStatus = z.infer<typeof adminStatusSchema>

export const userRoleSchema = z
  .enum(['admin', 'super_admin', 'viewer', 'manager'])
  .default('manager')
export type UserRole = z.infer<typeof userRoleSchema>

export const levelSchema = z.coerce
  .number()
  .int('레벨은 정수여야 합니다.')
  .min(1, '레벨은 1 이상이어야 합니다.')
  .max(6, '레벨은 6 이하로만 설정할 수 있습니다.')
  .default(1)
export type Level = z.infer<typeof levelSchema>

export const ADMIN_STATUS_META = {
  active: {
    label: '활성',
    icon: CheckCircle2,
    className: 'text-emerald-600 dark:text-emerald-300',
  },
  suspended: { label: '정지', icon: PauseCircle, className: 'text-amber-600 dark:text-amber-300' },
  revoked: { label: '회수', icon: XCircle, className: 'text-rose-600 dark:text-rose-300' },
} as const satisfies Record<string, { label: string; icon?: LucideIcon; className: string }>

export type AdminStatusKey = keyof typeof ADMIN_STATUS_META

export const adminStatusOptions = (Object.keys(ADMIN_STATUS_META) as AdminStatusKey[]).map(
  (value) => ({
    value,
    label: ADMIN_STATUS_META[value].label,
    icon: ADMIN_STATUS_META[value].icon,
  }),
)

export const USER_ROLE_META = {
  super_admin: {
    label: '슈퍼 관리자',
    icon: Shield,
    className: 'text-violet-600 dark:text-violet-300',
  },
  admin: { label: '관리자', icon: User, className: 'text-sky-600 dark:text-sky-300' },
  manager: {
    label: '매니저 (기본)',
    icon: Briefcase,
    className: 'text-zinc-700 dark:text-zinc-300',
  },
  viewer: { label: '뷰어 (조회 전용)', icon: Eye, className: 'text-zinc-600 dark:text-zinc-300' },
} as const satisfies Record<string, { label: string; icon?: LucideIcon; className?: string }>

export type UserRoleKey = keyof typeof USER_ROLE_META

export const userRoleOptions = (Object.keys(USER_ROLE_META) as UserRoleKey[]).map((value) => ({
  value,
  label: USER_ROLE_META[value].label,
}))

export const LEVELS = [1, 2, 3, 4, 5, 6] as const
export type LevelKey = (typeof LEVELS)[number]

export const LEVEL_META = {
  1: { label: '레벨 1', icon: BadgeCheck },
  2: { label: '레벨 2', icon: BadgeCheck },
  3: { label: '레벨 3', icon: BadgeCheck },
  4: { label: '레벨 4', icon: BadgeCheck },
  5: { label: '레벨 5', icon: BadgeCheck },
  6: { label: '레벨 6', icon: Crown },
} as const satisfies Record<number, { label: string; icon?: LucideIcon }>

export const levelOptions = LEVELS.map((value) => ({
  value,
  label: LEVEL_META[value].label,
}))
