import { ColumnDef } from '@tanstack/react-table'
import { CATEGORIES_TABLE } from '@/types/db'

export const categoryColumns = [
  {
    header: '카테고리명',
    accessorKey: 'name',
    meta: { width: '26%' },
  } as ColumnDef<CATEGORIES_TABLE['Row'], unknown>,

  {
    header: '슬러그',
    accessorKey: 'slug',
    meta: { width: '18%' },
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono text-xs">{row.original.slug}</span>
    ),
  } as ColumnDef<CATEGORIES_TABLE['Row'], unknown>,
  {
    header: '뎁스',
    accessorKey: 'depth',
    meta: { width: '8%' },
    cell: ({ row }) => (
      <span className="tabular-nums">
        {row.original.depth ? `${row.original.depth} 계층` : '-'}
      </span>
    ),
  } as ColumnDef<CATEGORIES_TABLE['Row'], unknown>,

  {
    header: '선택 가능',
    accessorKey: 'selectable',
    meta: { width: '12%' },
    cell: ({ row }) => {
      const v = row.original.selectable
      if (v == null) return '-'
      return (
        <span
          className={[
            'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
            v
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
              : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
          ].join(' ')}
        >
          {v ? '가능' : '불가'}
        </span>
      )
    },
  } as ColumnDef<CATEGORIES_TABLE['Row'], unknown>,

  {
    header: '부모 ID',
    accessorKey: 'parent_id',
    meta: { width: '10%' },
    cell: ({ row }) => (
      <span className="text-muted-foreground tabular-nums">{row.original.parent_id ?? '-'}</span>
    ),
  } as ColumnDef<CATEGORIES_TABLE['Row'], unknown>,

  {
    header: '경로(path)',
    accessorKey: 'path',
    meta: { width: '26%' },
    cell: ({ row }) => {
      const p = row.original.path
      if (!p) return '-'
      return <span className="text-muted-foreground font-mono text-xs">{String(p)}</span>
    },
  } as ColumnDef<CATEGORIES_TABLE['Row'], unknown>,
] satisfies ColumnDef<CATEGORIES_TABLE['Row'], unknown>[]
