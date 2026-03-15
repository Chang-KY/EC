'use server'

import { SCROLL_PAGE } from '@/constants/page/PAGE_SIZE_LIST'
import { supabase } from '@/utils/supabase/supabase'
import { PRODUCT_IMAGES_TABLE, PRODUCTS_TABLE } from '@/types/db'
import { PageParams } from '@/types/ScrollPageParams'

type ProductThumbnail = Partial<PRODUCT_IMAGES_TABLE['Row']>
type ProductListItem = PRODUCTS_TABLE['Row'] & {
  thumbnail: ProductThumbnail | null
}
type ProductsPage = {
  items: ProductListItem[]
  nextPage: number | undefined
}

export async function getProductsPage({
  pageParam = 0,
  keyword = '',
}: PageParams): Promise<ProductsPage> {
  const sb = await supabase()
  const from = pageParam * SCROLL_PAGE
  const to = from + SCROLL_PAGE - 1

  let productQuery = sb
    .schema('ec')
    .from('products')
    .select('*')
    .order('id', { ascending: false })
    .range(from, to)

  if (keyword.trim()) {
    productQuery = productQuery.ilike('name', `%${keyword.trim()}%`)
  }

  const { data: products, error: productError } = await productQuery

  if (productError) throw new Error(productError.message)

  const productIds = (products ?? []).map((p) => p.id)

  const thumbnailMap = new Map<number, ProductThumbnail>()

  if (productIds.length > 0) {
    const { data: images, error: imageError } = await sb
      .schema('ec')
      .from('product_images')
      .select('*')
      .in('product_id', productIds)
      .eq('role', 'thumbnail')
      .order('product_id', { ascending: true })
      .order('sort_order', { ascending: true })

    if (imageError) {
      throw new Error(imageError.message)
    }

    for (const image of images ?? []) {
      if (!thumbnailMap.has(image.product_id)) {
        thumbnailMap.set(image.product_id, {
          id: image.id,
          storage_path: image.storage_path,
          alt: image.alt,
          width: image.width,
          height: image.height,
          mime_type: image.mime_type,
        })
      }
    }
  }

  const items: ProductListItem[] = (products ?? []).map((product) => ({
    ...product,
    thumbnail: thumbnailMap.get(product.id) ?? null,
  }))

  return {
    items,
    nextPage: items.length < SCROLL_PAGE ? undefined : pageParam + 1,
  }
}
