import React from 'react'
import { fetchRowByColumn } from '@/lib/db/fetchRowById'
import { Metadata } from 'next'
import Section from '@/components/layout/Section'
import Article from '@/components/layout/article/Article'
import Link from 'next/link'
import { ROUTES } from '@/constants/routes'
import AppButton from '@/components/ui/AppButton'
import { getUserDetail } from '@/features/(authenticated)/commerce/users/detail/getUsers'
import InfoRow from '@/components/ui/InfoRow'
import InfoRowInputUpdate from '@/components/ui/InfoRowInputUpdate'
import { dateTimeFormat } from '@/utils/DateTimeFormat'
import {
  userUpdateNameAction,
  userUpdatePhoneAction,
} from '@/features/(authenticated)/commerce/users/update/basicInfoActions'
import { CheckCircle2, XCircle } from 'lucide-react'
import clsx from 'clsx'
import { FALSE, TRUE } from '@/constants/booleanColor'
import MetaChip from '@/components/ui/MetaChip'
import { KeyValuePre } from '@/components/ui/KeyValuePre'
import UserMemo from '@/features/(authenticated)/commerce/users/components/UserMemo'
import { getAdminUser } from '@/lib/getAdminUser'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params

  const meta = await fetchRowByColumn('profiles', 'id', id, ['name', 'email'] as const)

  if (!meta) {
    return {
      title: '회원을 찾을 수 없음 | Admin',
      description: '요청하신 회원 프로필 정보를 찾을 수 없습니다.',
    }
  }

  const displayName = meta.name ?? meta.email

  return {
    title: `${displayName} | 회원 상세 | Admin`,
    description: `${displayName} 회원의 기본 정보와 활동 현황을 확인하는 페이지입니다.`,
  }
}

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { user: adminUser } = await getAdminUser()

  const user = await getUserDetail(id)

  if (!adminUser) return null
  if (!user) {
    return (
      <Section pathTitle="not-found">
        <Article title="회원 상세">
          <p className="text-sm text-gray-500">존재하지 않는 회원입니다.</p>
          <div className="flex items-center justify-end">
            <Link href={ROUTES.USERS}>
              <AppButton type="button" variant="cancel">
                돌아가기
              </AppButton>
            </Link>
          </div>
        </Article>
      </Section>
    )
  }

  return (
    <Section pathTitle={`${ROUTES.USERS}/${id}`}>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div className="mb-5 space-y-5">
          {/* 기본 정보 */}
          <Article title="회원 정보" subtitle="UUID / 이메일 / 생성일">
            <div className="space-y-3">
              <InfoRow label="회원 ID" value={user.id ?? '-'} />
              <InfoRow label="이메일" value={user.email ?? '-'} />
              <InfoRow label="가입일" value={dateTimeFormat(user.created_at, 'datetime') ?? '-'} />
            </div>
          </Article>

          {/* 표시 정보 */}
          <Article title="프로필" subtitle="이름 / 아바타 / 소개(bio) / 연락처">
            <div className="space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <InfoRow
                  label="이름"
                  value={user.name ?? '-'}
                  action={
                    <InfoRowInputUpdate<string>
                      targetId="basic-info-name"
                      id={user.id}
                      initialValue={user.name ?? ''}
                      field="name"
                      action={userUpdateNameAction}
                    />
                  }
                />

                <InfoRow
                  label="연락처"
                  value={user.phone ?? '-'}
                  action={
                    <InfoRowInputUpdate<string>
                      targetId="basic-info-phone"
                      id={user.id}
                      initialValue={user.phone ?? ''}
                      field="phone"
                      action={userUpdatePhoneAction}
                    />
                  }
                />

                <InfoRow label="소개" value={user.bio ?? '-'} />

                <InfoRow label="아바타 URL" value={user.avatar_url ?? '-'} />
              </div>
            </div>
          </Article>

          {/* 링크 / 설정 */}
          <Article title="추가 데이터" subtitle="links / settings (jsonb)">
            <div className="space-y-3">
              <InfoRow label="links" value={<KeyValuePre value={user.links} emptyText="-" />} />
            </div>
          </Article>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-28">
          {/* 인증/상태 */}
          <Article title="인증 상태" subtitle="이메일 / 전화 인증">
            <div className="space-y-3">
              <InfoRow
                label="이메일 인증"
                value={
                  <MetaChip
                    label={user.email_verified ? '인증됨' : '미인증'}
                    className={clsx(user.email_verified ? TRUE : FALSE)}
                    icon={user.email_verified ? CheckCircle2 : XCircle}
                  />
                }
              />

              <InfoRow
                label="핸드폰 인증"
                value={
                  <MetaChip
                    label={user.phone_verified ? '인증됨' : '미인증'}
                    className={clsx(user.phone_verified ? TRUE : FALSE)}
                    icon={user.phone_verified ? CheckCircle2 : XCircle}
                  />
                }
              />
            </div>
          </Article>

          {/* 회원 관련 메모 */}
          <Article title="회원 메모" subtitle="관리자 메모 조회 / 작성 / 변경 / 삭제">
            <UserMemo userId={user.id} adminId={adminUser.id} />
          </Article>
          {/* 액션 */}
          <Article>
            <div className="flex items-center justify-end gap-2.5">
              <Link href={ROUTES.USERS}>
                <AppButton variant="cancel" type="button">
                  목록으로
                </AppButton>
              </Link>
            </div>
          </Article>
        </aside>
      </div>
    </Section>
  )
}
