import { supabase } from '@/utils/supabase/supabase'

export async function GET(req: Request) {
  const sb = await supabase()

  const { searchParams } = new URL(req.url)

  const page = Number(searchParams.get('page') ?? 1)
  const size = Number(searchParams.get('size') ?? 10)
  const keyword = searchParams.get('keyword') ?? ''
  const order = (searchParams.get('order') ?? 'desc') as 'asc' | 'desc'
  const orderBy = searchParams.get('orderBy') ?? 'id'

  const from = (page - 1) * size
  const to = from + size - 1

  let q = sb
    .schema('ec')
    .from('admins')
    .select('*', { count: 'exact' })
    .range(from, to)
    .order(orderBy, { ascending: order === 'asc' })

  if (keyword.trim()) {
    const k = keyword.trim()
    q = q.or(`name.ilike.%${k}%,email.ilike.%${k}%`)
  }

  const { data, error, count } = await q

  if (error) {
    console.error('[GET /api/system/admins] error:', error)
    return new Response('Failed to fetch admins', { status: 500 })
  }

  return Response.json({
    items: data ?? [],
    total: count ?? 0,
    page,
    size,
  })
}
