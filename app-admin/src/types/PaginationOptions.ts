export type paginationOptions<T> = {
  page?: number
  size?: number
  keyword?: string
  orderBy?: keyof T
  order?: 'asc' | 'desc'
}
