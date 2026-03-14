import { Package } from 'lucide-react'
import { PRODUCTS_TABLE } from '@/types/db'
import React from 'react'
import { HighlightText } from '@/components/ui/HighlightText'

type SelectedProductRowProps = {
  product: PRODUCTS_TABLE['Row'] & {
    thumbnail?: {
      storage_path?: string | null
      alt?: string | null
    } | null
  }
  clickButton: React.ReactNode
  keyword?: string
}

export function SelectedProductRow({ product, clickButton, keyword }: SelectedProductRowProps) {
  const priceText = typeof product.price === 'number' ? `${product.price.toLocaleString()}원` : '-'
  const stockText = typeof product.stock === 'number' ? `${product.stock}개` : '-'

  return (
    <div className="grid grid-cols-[56px_minmax(0,1fr)_120px_100px_88px] items-center gap-2 px-3 py-2.5 transition-colors hover:bg-gray-50">
      <div className="flex items-center justify-center">
        {product.thumbnail?.storage_path ? (
          <img
            src={product.thumbnail.storage_path}
            alt={product.thumbnail.alt ?? product.name}
            className="h-11 w-11 rounded border border-gray-200 object-cover"
          />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded border border-gray-200 bg-gray-50">
            <Package className="h-4 w-4 text-gray-400" />
          </div>
        )}
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-xs font-medium text-gray-900">
            <HighlightText text={product.name} keyword={keyword} />
          </p>

          {product.status && (
            <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500">
              {product.status}
            </span>
          )}
        </div>

        <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-500">
          <span className="truncate">상품번호 #{product.id}</span>
        </div>
      </div>

      <div className="flex items-center justify-center text-xs text-gray-700">
        <span>{priceText}</span>
      </div>

      <div className="flex items-center justify-center text-xs text-gray-700">
        <span>{stockText}</span>
      </div>

      <div className="flex justify-center">{clickButton}</div>
    </div>
  )
}
