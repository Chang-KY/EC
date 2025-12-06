import { productSchema } from '@/features/(authenticated)/products/schema'

export async function createProductAction(formData: FormData) {
  const raw = {
    name: formData.get('name'),
    price: formData.get('price'),
  }

  const parsed = productSchema.safeParse(raw)
  if (!parsed.success) {
    // 일단은 간단 버전: 그냥 에러 던지기
    console.error(parsed.error.flatten())
    throw new Error('입력 값이 올바르지 않다.')
  }

  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('로그인이 필요하다.')
  }

  const { error } = await supabase.from('products').insert({
    name: parsed.data.name,
    price: parsed.data.price,
    owner_id: user.id,
  })

  if (error) throw error
}
