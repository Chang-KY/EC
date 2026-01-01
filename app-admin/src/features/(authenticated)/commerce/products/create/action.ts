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

  try {
    const sb = await supabase()

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
      return {
        ...prev,
        fieldErrors: { _form: [productErr?.message ?? '상품 생성 실패'] },
        success: false,
      }
    }
    const productId = productRow.id as number
    const BUCKET = process.env.NEXT_PUBLIC_PRODUCT_BUCKET!
    const baseDir = `products/${productId}`

    const thumbRes = await uploadRetry([thumbFile], BUCKET, `${baseDir}/thumbnail`, uploadFile, {
      retries: 2,
    })
    if (thumbRes.failed.length) {
      return {
        ...prev,
        values: { ...prev.values, products: productsParsed.data },
        fieldErrors: { 'images.thumbnail': [thumbRes.failed[0]!.message] },
        success: false,
      }
    }
    const thumbPath = thumbRes.ok[0]!.path

    const galleryRes = await uploadRetry(galleryFiles, BUCKET, `${baseDir}/gallery`, uploadFile, {
      retries: 2,
    })
    if (galleryRes.failed.length) {
      return {
        ...prev,
        values: { ...prev.values, products: productsParsed.data },
        fieldErrors: {
          'images.gallery': galleryRes.failed.map((f) => `${f.fileName} 업로드 실패: ${f.message}`),
        },
        success: false,
      }
    }
    const galleryPaths = galleryRes.ok.sort((a, b) => a.index - b.index).map((x) => x.path)

    const descRes = await uploadRetry(descFiles, BUCKET, `${baseDir}/description`, uploadFile, {
      retries: 2,
    })
    if (descRes.failed.length) {
      return {
        ...prev,
        values: { ...prev.values, products: productsParsed.data },
        fieldErrors: {
          'images.description': descRes.failed.map(
            (f) => `${f.fileName} 업로드 실패: ${f.message}`,
          ),
        },
        success: false,
      }
    }
    const descPaths = descRes.ok.sort((a, b) => a.index - b.index).map((x) => x.path)

    // 스키마가 기대하는 images 배열(메타데이터)로 변환 + 검증
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
      const { fieldErrors, formErrors } = z.flattenError(imagesParsed.error)
      return {
        ...prev,
        values: { ...prev.values },
        fieldErrors: { _form: formErrors.length ? formErrors : ['이미지 정보 검증 실패'] },
        success: false,
      }
    }

    const rows = imagesParsed.data.map((img) => ({
      product_id: productId,
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
      return {
        ...prev,
        values: { ...prev.values },
        fieldErrors: { _form: [imgErr.message] },
        success: false,
      }
    }
  } catch (e) {
    return {
      ...prev,
      values: { ...prev.values },
      fieldErrors: { _form: [e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다.'] },
      success: false,
    }
  }

  revalidatePath('/commerce/products')
  redirect('/commerce/products')
}
