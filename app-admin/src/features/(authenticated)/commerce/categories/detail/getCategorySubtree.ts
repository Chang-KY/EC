'use server'

import { supabase } from '@/utils/supabase/supabase'
import {
  CategoryNode,
  Row,
} from '@/features/(authenticated)/commerce/categories/types/CategoryNode'

function buildTree(rows: Row[], rootId: number): CategoryNode | null {
  if (!rows.length) return null

  rows = [...rows].sort((a, b) => a.rel_depth - b.rel_depth || a.name.localeCompare(b.name))

  const byId = new Map<number, CategoryNode>()
  rows.forEach((r) => {
    byId.set(r.id, { id: r.id, name: r.name, slug: r.slug, parent_id: r.parent_id, children: [] })
  })

  let root: CategoryNode | null = null
  rows.forEach((r) => {
    const me = byId.get(r.id)!
    if (r.id === rootId || r.parent_id == null) {
      // 루트 후보: 요청 id와 일치하면 루트
      if (r.id === rootId) root = me
    }
    if (r.parent_id != null) {
      const parent = byId.get(r.parent_id)
      if (parent) parent.children.push(me)
    }
  })

  // 혹시 모를 루트 null 방지: 못 찾았으면 rows[0]을 루트로
  return root ?? byId.get(rootId) ?? (rows.length ? byId.get(rows[0].id)! : null)
}

export async function getCategorySubtree(id: number) {
  const sb = await supabase()
  const { data, error } = await sb.schema('ec').rpc('get_category_subtree', { _id: id })

  if (error) throw error
  const rows = (data ?? []) as Row[]
  const tree = buildTree(rows, id)
  return { rows, tree }
}
