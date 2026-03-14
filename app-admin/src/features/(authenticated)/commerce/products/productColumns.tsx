import { ColumnDef } from '@tanstack/react-table'
import { PRODUCTS_TABLE } from '@/types/db'
import { formatNumberWithComma } from '@/utils/formatNumberWithComma'
import { ProductStatus } from '@/types/enum'
import { PRODUCT_STATUS_META } from '@/features/(authenticated)/commerce/products/productsSchema'
import { formatDiscountValue, getDiscountTypeMeta } from '@/utils/discountTypeMeta'
import clsx from 'clsx'
import { getDiscountEffectText } from '@/features/(authenticated)/commerce/products/getDiscountEffectText'

export const productColumns = [
  {
    header: '상품명',
    accessorKey: 'name',
    meta: { width: '25%' },
  } as ColumnDef<PRODUCTS_TABLE['Row'], unknown>,
  {
    header: '상태',
    accessorKey: 'status',
    meta: { width: '15%' },
    cell: ({ row }) => {
      const status = row.original.status as ProductStatus
      const meta = PRODUCT_STATUS_META[status]
      const Icon = meta.icon

      return (
        <span className={`inline-flex items-center gap-2 ${meta.className}`}>
          <Icon size={12} />
          <span>{meta.label}</span>
        </span>
      )
    },
  } as ColumnDef<PRODUCTS_TABLE['Row'], unknown>,
  {
    header: '정가',
    accessorKey: 'price',
    meta: { width: '10%' },
    cell: ({ row }) => `${formatNumberWithComma(row.original.price)} ₩`,
  } as ColumnDef<PRODUCTS_TABLE['Row'], unknown>,
  {
    header: '할인 타입',
    accessorKey: 'discount_type',
    meta: { width: '10%' },
    cell: ({ row }) => {
      const meta = getDiscountTypeMeta(row.original.discount_type)
      return (
        <span className="inline-flex items-center gap-1">
          {meta.Icon && <meta.Icon className={clsx('size-3.5', meta.className)} />}
          <span className={clsx(meta.className)}>{meta.label}</span>
        </span>
      )
    },
  } as ColumnDef<PRODUCTS_TABLE['Row'], unknown>,
  {
    header: '할인',
    accessorKey: 'discount_value',
    meta: { width: '10%' },
    cell: ({ row }) => {
      const text = formatDiscountValue(row.original.discount_type, row.original.discount_value)

      return <span className="text-gray-900 dark:text-gray-100">{text}</span>
    },
  } as ColumnDef<PRODUCTS_TABLE['Row'], unknown>,
  {
    header: '실 가격',
    accessorKey: 'final_price',
    meta: { width: '10%' },
    cell: ({ row }) => {
      const text = getDiscountEffectText({
        price: row.original.price,
        discountTypeKey: row.original.discount_type,
        discountValue: row.original.discount_value,
      })

      return <span className="text-gray-900 dark:text-gray-100">{text}</span>
    },
  } as ColumnDef<PRODUCTS_TABLE['Row'], unknown>,
  {
    header: '재고',
    accessorKey: 'stock',
    meta: { width: '15%' },
  } as ColumnDef<PRODUCTS_TABLE['Row'], unknown>,
] satisfies ColumnDef<PRODUCTS_TABLE['Row'], unknown>[]
