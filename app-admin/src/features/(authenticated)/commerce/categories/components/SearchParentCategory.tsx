'use client'

import React, { useMemo, useRef, useState, useEffect } from 'react'
import { X, Check, Search } from 'lucide-react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { getDepthCategories } from '@/features/(authenticated)/commerce/categories/list/getDepthCategories'
import { CATEGORIES_TABLE } from '@/types/db'
import Loading from '@/components/loading/Loading'
import Button from '@/components/ui/Button'
import clsx from 'clsx'

export default function SearchParentCategory({
  onClose,
  onSelect,
  parentId,
  depth,
  name,
}: {
  onClose: () => void
  onSelect?: (category: CATEGORIES_TABLE['Row']) => void
  parentId: number | null
  depth: 1 | 2
  name?: string
}) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } = useInfiniteQuery(
    getDepthCategories({ parentId, depth, limit: 20 }),
  )
  const items = useMemo(() => data?.pages.flatMap((p) => p.data) ?? [], [data])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [keyword, setKeyword] = useState('')
  const filtered = useMemo(() => {
    const k = keyword.trim().toLowerCase()
    if (!k) return items
    return items.filter((c: CATEGORIES_TABLE['Row']) => {
      return c.name.toLowerCase().includes(k) || c.slug.toLowerCase().includes(k)
    })
  }, [items, keyword])

  const sentinelRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return

    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage()
    })
    io.observe(el)
    return () => io.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  const selected = useMemo(
    () => items.find((c: CATEGORIES_TABLE['Row']) => c.id === selectedId) ?? null,
    [items, selectedId],
  )

  return (
    <>
      {/* Search */}
      <div className="mt-3 flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
        <Search size={16} className="text-gray-400" />
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="카테고리 검색 (이름/슬러그)"
          className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
        />
      </div>

      <div className="my-1 h-px w-full" />

      {/* List */}
      <main className="min-h-80">
        {isPending ? (
          <Loading
            widthCN="w-full"
            heightCN="h-80"
            mention={`${depth} 계층 카테고리 불러오는 중...`}
          />
        ) : filtered.length === 0 ? (
          <div className="flex min-h-80 items-center justify-center text-sm text-gray-500">
            {depth === 1 && '1 계층의 데이터가 존재하지 않습니다.'}
            {depth === 2 && `1 계층 (${name})의 하위(2 계층) 데이터가 존재하지 않습니다.`}
          </div>
        ) : (
          <div className="flex max-h-80 flex-col gap-2 overflow-auto pr-1">
            {filtered.map((c: CATEGORIES_TABLE['Row']) => {
              const active = c.id === selectedId
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedId(c.id)}
                  className={clsx(
                    'group flex w-full items-center justify-between rounded-2xl border px-3 py-3 text-left transition',
                    active
                      ? 'border-indigo-300 bg-indigo-50'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50',
                  )}
                >
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="truncate text-sm font-medium text-gray-900">{c.name}</span>
                    <span className="truncate text-xs text-gray-500">
                      slug: {c.slug} · id: {c.id}
                    </span>
                  </div>

                  <span
                    className={clsx(
                      'ml-3 inline-flex size-8 items-center justify-center rounded-full border transition',
                      active
                        ? 'border-indigo-300 bg-white text-indigo-600'
                        : 'border-gray-200 bg-white text-gray-300 group-hover:text-gray-400',
                    )}
                  >
                    <Check size={16} />
                  </span>
                </button>
              )
            })}

            {/* Sentinel */}
            <div ref={sentinelRef} className="h-8" />

            {isFetchingNextPage && (
              <div className="py-2 text-center text-xs text-gray-500">더 불러오는 중...</div>
            )}
            {!hasNextPage && (
              <div className="py-2 text-center text-xs text-gray-400">마지막입니다</div>
            )}
          </div>
        )}
      </main>

      <footer className="flex items-center justify-end gap-2 border-t border-gray-100 pt-4">
        <Button variant="cancel" type="button" onClick={onClose}>
          취소
        </Button>

        <Button
          variant="update"
          type="button"
          disabled={!selected}
          onClick={() => {
            if (!selected) return
            onSelect?.(selected)
            onClose()
          }}
        >
          선택 완료
        </Button>
      </footer>
    </>
  )
}
