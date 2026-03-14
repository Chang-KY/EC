'use client'

import { ColumnDef } from '@tanstack/react-table'
import { COUPONS_TABLE } from '@/types/db'
import clsx from 'clsx'
import { FALSE, TRUE } from '@/constants/booleanColor'
import { formatDiscountValue, getDiscountTypeMeta } from '@/utils/discountTypeMeta'
import { dateTimeFormat } from '@/utils/DateTimeFormat'

export const couponColumns = [
  {
    header: '쿠폰 명',
    accessorKey: 'name',
    meta: { width: '15%' },
  } as ColumnDef<COUPONS_TABLE['Row'], unknown>,

  {
    header: '타입',
    accessorKey: 'discount_type',
    meta: { width: '10%' },
    cell: ({ row }) => {
      const meta = getDiscountTypeMeta(row.original.discount_type)
      return <span className={clsx(meta.className)}>{meta.label}</span>
    },
  } as ColumnDef<COUPONS_TABLE['Row'], unknown>,
  {
    header: '할인',
    accessorKey: 'discount_value',
    meta: { width: '15%' },
    cell: ({ row }) => {
      const text = formatDiscountValue(row.original.discount_type, row.original.discount_value)

      return <span className="text-gray-900 dark:text-gray-100">{text}</span>
    },
  } as ColumnDef<COUPONS_TABLE['Row'], unknown>,
  {
    header: '활성 여부',
    accessorKey: 'is_active',
    meta: { width: '10%' },
    cell: ({ row }) => {
      const v = row.original.is_active
      return (
        <span
          className={clsx(
            'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
            v ? TRUE : FALSE,
          )}
        >
          {v ? '활성' : '비활성'}
        </span>
      )
    },
  } as ColumnDef<COUPONS_TABLE['Row'], unknown>,

  {
    header: '시작 일시',
    accessorKey: 'starts_at',
    meta: { width: '25%' },
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground tabular-nums">
          {dateTimeFormat(row.original.starts_at, 'datetime')}
        </span>
      )
    },
  } as ColumnDef<COUPONS_TABLE['Row'], unknown>,
  {
    header: '종료 일시',
    accessorKey: 'ends_at', // 정렬/필터 기준용
    meta: { width: '25%' },
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground tabular-nums">
          {dateTimeFormat(row.original.ends_at, 'datetime')}
        </span>
      )
    },
  } as ColumnDef<COUPONS_TABLE['Row'], unknown>,
] satisfies ColumnDef<COUPONS_TABLE['Row'], unknown>[]
