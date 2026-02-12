'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Tree, { RawNodeDatum } from 'react-d3-tree'
import { Hash, FolderTree, X, RotateCw, ArrowRight } from 'lucide-react'
import clsx from 'clsx'

import Loading from '@/components/loading/Loading'
import { ErrorPanel } from '@/components/ui/ErrorPanel'
import { useCategorySubtree } from '@/features/(authenticated)/commerce/categories/hooks/useCategorySubTree'
import {
  LEVEL,
  levelOfDepth,
} from '@/features/(authenticated)/commerce/categories/components/tree/level'
import type { HierarchyPointNode } from 'd3-hierarchy'
import Link from 'next/link'
import { ROUTES } from '@/constants/routes'
import { useRouter } from 'next/navigation'

type D3Node = RawNodeDatum & { children?: D3Node[]; id?: number }

type TreeInstance = InstanceType<typeof Tree>

type TreeRef = TreeInstance & {
  centerNode: (node: HierarchyPointNode<RawNodeDatum>, transitionDuration?: number) => void
}

type CategoryNode = {
  id: number
  name: string
  slug: string
  parent_id: number | null
  children: CategoryNode[]
}

function toD3(root: CategoryNode): D3Node {
  const walk = (n: CategoryNode): D3Node => ({
    name: n.name,
    id: n.id,
    attributes: { slug: n.slug },
    children: (n.children ?? []).map(walk),
  })
  return walk(root)
}

export default function CategoryPyramidD3({
  categoryId,
  currentId,
  onClose,
}: {
  categoryId: number
  currentId: number
  onClose: () => void
}) {
  const { data, isLoading, isError, refetch } = useCategorySubtree(categoryId)

  const root = data?.tree ?? null
  const dataD3 = useMemo(() => (root ? toD3(root) : null), [root])

  const containerRef = useRef<HTMLDivElement | null>(null)
  const treeRef = useRef<TreeRef | null>(null)

  const [dims, setDims] = useState({ width: 800, height: 600 })
  const router = useRouter()

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const ro = new ResizeObserver(([e]) => {
      const r = e.contentRect
      setDims({ width: r.width, height: r.height })
    })

    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const linkCss = useMemo(() => {
    return `
      .rd3t-link { stroke-width: 1.5px; opacity: 0.95; }
      .rd3t-link.level-1 { stroke: ${LEVEL[1].linkStroke}; }
      .rd3t-link.level-2 { stroke: ${LEVEL[2].linkStroke}; }
      .rd3t-link.level-3 { stroke: ${LEVEL[3].linkStroke}; }
    `
  }, [])

  if (isLoading) return <Loading mention="트리 로딩 중…" />
  if (isError) return <ErrorPanel title="불러오기 실패." onRetry={() => refetch()} />
  if (!dataD3) return null

  return (
    <div
      ref={containerRef}
      className="relative h-[81vh] min-h-[520px] w-full min-w-7xl overflow-auto rounded border border-gray-700/60 bg-gray-500/60"
    >
      <style dangerouslySetInnerHTML={{ __html: linkCss }} />

      <div className="absolute top-0 left-0 flex items-center rounded-br border-b border-l border-gray-700/60 bg-gray-100 text-xs">
        <span className="px-3">카테고리 지도</span>
        <button
          className="flex h-[21px] w-[37px] items-center justify-center rounded-br hover:bg-gray-300"
          onClick={() => refetch()}
        >
          <RotateCw size={12} />
        </button>
      </div>

      <button
        className="absolute top-0 right-0 rounded-bl border-b border-l border-gray-700/60 bg-gray-100 px-3 py-1 text-xs hover:opacity-80"
        onClick={onClose}
      >
        <X size={12} />
      </button>

      <Tree
        data={dataD3}
        ref={treeRef}
        enableLegacyTransitions
        orientation="vertical"
        pathFunc="straight"
        translate={{ x: Math.max(200, dims.width - 150), y: 200 }}
        nodeSize={{ x: 250, y: 150 }}
        zoomable
        dimensions={dims}
        separation={{ siblings: 1.1, nonSiblings: 1.3 }}
        collapsible={false}
        pathClassFunc={(linkData) => {
          const depth = linkData.target?.depth ?? 0
          const level = levelOfDepth(depth + 1)
          return `rd3t-link level-${level}`
        }}
        renderCustomNodeElement={(rd3) => {
          const h = rd3.hierarchyPointNode as unknown as HierarchyPointNode<RawNodeDatum>
          const depth = h?.depth ?? 0
          const level = levelOfDepth(depth + 1)
          const theme = LEVEL[level]
          const nodeDatum = rd3.nodeDatum as D3Node
          const currentNode = currentId === nodeDatum.id
          const center = () => treeRef.current?.centerNode(h, 400)
          const href = `${ROUTES.CATEGORIES}/${nodeDatum.id}`

          return isLoading ? (
            <Loading />
          ) : (
            <g onClick={center}>
              <foreignObject width={200} height={200} x={-100} y={-20}>
                <div
                  className={clsx(
                    'relative h-24 rounded text-xs shadow-sm ring-1 ring-transparent',
                    'px-3 py-2',
                    theme.card,
                    currentNode ? 'border-3 shadow-lg' : 'border',
                  )}
                  onClick={center}
                  title={`${nodeDatum.attributes?.slug ?? ''} 로 이동`}
                  style={{ minWidth: 160 }}
                >
                  {/* 헤더: 색 점 + 이름 */}
                  <div
                    className={clsx(
                      'flex items-center justify-between gap-2 border-b pb-1',
                      theme.headerBorder,
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={clsx('relative inline-block h-2 w-2 rounded-full', theme.dot)}
                      >
                        {currentNode && (
                          <span className="absolute inline-block h-2 w-2 animate-ping rounded-full bg-red-300" />
                        )}
                      </span>
                      <strong className="max-w-48 truncate text-[0.72rem] leading-4">
                        {nodeDatum.name}
                      </strong>
                    </div>
                    <button
                      type="button"
                      className="pointer-events-auto rounded bg-gray-100 px-2 py-1 hover:opacity-80"
                      onPointerDown={(e) => {
                        e.stopPropagation()
                      }}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        router.push(href)
                      }}
                      aria-label="카테고리 페이지로 이동"
                    >
                      <ArrowRight size={12} />
                    </button>
                  </div>

                  {/* 슬러그 + 복사 버튼 */}
                  {nodeDatum.attributes?.slug && (
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <code className="truncate rounded bg-black/20 px-1.5 py-0.5 text-[0.62rem] whitespace-nowrap opacity-90">
                        /{nodeDatum.attributes.slug as string}
                      </code>
                    </div>
                  )}

                  {/* 메타: ID / 자식 개수 */}
                  <div className="absolute right-3 bottom-3 mt-1 flex items-end justify-end gap-2 text-[0.6rem] opacity-80">
                    {typeof nodeDatum.id !== 'undefined' && (
                      <span className="inline-flex items-center justify-center gap-1 rounded bg-black/15 px-1.5 py-0.5 leading-none">
                        <Hash className="size-3" />
                        ID: {nodeDatum.id}
                      </span>
                    )}
                    {Array.isArray(nodeDatum.children) && (
                      <span className="inline-flex items-center justify-center gap-1 rounded bg-black/15 px-1.5 py-0.5 leading-none">
                        <FolderTree className="size-3" />
                        자식 {nodeDatum.children.length}
                      </span>
                    )}
                  </div>
                </div>
              </foreignObject>
            </g>
          )
        }}
      />
    </div>
  )
}
