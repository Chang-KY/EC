import { supabase } from '@/utils/supabase/supabase'
import { Database } from '@/supabase.types'

type DB = Database['ec']['Tables']
type TableName = keyof DB & string
type ColumnKey<T extends TableName> = Extract<keyof DB[T]['Row'], string>

type Primitive = string | number | boolean | null

type FilterableColumnKey<T extends TableName> = {
  [K in ColumnKey<T>]: DB[T]['Row'][K] extends Primitive ? K : never
}[ColumnKey<T>]

export async function fetchRowByColumn<
  T extends TableName,
  C extends FilterableColumnKey<T>,
  K extends ColumnKey<T>,
>(
  table: T,
  column: C,
  value: DB[T]['Row'][C],
  columns: readonly K[],
): Promise<Pick<DB[T]['Row'], K> | null> {
  if (!columns.length) throw new Error('columns must not be empty')

  const sb = await supabase()
  const projection = columns.join(',')

  const { data, error } = await sb
    .schema('ec')
    .from(table)
    .select(projection)
    .eq(column, value as never)
    .maybeSingle<Pick<DB[T]['Row'], K>>()

  if (error) throw error
  return data ?? null
}
