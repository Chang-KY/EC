'use server'

import { supabase } from '@/utils/supabase/supabase'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { FormState } from '@/types/FormState'
import {
  CreateCategorySchema,
  type CategoriesCreateFormValues,
} from '@/features/(authenticated)/commerce/categories/create/createSchema'
import { z } from 'zod'
import { getBoolean, getNullableNumber, getString } from '@/utils/formdataType'

export async function categoryCreateAction(
  prev: FormState<CategoriesCreateFormValues>,
  formData: FormData,
): Promise<FormState<CategoriesCreateFormValues>> {
  const categoriesDraft = {
    name: getString(formData, 'name'),
    slug: getString(formData, 'slug'),
    parent_id: getNullableNumber(formData, 'parent_id'),
    selectable: getBoolean(formData, 'selectable'),
  }

  const parsed = CreateCategorySchema.safeParse(categoriesDraft)
  if (!parsed.success) {
    const { fieldErrors, formErrors } = z.flattenError(parsed.error)

    return {
      ...prev,
      values: { ...prev.values, ...categoriesDraft },
      fieldErrors: { ...fieldErrors, _form: formErrors },
      success: false,
    }
  }
  const sb = await supabase()

  try {
    const { error } = await sb
      .schema('ec')
      .from('categories')
      .insert(parsed.data)
      .select('id')
      .single()

    if (error) {
      // Supabase /PG 에러 → 필드 에러로 매핑(유니크 충돌 등)
      const msg = error.message ?? '카테고리 생성에 실패했습니다.'

      // 보통 unique 충돌은 Postgres code 23505
      const code = error.code as string | undefined
      const details = error.details as string | undefined

      if (code === '23505') {
        // 어떤 키가 터졌는지 details/constraint에 따라 메시지 분기 가능
        if (details?.includes('categories_slug_key')) {
          return {
            ...prev,
            values: { ...prev.values, ...parsed.data },
            fieldErrors: { slug: ['이미 사용 중인 슬러그입니다.'], _form: [] },
            success: false,
          }
        }
        if (details?.includes('categories_name_key')) {
          return {
            ...prev,
            values: { ...prev.values, ...parsed.data },
            fieldErrors: { name: ['이미 존재하는 카테고리명입니다.'], _form: [] },
            success: false,
          }
        }
      }

      return {
        ...prev,
        values: { ...prev.values, ...parsed.data },
        fieldErrors: { _form: [msg] },
        success: false,
      }
    }
  } catch (e) {
    return {
      ...prev,
      values: { ...prev.values, ...parsed.data },
      fieldErrors: {
        _form: [e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다.'],
      },
      success: false,
    }
  }

  revalidatePath('/commerce/categories')
  redirect('/commerce/categories')
}
