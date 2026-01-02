'use server'

import { supabase } from '@/utils/supabase/supabase'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { FormState } from '@/types/FormState'
import { z } from 'zod'
import {
  ProductCreateFormValues,
  productImagesCreateSchema,
  productsSchema,
} from '@/features/(authenticated)/commerce/products/create/schema'
import { isFile } from '@/utils/isFile'
import { uploadFile } from '@/utils/uploadFile'
import { uploadRetry } from '@/utils/uploadRetry'
import { ProductImageRole } from '@/types/enum'

export async function productCreateAction(
  prev: FormState<ProductCreateFormValues>,
  formData: FormData,
): Promise<FormState<ProductCreateFormValues>> {
  const productsDraft = {
    name: formData.get('products.name') ?? '',
    description: formData.get('products.description') ?? '',
    price: formData.get('products.price') ?? 0,
    discount_type: formData.get('products.discount_type') ?? 'none',
    sale_price: formData.get('products.sale_price') ?? undefined,
    sale_rate: formData.get('products.sale_rate') ?? undefined,
    stock: formData.get('products.stock') ?? 0,
    status: formData.get('products.status') ?? 'hidden',
  }

  const productsParsed = productsSchema.safeParse(productsDraft)
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
      } as Partial<ProductCreateFormValues>,
      fieldErrors: { ...prefixed, _form: formErrors },
      success: false,
    }
  }

  const thumb = formData.get('images.thumbnail')
  const thumbFile = isFile(thumb) ? thumb : null
  const galleryFiles = formData.getAll('images.gallery').filter((v): v is File => isFile(v))
  const descFiles = formData.getAll('images.description').filter((v): v is File => isFile(v))

  if (!thumbFile) {
    return {
      ...prev,
      values: { ...prev.values, products: productsParsed.data },
      fieldErrors: { 'images.thumbnail': ['썸네일 이미지는 최소 1개 필요합니다.'] },
      success: false,
    }
  }

  const thumbAlt = String(formData.get('images.thumbnail.alt') ?? '')
  const galleryAlts = formData.getAll('images.gallery.alt').map((v) => String(v ?? ''))
  const descAlts = formData.getAll('images.description.alt').map((v) => String(v ?? ''))

  const BUCKET = process.env.NEXT_PUBLIC_PRODUCT_BUCKET!
  const sb = await supabase()

  let productId: number | null = null
  const uploadedPaths: string[] = []
  let committed = false

  // fail 상태를 catch에서 그대로 반환하기 위한 트릭
  let failState: FormState<ProductCreateFormValues> | null = null
  const fail = (state: FormState<ProductCreateFormValues>) => {
    failState = state
    throw new Error('__FORM_FAIL__')
  }

  try {
    // 1) products insert
    const { data: productRow, error: productErr } = await sb
      .schema('ec')
      .from('products')
      .insert({
        name: productsParsed.data.name,
        description: productsParsed.data.description || null,
        price: productsParsed.data.price,
        discount_type: productsParsed.data.discount_type,
        sale_price: productsParsed.data.sale_price ?? null,
        sale_rate: productsParsed.data.sale_rate ?? null,
        stock: productsParsed.data.stock ?? null,
        status: productsParsed.data.status,
      })
      .select('id')
      .single()

    if (productErr || !productRow) {
      fail({
        ...prev,
        values: { ...prev.values, products: productsParsed.data },
        fieldErrors: { _form: [productErr?.message ?? '상품 생성 실패'] },
        success: false,
      })
    }

    productId = productRow?.id as number
    const baseDir = `products/${productId}`

    // 2) thumbnail upload
    const thumbRes = await uploadRetry([thumbFile], BUCKET, `${baseDir}/thumbnail`, uploadFile, {
      retries: 2,
    })
    uploadedPaths.push(...thumbRes.ok.map((x) => x.path)) // 실패하더라도 성공한 건 기록

    if (thumbRes.failed.length) {
      fail({
        ...prev,
        values: { ...prev.values, products: productsParsed.data },
        fieldErrors: { 'images.thumbnail': [thumbRes.failed[0]!.message] },
        success: false,
      })
    }
    const thumbPath = thumbRes.ok[0]!.path

    // 3) gallery upload
    const galleryRes = await uploadRetry(galleryFiles, BUCKET, `${baseDir}/gallery`, uploadFile, {
      retries: 2,
    })
    uploadedPaths.push(...galleryRes.ok.map((x) => x.path)) // 일부 성공했을 수도 있음

    if (galleryRes.failed.length) {
      fail({
        ...prev,
        values: { ...prev.values, products: productsParsed.data },
        fieldErrors: {
          'images.gallery': galleryRes.failed.map((f) => `${f.fileName} 업로드 실패: ${f.message}`),
        },
        success: false,
      })
    }
    const galleryOkSorted = galleryRes.ok.sort((a, b) => a.index - b.index)
    const galleryPaths = galleryOkSorted.map((x) => x.path)

    // 4) description upload
    const descRes = await uploadRetry(descFiles, BUCKET, `${baseDir}/description`, uploadFile, {
      retries: 2,
    })
    uploadedPaths.push(...descRes.ok.map((x) => x.path))

    if (descRes.failed.length) {
      fail({
        ...prev,
        values: { ...prev.values, products: productsParsed.data },
        fieldErrors: {
          'images.description': descRes.failed.map(
            (f) => `${f.fileName} 업로드 실패: ${f.message}`,
          ),
        },
        success: false,
      })
    }
    const descOkSorted = descRes.ok.sort((a, b) => a.index - b.index)
    const descPaths = descOkSorted.map((x) => x.path)

    // 5) images metadata draft + validate
    const imagesDraft = [
      {
        role: 'thumbnail',
        storage_path: thumbPath,
        sort_order: 0,
        alt: thumbAlt,
        mime_type: thumbFile.type,
      },
      ...galleryPaths.map((p, i) => ({
        role: 'gallery',
        storage_path: p,
        sort_order: i,
        alt: galleryAlts[i] ?? '',
        mime_type: galleryFiles[i]?.type,
      })),
      ...descPaths.map((p, i) => ({
        role: 'description',
        storage_path: p,
        sort_order: i,
        alt: descAlts[i] ?? '',
        mime_type: descFiles[i]?.type,
      })),
    ]

    const imagesParsed = productImagesCreateSchema.safeParse(imagesDraft)
    if (!imagesParsed.success) {
      const { formErrors } = z.flattenError(imagesParsed.error)
      fail({
        ...prev,
        values: { ...prev.values, products: productsParsed.data },
        fieldErrors: { _form: formErrors.length ? formErrors : ['이미지 정보 검증 실패'] },
        success: false,
      })
    }

    // 6) product_images insert
    if (imagesParsed.data) {
      const rows = imagesParsed.data.map((img) => ({
        product_id: productId!,
        role: img.role as ProductImageRole,
        storage_path: img.storage_path,
        sort_order: img.sort_order ?? 0,
        alt: img.alt ?? null,
        mime_type: img.mime_type ?? null,
        width: img.width ?? null,
        height: img.height ?? null,
      }))

      const { error: imgErr } = await sb.schema('ec').from('product_images').insert(rows)

      if (imgErr) {
        fail({
          ...prev,
          values: { ...prev.values, products: productsParsed.data },
          fieldErrors: { _form: [imgErr.message] },
          success: false,
        })
      }

      committed = true
    }
  } catch (e) {
    // 여기서는 cleanup 안 함 (finally에서 처리)
    if (failState) return failState

    return {
      ...prev,
      values: { ...prev.values, products: productsParsed.data },
      fieldErrors: { _form: [e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다.'] },
      success: false,
    }
  } finally {
    // 실패했으면 무조건 productId 삭제 + 업로드된 파일도 best-effort 제거
    if (!committed && productId) {
      // storage cleanup (best-effort)
      try {
        if (uploadedPaths.length) {
          await sb.storage.from(BUCKET).remove(uploadedPaths)
        }
      } catch {}

      // db cleanup (best-effort)
      try {
        await sb.schema('ec').from('products').delete().eq('id', productId)
      } catch {}
    }
  }

  revalidatePath('/commerce/products')
  redirect('/commerce/products')
}
