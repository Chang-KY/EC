export type paginationOptions<Row> = {
  page: number
  size: number
  keyword: string
  orderBy: keyof Row
  order: 'asc' | 'desc'
}
