import { ColumnDef } from '@tanstack/react-table'
import { ADMINS_TABLE } from '@/types/db'
import { dateTimeFormat } from '@/utils/DateTimeFormat'

export const adminColumns = [
  {
    id: 'rowNumber',
    header: '',
    cell: ({ row }) => row.index + 1,
  },
  {
    header: '메일',
    accessorKey: 'email',
  } as ColumnDef<ADMINS_TABLE['Row'], unknown>,
  {
    header: '이름',
    accessorKey: 'name',
  } as ColumnDef<ADMINS_TABLE['Row'], unknown>,
  {
    header: '상태',
    accessorKey: 'status',
  } as ColumnDef<ADMINS_TABLE['Row'], unknown>,
  {
    header: '권한',
    accessorKey: 'permissions',
    cell: ({ row }) => {
      const perms = row.original.permissions as Record<string, unknown> | null

      const isEmptyObject =
        perms &&
        typeof perms === 'object' &&
        !Array.isArray(perms) &&
        Object.keys(perms).length === 0
      return isEmptyObject ? '-' : JSON.stringify(row.original.permissions)
    },
  } as ColumnDef<ADMINS_TABLE['Row'], unknown>,
  {
    header: '마지막 로그인',
    accessorKey: 'last_login',
    cell: ({ row }) => (row.original.last_login === null ? '-' : row.original.last_login),
  } as ColumnDef<ADMINS_TABLE['Row'], unknown>,
  {
    header: '역할',
    accessorKey: 'role',
    cell: ({ row }) => row.original.role,
  } as ColumnDef<ADMINS_TABLE['Row'], unknown>,
] satisfies ColumnDef<ADMINS_TABLE['Row'], unknown>[]
