export type CategoryNode = {
  id: number
  name: string
  slug: string
  parent_id: number | null
  children: CategoryNode[]
}
export type Row = {
  id: number
  name: string
  slug: string
  parent_id: number | null
  depth: number
  rel_depth: number
}