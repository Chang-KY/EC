import React from 'react'
import { fetchRowByColumn } from '@/lib/db/fetchRowById'
import { Metadata } from 'next'
import { ROUTES } from '@/constants/routes'
import { getAdminDetail } from '@/features/(authenticated)/system/admins/detail/getAdminDetail'
import Article from '@/components/layout/Article'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import Section from '@/components/layout/Section'
import {
  ADMIN_STATUS_META,
  AdminStatusKey,
  LEVEL_META,
  LevelKey,
  USER_ROLE_META,
  UserRoleKey,
} from '@/features/(authenticated)/system/admins/schema'
import InfoRow from '@/components/ui/InfoRow'
import MetaChip from '@/components/ui/MetaChip'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const meta = await fetchRowByColumn('admins', 'id', id, ['name', 'email'] as const)
  if (!meta) {
    return {
      title: '관리자 계정을 찾을 수 없음 | Admin',
      description: '요청하신 관리자 계정 정보를 찾을 수 없습니다.',
    }
  }
  const displayName = meta.email ?? meta.name
  return {
    title: `${displayName} | 관리자 상세 | Admin`,
    description: `EC Admin에서 ${displayName} 관리자 계정의 상세 정보를 확인하는 페이지입니다.`,
  }
}

export default async function AdminDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const admin = await getAdminDetail(id)

  if (!admin) {
    return (
      <Section pathTitle="not-found">
        <Article title="관리자 상세">
          <p className="text-sm text-gray-500">존재하지 않는 관리자입니다.</p>
          <div className="flex items-center justify-end">
            <Link href={ROUTES.ADMINS}>
              <Button type="button" variant="cancel">
                돌아가기
              </Button>
            </Link>
          </div>
        </Article>
      </Section>
    )
  }
  const statusKey = admin.status as AdminStatusKey
  const roleKey = admin.role as UserRoleKey
  const levelKey = Number(admin.level) as LevelKey

  const statusMeta = ADMIN_STATUS_META[statusKey]
  const roleMeta = USER_ROLE_META[roleKey]
  const levelMeta = LEVEL_META[levelKey]

  return (
    <Section pathTitle={`${ROUTES.ADMINS}/${id}`}>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div className="space-y-5">
          <Article title="로그인 정보" subtitle="계정 식별 및 보안 정보">
            <div className="space-y-3">
              <InfoRow label="이메일" value={admin.email ?? '-'} />
            </div>
          </Article>

          <Article title="기본 정보" subtitle="관리자 프로필 정보">
            <div className="grid gap-3 md:grid-cols-2">
              <InfoRow label="이름" value={admin.name ?? '-'} />
              <InfoRow label="전화번호" value={admin.phone ?? '-'} />
            </div>
          </Article>

          <Article title="활동" subtitle="계정 사용 기록">
            <div className="grid gap-3 md:grid-cols-2">
              <InfoRow label="마지막 로그인" value={admin.last_login ?? '-'} />
              <InfoRow
                label="생성일"
                value={admin.created_at ? new Date(admin.created_at).toLocaleString('ko-KR') : '-'}
              />
            </div>
          </Article>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-28">
          <Article title="접근 권한 설정" subtitle="역할/상태/레벨">
            <div className="space-y-3">
              <InfoRow
                label="역할"
                value={
                  roleMeta ? (
                    <MetaChip
                      label={roleMeta.label}
                      icon={roleMeta.icon}
                      className={roleMeta.className}
                    />
                  ) : (
                    (admin.role ?? '-')
                  )
                }
              />

              <InfoRow
                label="상태"
                value={
                  statusMeta ? (
                    <MetaChip
                      label={statusMeta.label}
                      icon={statusMeta.icon}
                      className={statusMeta.className}
                    />
                  ) : (
                    (admin.status ?? '-')
                  )
                }
              />

              <InfoRow
                label="레벨"
                value={
                  levelMeta ? (
                    <MetaChip label={levelMeta.label} icon={levelMeta.icon} />
                  ) : admin.level != null ? (
                    `Lv.${admin.level}`
                  ) : (
                    '-'
                  )
                }
              />
            </div>
          </Article>

          <Article>
            <div className="flex items-center justify-end gap-2.5">
              <Link href={ROUTES.ADMINS}>
                <Button variant="cancel" type="button">
                  목록으로
                </Button>
              </Link>
              <Button variant="delete" type="button">
                관리자 삭제
              </Button>
            </div>
          </Article>
        </aside>
      </div>
    </Section>
  )
}
