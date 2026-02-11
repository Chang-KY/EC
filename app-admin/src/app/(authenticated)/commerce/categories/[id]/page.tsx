import React from 'react'
import { fetchRowByColumn } from '@/lib/db/fetchRowById'
import { Metadata } from 'next'
import Section from '@/components/layout/Section'
import Article from '@/components/layout/article/Article'
import Link from 'next/link'
import { ROUTES } from '@/constants/routes'
import Button from '@/components/ui/Button'
import { getCategoryDetail } from '@/features/(authenticated)/commerce/categories/detail/getCategories'
import InfoRow from '@/components/ui/InfoRow'
import InfoRowInputUpdate from '@/components/ui/InfoRowInputUpdate'
import MetaChip from '@/components/ui/MetaChip'
import InfoRowSelectUpdate from '@/components/ui/InfoRowSelectUpdate'
import { CheckCircle2, XCircle, Map, ArrowBigRight } from 'lucide-react'
import { makeBreadcrumbSegments } from '@/features/(authenticated)/commerce/categories/makeBreadcrumbSegments'
import {
  categoryUpdateNameAction,
  categoryUpdateSlugAction,
  categoryUpdateStatusAction,
} from '@/features/(authenticated)/commerce/categories/update/basicInfoActions'
import { getMeta } from '@/features/(authenticated)/commerce/categories/categoryMeta'
import { LevelType } from '@/features/(authenticated)/commerce/categories/types/DepthType'
import MapButton from '@/features/(authenticated)/commerce/categories/components/MapButton'
import CategoryMoveButton from '@/features/(authenticated)/commerce/categories/components/CategoryMoveButton'
import clsx from 'clsx'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const numericId = Number(id)

  const meta = await fetchRowByColumn('categories', 'id', numericId, ['name', 'slug'] as const)

  if (!meta) {
    return {
      title: '카테고리를 찾을 수 없음 | Admin',
      description: '요청하신 카테고리 정보를 찾을 수 없습니다.',
    }
  }

  return {
    title: `${meta.name} | 카테고리 상세 | Admin`,
    description: `EC Admin에서 ${meta.name} 카테고리의 상세 정보를 확인하는 페이지입니다.`,
  }
}

export default async function CategoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const numericId = Number(id)

  const category = await getCategoryDetail(numericId)

  if (!category) {
    return (
      <Section pathTitle="not-found">
        <Article title="카테고리 상세">
          <p className="text-sm text-gray-500">존재하지 않는 카테고리입니다.</p>
          <div className="flex items-center justify-end">
            <Link href={ROUTES.CATEGORIES}>
              <Button type="button" variant="cancel">
                돌아가기
              </Button>
            </Link>
          </div>
        </Article>
      </Section>
    )
  }
  console.log(category)
  const segments = makeBreadcrumbSegments(category)
  console.log(segments)
  return (
    <Section pathTitle={`${ROUTES.CATEGORIES}/${id}`}>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div className="mb-5 space-y-5">
          {/* 상품 정보 */}
          <Article title="카테고리 정보" subtitle="계층 / ID / 부모 카테고리">
            <div className="space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <InfoRow label="계층" value={category.depth ?? '-'} />
                <InfoRow label="카테고리 ID" value={category.id ?? '-'} />
              </div>
              {category.parent_id ? (
                <>
                  <InfoRow
                    label="부모 카테고리"
                    value={
                      <div
                        className="group inline-flex items-center gap-1 text-sm font-medium text-gray-800"
                        title={`${category.parent_name ?? '부모'} (${category.parent_id})`}
                      >
                        <span className="truncate">{category.parent_name ?? '부모'}</span>
                        <span className="text-xs text-gray-400 tabular-nums">
                          ( {category.parent_id} )
                        </span>
                      </div>
                    }
                  />
                </>
              ) : (
                <InfoRow
                  label="부모 카테고리"
                  value={<span className="text-muted-foreground">없음(루트)</span>}
                />
              )}
            </div>
          </Article>

          <Article
            title="카테고리 명 / 슬러그"
            subtitle="노출되는 이름(표시명) 변경 / URL 경로에 사용되는 고유 값"
          >
            <div className="grid gap-3 md:grid-cols-2">
              <InfoRow
                label="이름"
                value={category.name ?? '-'}
                action={
                  <InfoRowInputUpdate<number>
                    targetId="basic-info-name"
                    id={numericId}
                    initialValue={category.name ?? ''}
                    field="name"
                    action={categoryUpdateNameAction}
                  />
                }
              />

              <InfoRow
                label="슬러그"
                value={category.slug ?? '-'}
                action={
                  <InfoRowInputUpdate<number>
                    targetId="basic-info-slug"
                    id={numericId}
                    initialValue={category.slug ?? ''}
                    field="slug"
                    action={categoryUpdateSlugAction}
                  />
                }
              />
            </div>
          </Article>

          <Article title="카테고리 경로" subtitle="1계층 → 2계층 → 3계층 순으로 표시">
            <div className="space-y-3">
              <InfoRow
                label="경로"
                value={
                  <div className="flex min-w-0 flex-wrap items-center gap-1">
                    {makeBreadcrumbSegments(category).map((seg, idx, arr) => (
                      <React.Fragment key={`${seg.id}-${idx}`}>
                        {idx === makeBreadcrumbSegments(category).length - 1 ? (
                          <div className="group inline-flex min-w-0 items-center gap-1 rounded-md border border-transparent px-1.5 py-0.5 text-xs font-medium text-gray-700">
                            <span className="min-w-0 truncate">{seg.name}</span>
                            <span className="shrink-0 text-[11px] text-gray-400 tabular-nums">
                              ({seg.id})
                            </span>
                          </div>
                        ) : (
                          <Link
                            href={`${ROUTES.CATEGORIES}/${seg.id}`}
                            className="group inline-flex min-w-0 items-center gap-1 rounded-md border border-transparent px-1.5 py-0.5 text-xs font-medium text-gray-700 hover:border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                            title={`${seg.name} (${seg.id})`}
                          >
                            <span className="min-w-0 truncate">{seg.name}</span>
                            <span className="shrink-0 text-[11px] text-gray-400 tabular-nums group-hover:text-gray-700">
                              ({seg.id})
                            </span>
                          </Link>
                        )}

                        {idx < arr.length - 1 && (
                          <span className="shrink-0 text-[11px] text-gray-300">{'>'}</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                }
              />

              <div className="mt-5 flex items-center justify-between gap-3 border-t border-gray-200 pt-5">
                {segments.map((v, i) => (
                  <CategorySelectableBox
                    key={v.id}
                    type={(i + 1) as LevelType}
                    name={v.name}
                    id={Number(v.id)}
                    currentId={numericId}
                  />
                ))}
                {segments.length === 2 && (
                  <>
                    <ArrowBigRight size={28} className="opacity-0" />
                    <div className="flex h-28 w-1/4 min-w-0 flex-col overflow-hidden rounded border opacity-0"></div>
                  </>
                )}
              </div>
            </div>
          </Article>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-28">
          {/* 노출/상태 */}
          <Article title="상품 연결 가능 여부" subtitle="가능/불가">
            <InfoRow
              label="상품 연결 가능 상태"
              value={
                <MetaChip
                  label={category.selectable ? '가능' : '불가'}
                  className={clsx(
                    category.selectable
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-rose-200 bg-rose-50 text-rose-700',
                  )}
                  icon={category.selectable ? CheckCircle2 : XCircle}
                  menuElement={[
                    {
                      id: 'selectable:true',
                      element: (
                        <InfoRowSelectUpdate<number>
                          id={numericId}
                          field="selectable"
                          label="가능"
                          disabled={category.selectable === true}
                          value={true}
                          action={categoryUpdateStatusAction}
                        />
                      ),
                    },
                    {
                      id: 'selectable:false',
                      element: (
                        <InfoRowSelectUpdate<number>
                          id={numericId}
                          field="selectable"
                          label="불가"
                          disabled={category.selectable === false}
                          value={false}
                          action={categoryUpdateStatusAction}
                        />
                      ),
                    },
                  ]}
                />
              }
            />
          </Article>
          <Article title="카테고리 전체 맵 보기" subtitle="">
            <InfoRow label="맵" value={<MapButton categoryId={Number(segments[0].id)} />} />
          </Article>
          {/* 액션 */}
          <Article>
            <div className="flex items-center justify-end gap-2.5">
              <Link href={ROUTES.CATEGORIES}>
                <Button variant="cancel" type="button">
                  목록으로
                </Button>
              </Link>
              <Button variant="delete" type="button">
                카테고리 삭제
              </Button>
            </div>
          </Article>
        </aside>
      </div>
    </Section>
  )
}

function CategorySelectableBox({
  type,
  name,
  id,
  currentId,
}: {
  type: LevelType
  name: string
  id: number
  currentId: number
}) {
  const meta = getMeta(type)

  return (
    <>
      {type !== 1 && <ArrowBigRight size={28} />}
      <CategoryMoveButton
        categoryId={id}
        categoryName={name}
        className={meta.badgeClass}
        disabled={id === currentId}
      >
        <div className="flex h-10 w-full items-center gap-2 border-b border-gray-200 px-3">
          <h3 className="shrink-0 text-sm font-semibold text-gray-900">{meta.label}</h3>
          <p className="min-w-0 flex-1 truncate text-[10px] text-gray-700">({meta.hint})</p>
        </div>

        <div className="flex min-h-0 flex-1 flex-col justify-between px-3 py-2">
          <div className="min-h-0 min-w-0">
            <p className="mt-2 text-[11px] font-medium text-gray-500">- 카테고리</p>
            <p className="">
              {name} <span>( {id} )</span>
            </p>
          </div>
        </div>
      </CategoryMoveButton>
    </>
  )
}
