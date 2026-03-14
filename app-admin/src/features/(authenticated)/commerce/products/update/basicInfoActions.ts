'use server'

import { ROUTES } from '@/constants/routes'
import { revalidatePath } from 'next/cache'
import { supabase } from '@/utils/supabase/supabase'
import {
  productsUpdateSchema,
  ProductUpdateFormValue,
} from '@/features/(authenticated)/commerce/products/update/schema'

async function updateProduct(productId?: number, patch?: ProductUpdateFormValue) {
  if (!productId) return { ok: false as const, message: 'Invalid product ID' }
  if (!patch || Object.keys(patch).length === 0)
    return { ok: false as const, message: 'No fields to update' }

  const sb = await supabase()
  const { error } = await sb.schema('ec').from('products').update(patch).eq('id', productId)
  if (error) return { ok: false as const, message: error.message }

  revalidatePath(`${ROUTES.PRODUCTS}/${productId}`)
  return { ok: true as const }
}

export async function productUpdateNameAction(data: ProductUpdateFormValue) {
  const { id: productId, name } = productsUpdateSchema.parse(data)
  return updateProduct(productId, { name })
}

export async function productUpdateDescriptionAction(data: ProductUpdateFormValue) {
  const { id: productId, description } = productsUpdateSchema.parse(data)
  return updateProduct(productId, { description })
}

export async function productUpdatePriceAction(data: ProductUpdateFormValue) {
  const { id: productId, price } = productsUpdateSchema.parse(data)
  return updateProduct(productId, { price })
}

export async function productUpdateStockAction(data: ProductUpdateFormValue) {
  const { id: productId, stock } = productsUpdateSchema.parse(data)
  return updateProduct(productId, { stock })
}

export async function productUpdateStatusAction(data: ProductUpdateFormValue) {
  const { id: productId, status } = productsUpdateSchema.parse(data)
  return updateProduct(productId, { status })
}
