'use client'

import React from 'react'
import { AdminCreateFormValues } from '@/features/(authenticated)/system/admins/create/schema'
import { adminCreateAction } from '@/features/(authenticated)/system/admins/create/actions'
import ServerForm from '@/components/form/ServerForm'
import { FormState } from '@/types/FormState'
import Article from '@/components/layout/article/Article'
import FormInput from '@/components/form/FormInput'
import FormSelect from '@/components/form/FormSelect'
import Button from '@/components/ui/Button'
import FormPasswordInput from '@/components/form/FormPasswordInput'
import {
  ADMIN_STATUS_META,
  AdminStatus,
  LEVEL_META,
  USER_ROLE_META,
} from '@/features/(authenticated)/system/admins/schema'
import { useRouter } from 'next/navigation'

const initialAdminState: FormState<AdminCreateFormValues> = {
  values: {},
  fieldErrors: {},
  success: false,
}

export default function AdminCreateForm() {
  const router = useRouter()
  return (
    <ServerForm<FormState<AdminCreateFormValues>>
      action={adminCreateAction}
      initialState={initialAdminState}
    >
      {({ state, isPending }) => (
        <>
          {/* 왼쪽: 기본 정보 */}
          <div className="space-y-5">
            <Article title="로그인 정보">
              <div className="space-y-3">
                <FormInput
                  placeholder="admin@example.com"
                  label="이메일"
                  name="email"
                  required
                  defaultValue={state.values.email ?? ''}
                  errorMessage={state.fieldErrors.email?.[0]}
                />

                <div className="grid gap-3 md:grid-cols-2">
                  <FormPasswordInput
                    placeholder="8자 이상"
                    label="비밀번호"
                    name="password"
                    type="password"
                    required
                    errorMessage={state.fieldErrors.password?.[0]}
                  />
                  <FormPasswordInput
                    label="비밀번호 확인"
                    name="passwordConfirm"
                    type="password"
                    required
                    errorMessage={state.fieldErrors.passwordConfirm?.[0]}
                  />
                </div>
              </div>
            </Article>

            <Article title="기본 정보">
              <div className="grid gap-3 md:grid-cols-2">
                <FormInput
                  placeholder="장권영"
                  label="이름"
                  name="name"
                  defaultValue={state.values.name ?? ''}
                  errorMessage={state.fieldErrors.name?.[0]}
                />
                <FormInput
                  placeholder="010-0000-0000"
                  label="전화번호"
                  name="phone"
                  type="tel"
                  defaultValue={state.values.phone ?? ''}
                  errorMessage={state.fieldErrors.phone?.[0]}
                />
              </div>
            </Article>
          </div>

          {/* 오른쪽: 사이드바 */}
          <aside className="space-y-5 lg:sticky lg:top-28">
            <Article title="접근 권한 설정">
              <div className="grid gap-3">
                <FormSelect
                  label="역할"
                  className="h-10"
                  name="role"
                  options={Object.entries(USER_ROLE_META)
                    .filter(([value]) => value !== 'super_admin')
                    .map(([value, meta]) => ({
                      value: value as Exclude<keyof typeof USER_ROLE_META, 'super_admin'>,
                      label: meta.label,
                    }))}
                  defaultValue={state.values.role ?? 'manager'}
                  errorMessage={state.fieldErrors.role?.[0]}
                />
                <FormSelect
                  label="상태"
                  className="h-10"
                  name="status"
                  options={Object.entries(ADMIN_STATUS_META).map(([value, meta]) => ({
                    value: value as AdminStatus,
                    label: meta.label,
                    icon: meta.icon,
                  }))}
                  defaultValue={state.values.status ?? 'active'}
                  errorMessage={state.fieldErrors.status?.[0]}
                />
                <FormSelect
                  label="레벨"
                  className="h-10"
                  name="level"
                  options={Object.entries(LEVEL_META).map(([value, meta]) => ({
                    label: meta.label,
                    value: value,
                  }))}
                  defaultValue={String(state.values.level ?? 1)}
                  errorMessage={state.fieldErrors.level?.[0]}
                />
              </div>
            </Article>

            <Article>
              <div className="flex items-center justify-end gap-2.5">
                <Button
                  variant="cancel"
                  type="button"
                  onClick={() => router.back()}
                  disabled={isPending}
                >
                  취소
                </Button>
                <Button variant="add" type="submit" disabled={isPending}>
                  {isPending ? '추가 중…' : '관리자 생성'}
                </Button>
              </div>
            </Article>
          </aside>
        </>
      )}
    </ServerForm>
  )
}
