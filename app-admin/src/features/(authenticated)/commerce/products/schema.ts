import z from 'zod'

export const productSchema = z.object({
  name: z.string().min(1, '상품명을 입력해 주세요.'),
  price: z.coerce.number().int().nonnegative('0 이상이어야 합니다.'),
})
