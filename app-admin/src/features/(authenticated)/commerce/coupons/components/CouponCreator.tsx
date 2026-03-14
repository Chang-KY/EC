'use client'

import React from 'react'
import { UserStar } from 'lucide-react'
import Modal from '@/components/modal/Modal'
import AppButton from '@/components/ui/AppButton'
import { iconButtonClassName } from '@/constants/iconButtonClassName'
import { dateTimeFormat } from '@/utils/DateTimeFormat'
import { ADMIN_STATUS_META, USER_ROLE_META } from '@/features/(authenticated)/system/admins/schema'
import { AdminStatus, UserRole } from '@/types/enum'
import Link from 'next/link'

type CouponCreatorProps = {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  phone: string | null
  status: AdminStatus
  last_login: string | null
  created_at: string
  role: UserRole
  level: number
}

function InfoItem({
  label,
  value,
  icon,
}: {
  label: string
  value: React.ReactNode
  icon?: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-[110px_1fr] items-start gap-3 border-b border-gray-100 py-3 last:border-b-0 dark:border-gray-800">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-sm text-gray-900 dark:text-gray-100">{value}</div>
    </div>
  )
}

export default function CouponCreator(props: CouponCreatorProps) {
  const { id, status, created_at, name, phone, level, last_login, email, avatar_url, role } = props
  const [isOpen, setIsOpen] = React.useState(false)

  const adminStatus = ADMIN_STATUS_META[status]
  const adminRole = USER_ROLE_META[role]
  const displayName = name?.trim() || '이름 없음'
  const initials = displayName.slice(0, 1)

  return (
    <>
      <div className="flex items-center gap-3">
        <p title={id} className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
          {displayName}
        </p>

        <button
          type="button"
          className={iconButtonClassName}
          onClick={() => setIsOpen(true)}
          title="작성자 상세 정보 보기"
          aria-label="작성자 상세 정보 보기"
        >
          <UserStar size={14} />
        </button>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        headerTitle="쿠폰 작성자 정보"
        subHeaderTitle="이 쿠폰을 생성한 관리자 정보를 확인할 수 있어요."
        footerButton={[
          <AppButton variant="cancel" key="close-creator" onClick={() => setIsOpen(false)}>
            닫기
          </AppButton>,
          <Link href={`/system/admins/${id}`} key="move-creator">
            <AppButton variant="confirm">관리자 정보 페이지 이동</AppButton>
          </Link>,
        ]}
      >
        <div className="size-full rounded border border-gray-300 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-4 flex items-center gap-4 pb-4 dark:border-gray-800">
            {avatar_url ? (
              <img
                src={avatar_url}
                alt={`${displayName} 아바타`}
                className="size-14 rounded-full border border-gray-200 object-cover dark:border-gray-800"
              />
            ) : (
              <div className="flex size-14 items-center justify-center rounded-full border border-gray-200 bg-indigo-50 text-lg font-semibold text-indigo-700 dark:border-gray-800 dark:bg-indigo-950/40 dark:text-indigo-300">
                {initials}
              </div>
            )}

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {displayName}
                </p>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                  {adminRole.label}
                </span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                  {adminStatus.label}
                </span>
              </div>

              <p className="mt-1 text-sm break-all text-gray-500 dark:text-gray-400">{email}</p>
            </div>
          </div>

          <div>
            <InfoItem label="관리자 ID" value={<span className="break-all">{id}</span>} />
            <InfoItem label="연락처" value={phone ?? '-'} />
            <InfoItem label="권한" value={adminRole.label} />
            <InfoItem label="레벨" value={`Lv.${level}`} />
            <InfoItem label="최근 로그인" value={dateTimeFormat(last_login, 'date')} />
            <InfoItem label="생성일" value={dateTimeFormat(created_at, 'date')} />
          </div>
        </div>
      </Modal>
    </>
  )
}
