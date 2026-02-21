'use client'

import { ColumnDef } from '@tanstack/react-table'
import { CATEGORIES_TABLE_VIEW } from '@/types/db'
import clsx from 'clsx'
import Link from 'next/link'
import { ROUTES } from '@/constants/routes'
import { makeBreadcrumbSegments } from '@/features/(authenticated)/commerce/categories/makeBreadcrumbSegments'
import { FALSE, TRUE } from '@/constants/booleanColor'

export const categoryColumns = [
  {
    header: '카테고리명',
    accessorKey: 'name',
    meta: { width: '15%' },
  } as ColumnDef<CATEGORIES_TABLE_VIEW, unknown>,

  {
    header: '슬러그',
    accessorKey: 'slug',
    meta: { width: '10%' },
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono text-xs">{row.original.slug}</span>
    ),
  } as ColumnDef<CATEGORIES_TABLE_VIEW, unknown>,
  {
    header: '뎁스',
    accessorKey: 'depth',
    meta: { width: '10%' },
    cell: ({ row }) => (
      <span className="tabular-nums">
        {row.original.depth ? `${row.original.depth} 계층` : '-'}
      </span>
    ),
  } as ColumnDef<CATEGORIES_TABLE_VIEW, unknown>,

  {
    header: '선택 가능',
    accessorKey: 'selectable',
    meta: { width: '10%' },
    cell: ({ row }) => {
      const v = row.original.selectable
      if (v == null) return '-'
      return (
        <span
          className={clsx(
            'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
            v ? TRUE : FALSE,
          )}
        >
          {v ? '가능' : '불가'}
        </span>
      )
    },
  } as ColumnDef<CATEGORIES_TABLE_VIEW, unknown>,

  {
    header: '부모',
    accessorKey: 'parent_id',
    meta: { width: '15%' },
    cell: ({ row }) => {
      const pid = row.original.parent_id
      const pname = row.original.parent_name

      if (!pid) return <span className="text-muted-foreground">-</span>

      return (
        <button className="text-muted-foreground tabular-nums">
          {pname ?? '부모'} <span className="text-xs">( {pid} )</span>
        </button>
      )
    },
  } as ColumnDef<CATEGORIES_TABLE_VIEW, unknown>,
  {
    header: '경로',
    accessorKey: 'path', // 정렬/필터 기준용
    meta: { width: '40%' },
    cell: ({ row }) => {
      const segments = makeBreadcrumbSegments(row.original)

      if (segments.length === 0) {
        return <span className="text-muted-foreground">-</span>
      }

      return (
        <div className="flex min-w-0 flex-wrap items-center gap-1">
          {segments.map((seg, idx) => (
            <div key={`${seg.id}-${idx}`} className="flex min-w-0 items-center gap-1">
              <Link
                href={`${ROUTES.CATEGORIES}/${seg.id}`}
                className="group inline-flex min-w-0 items-center gap-1 rounded-md border border-transparent px-1.5 py-0.5 text-xs font-medium text-gray-700 hover:border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                title={`${seg.name} (${seg.id})`}
              >
                <span className="min-w-0 truncate">{seg.name}</span>
                <span className="shrink-0 text-[11px] text-gray-400 tabular-nums group-hover:text-gray-700">
                  ( {seg.id} )
                </span>
              </Link>

              {idx < segments.length - 1 && (
                <span className="shrink-0 text-[11px] text-gray-300">{'>'}</span>
              )}
            </div>
          ))}
        </div>
      )
    },
  } as ColumnDef<CATEGORIES_TABLE_VIEW, unknown>,
] satisfies ColumnDef<CATEGORIES_TABLE_VIEW, unknown>[]
