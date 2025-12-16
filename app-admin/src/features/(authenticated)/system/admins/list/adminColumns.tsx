import { ColumnDef } from '@tanstack/react-table'
import { ADMINS_TABLE } from '@/types/db'
import { LucideIcon } from 'lucide-react'
import {
  ADMIN_STATUS_META,
  LEVEL_META,
  LevelKey,
  USER_ROLE_META,
} from '@/features/(authenticated)/system/admins/schema'
import clsx from 'clsx'

export const adminColumns = [
  {
    header: '메일',
    accessorKey: 'email',
    meta: { width: '25%' },
  } as ColumnDef<ADMINS_TABLE['Row'], unknown>,
  {
    header: '이름',
    accessorKey: 'name',
    meta: { width: '15%' },
  } as ColumnDef<ADMINS_TABLE['Row'], unknown>,
  {
    header: '상태',
    accessorKey: 'status',
    meta: { width: '10%' },
    cell: ({ row }) => {
      const key = row.original.status as keyof typeof ADMIN_STATUS_META
      const meta = ADMIN_STATUS_META[key]
      return meta ? (
        <MetaBadge icon={meta.icon} label={meta.label} className={meta.className} />
      ) : (
        '-'
      )
    },
  } as ColumnDef<ADMINS_TABLE['Row'], unknown>,
  {
    header: '레벨',
    accessorKey: 'level',
    meta: { width: '15%' },
    cell: ({ row }) => {
      const lv = Number(row.original.level) as LevelKey
      const meta = LEVEL_META[lv]
      return meta ? meta.label : row.original.role
    },
  } as ColumnDef<ADMINS_TABLE['Row'], unknown>,
  {
    header: '역할',
    accessorKey: 'role',
    meta: { width: '15%' },
    cell: ({ row }) => {
      const key = row.original.role as keyof typeof USER_ROLE_META
      const meta = USER_ROLE_META[key]
      return meta ? meta.label : row.original.role
    },
  } as ColumnDef<ADMINS_TABLE['Row'], unknown>,
  {
    header: '마지막 로그인',
    accessorKey: 'last_login',
    meta: { width: '20%' },
    cell: ({ row }) => (row.original.last_login === null ? '-' : row.original.last_login),
  } as ColumnDef<ADMINS_TABLE['Row'], unknown>,
] satisfies ColumnDef<ADMINS_TABLE['Row'], unknown>[]

function MetaBadge({
  icon: Icon,
  label,
  className,
}: {
  icon: LucideIcon
  label: string
  className: string
}) {
  return (
    <div className={clsx('flex items-center justify-center gap-1.5', className)}>
      <Icon className="size-4" />
      <span className="text-left">{label}</span>
    </div>
  )
}
