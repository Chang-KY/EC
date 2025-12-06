import React from 'react'
import { createProductAction } from '@/features/(authenticated)/products/actions'

const ProductForm = () => {
  return (
    <form action={createProductAction} className="flex max-w-md flex-col gap-3">
      <div>
        <label className="mb-1 block" htmlFor="name">
          상품명
        </label>
        <input id="name" name="name" className="w-full rounded border px-2 py-1" />
      </div>

      <div>
        <label className="mb-1 block" htmlFor="price">
          가격
        </label>
        <input id="price" name="price" type="number" className="w-full rounded border px-2 py-1" />
      </div>

      <button type="submit" className="rounded border px-3 py-2">
        등록
      </button>
    </form>
  )
}

export default ProductForm
