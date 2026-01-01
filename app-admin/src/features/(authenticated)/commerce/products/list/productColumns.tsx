import { ColumnDef } from '@tanstack/react-table'
import { PRODUCTS_TABLE } from '@/types/db'

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
  } as ColumnDef<PRODUCTS_TABLE['Row'], unknown>,
  {
    header: '정가',
    accessorKey: 'price',
    meta: { width: '10%' },
  } as ColumnDef<PRODUCTS_TABLE['Row'], unknown>,
  {
    header: '할인(%)',
    accessorKey: 'sale_rate',
    meta: { width: '15%' },
  } as ColumnDef<PRODUCTS_TABLE['Row'], unknown>,
  {
    header: '할인(₩)',
    accessorKey: 'sale_price',
    meta: { width: '15%' },
  } as ColumnDef<PRODUCTS_TABLE['Row'], unknown>,
  {
    header: '재고',
    accessorKey: 'stock',
    meta: { width: '15%' },
  } as ColumnDef<PRODUCTS_TABLE['Row'], unknown>,
  {
    header: '좋아요',
    accessorKey: 'likes',
    meta: { width: '20%' },
  } as ColumnDef<PRODUCTS_TABLE['Row'], unknown>,
] satisfies ColumnDef<PRODUCTS_TABLE['Row'], unknown>[]
