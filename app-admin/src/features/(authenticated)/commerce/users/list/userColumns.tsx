'use client'

import { ColumnDef } from '@tanstack/react-table'
import { USERS_TABLE } from '@/types/db'
import { dateTimeFormat } from '@/utils/DateTimeFormat'
import { UserRound } from 'lucide-react'

export const userColumns = [
  {
    header: '이미지',
    accessorKey: 'avatar_url',
    meta: { width: '5%' },
    cell: ({ row }) => {
      const url = row.original.avatar_url

      return (
        <div className="flex items-center justify-start">
          <div className="rounded-full border border-gray-300 p-0.5">
            {url ? (
              <img
                src={url}
                alt="avatar"
                className="h-9 w-9 rounded-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // 이미지 깨지면 아이콘으로 fallback
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.parentElement?.appendChild(
                    Object.assign(document.createElement('span'), { innerHTML: '' }),
                  )
                }}
              />
            ) : (
              <UserRound className="size-4.5 text-slate-400" />
            )}
          </div>
        </div>
      )
    },
  } as ColumnDef<USERS_TABLE['Row'], unknown>,

  {
    header: '유저 ID',
    accessorKey: 'id',
    meta: { width: '25%' },
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono text-xs">{row.original.id}</span>
    ),
  } as ColumnDef<USERS_TABLE['Row'], unknown>,
  {
    header: '이메일',
    accessorKey: 'email',
    meta: { width: '35%' },
  } as ColumnDef<USERS_TABLE['Row'], unknown>,

  {
    header: '유저 명',
    accessorKey: 'name',
    meta: { width: '15%' },
  } as ColumnDef<USERS_TABLE['Row'], unknown>,
  {
    header: '가입 일',
    accessorKey: 'created_at',
    meta: { width: '20%' },
    cell: ({ row }) => dateTimeFormat(row.original.created_at, 'date'),
  } as ColumnDef<USERS_TABLE['Row'], unknown>,
] satisfies ColumnDef<USERS_TABLE['Row'], unknown>[]
