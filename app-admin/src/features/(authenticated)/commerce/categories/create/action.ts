'use server'

import { supabase } from '@/utils/supabase/supabase'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { FormState } from '@/types/FormState'
import {
  CreateCategorySchema,
  type CategoriesCreateFormValues,
} from '@/features/(authenticated)/commerce/categories/create/schema'
import { z } from 'zod'

function toStr(v: FormDataEntryValue | null) {
  return typeof v === 'string' ? v : ''
}

function toNullablePositiveInt(v: FormDataEntryValue | null) {
  const s = typeof v === 'string' ? v.trim() : ''
  if (!s) return null
  const n = Number(s)
  if (!Number.isFinite(n) || n <= 0 || !Number.isInteger(n)) return null
  return n
}

function toBool(v: FormDataEntryValue | null) {
  if (v === 'true') return true
  if (v === 'false') return false

  if (v === 'on') return true
  if (typeof v === 'boolean') return v

  return false
}

export async function categoryCreateAction(
  prev: FormState<CategoriesCreateFormValues>,
  formData: FormData,
): Promise<FormState<CategoriesCreateFormValues>> {
  // 1) FormData → Draft(타입 정리)
  const categoriesDraft = {
    name: toStr(formData.get('name')),
    slug: toStr(formData.get('slug')),
    parent_id: toNullablePositiveInt(formData.get('parent_id')),
    selectable: toBool(formData.get('selectable')),
  }

  // 2) Zod 검증
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
    const { data, error } = await sb
      .schema('ec')
      .from('categories')
      .insert({
        name: parsed.data.name,
        slug: parsed.data.slug, // schema에서 필수니까 null로 만들지 말기
        parent_id: parsed.data.parent_id ?? null,
        selectable: parsed.data.selectable ?? false,
      })
      .select('id')
      .single()

    if (error) {
      // 3) Supabase/PG 에러 → 필드 에러로 매핑(유니크 충돌 등)
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
