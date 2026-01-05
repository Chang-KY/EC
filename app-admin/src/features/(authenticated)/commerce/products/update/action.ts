'use server'

import 'server-only'
import type { FormState } from '@/types/FormState'
import {
  productsUpdateSchema,
  ProductUpdateUpdateFormValue,
} from '@/features/(authenticated)/commerce/products/update/schema'
import { z } from 'zod'
import { supabase } from '@/utils/supabase/supabase'
import { revalidatePath } from 'next/cache'
import { ROUTES } from '@/constants/routes'

export async function productUpdateAction(
  productId: number,
  prev: FormState<ProductUpdateUpdateFormValue>,
  formData: FormData,
): Promise<FormState<ProductUpdateUpdateFormValue>> {
  const productsDraft = {
    price: formData.get('products.price') ?? 0,
    discount_type: formData.get('products.discount_type') ?? 'none',
    sale_price: formData.get('products.sale_price') ?? undefined,
    sale_rate: formData.get('products.sale_rate') ?? undefined,
  }

  const productsParsed = productsUpdateSchema.safeParse(productsDraft)
  if (!productsParsed.success) {
    const { fieldErrors, formErrors } = z.flattenError(productsParsed.error)
    const prefixed = Object.fromEntries(
      Object.entries(fieldErrors).map(([k, v]) => [`products.${k}`, v]),
    )

    return {
      ...prev,
      values: {
        ...prev.values,
        products: productsDraft,
      } as Partial<ProductUpdateUpdateFormValue>,
      fieldErrors: { ...prefixed, _form: formErrors },
      success: false,
    }
  }

  const patch = productsParsed.data

  const sb = await supabase()
  const { error } = await sb.schema('ec').from('products').update(patch).eq('id', productId)
  if (error) {
    return {
      ...prev,
      values: { ...prev.values, products: productsDraft } as Partial<ProductUpdateUpdateFormValue>,
      fieldErrors: { _form: [error.message] },
      success: false,
    }
  }

  revalidatePath(`${ROUTES.PRODUCTS}/${productId}`)

  return {
    ...prev,
    values: { ...prev.values, products: patch } as Partial<ProductUpdateUpdateFormValue>,
    fieldErrors: {},
    success: true,
  }
}
