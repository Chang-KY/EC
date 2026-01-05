import { ColumnDef } from '@tanstack/react-table'
import { PRODUCTS_TABLE } from '@/types/db'
import { formatNumberWithComma } from '@/utils/formatNumberWithComma'
import { ProductStatus } from '@/types/enum'
import { PRODUCT_STATUS_META } from '@/features/(authenticated)/commerce/products/productsSchema'

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
    cell: ({ row }) => formatNumberWithComma(row.original.price),
  } as ColumnDef<PRODUCTS_TABLE['Row'], unknown>,
  {
    header: '할인(%)',
    accessorKey: 'sale_rate',
    meta: { width: '15%' },
    cell: ({ row }) => {
      const v = row.original.sale_rate
      if (v === null) return '-'

      return (
        <span className="inline-flex items-baseline gap-1">
          <span>{v.toLocaleString('ko-KR')}</span>
          <span className="text-[9px] text-gray-700">%</span>
        </span>
      )
    },
  } as ColumnDef<PRODUCTS_TABLE['Row'], unknown>,
  {
    header: '할인(₩)',
    accessorKey: 'sale_price',
    meta: { width: '15%' },
    cell: ({ row }) =>
      row.original.sale_price === null ? '-' : formatNumberWithComma(row.original.sale_price),
  } as ColumnDef<PRODUCTS_TABLE['Row'], unknown>,
  {
    header: '재고',
    accessorKey: 'stock',
    meta: { width: '15%' },
  } as ColumnDef<PRODUCTS_TABLE['Row'], unknown>,
] satisfies ColumnDef<PRODUCTS_TABLE['Row'], unknown>[]
