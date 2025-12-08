'use client'

import React from 'react'
import { AdminCreateFormValues } from '@/features/(authenticated)/system/admins/create/schema'
import { adminCreateAction } from '@/features/(authenticated)/system/admins/create/actions'
import ServerForm from '@/components/form/ServerForm'
import { FormState } from '@/types/FormState'
import Article from '@/components/layout/Article'
import FormInput from '@/components/form/FormInput'
import FormSelect from '@/components/form/FormSelect'
import Button from '@/components/ui/button/Button'
import FormPasswordInput from '@/components/form/FormPasswordInput'

const initialAdminState: FormState<AdminCreateFormValues> = {
  values: {},
  fieldErrors: {},
  success: false,
}

export default function AdminCreateForm() {
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
              <div className="space-y-4">
                <FormInput
                  placeholder="admin@example.com"
                  label="이메일"
                  name="email"
                  required
                  defaultValue={state.values.email ?? ''}
                  errorMessage={state.fieldErrors.email?.[0]}
                />

                <div className="grid gap-4 md:grid-cols-2">
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
              <div className="grid gap-4 md:grid-cols-2">
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
          <aside className="space-y-4 lg:sticky lg:top-28">
            <Article title="접근 권한 설정">
              <div className="grid gap-3">
                <FormSelect
                  label="역할"
                  name="role"
                  options={[
                    { value: 'admin', label: '관리자' },
                    { value: 'manager', label: '매니저 (기본)' },
                    { value: 'guest', label: '게스트 (조회 전용)' },
                  ]}
                  defaultValue={state.values.role ?? 'manager'}
                  errorMessage={state.fieldErrors.role?.[0]}
                />
                <FormSelect
                  label="상태"
                  name="status"
                  options={[
                    { value: 'active', label: '활성' },
                    { value: 'suspended', label: '비활성' },
                    { value: 'revoked', label: '정지' },
                  ]}
                  defaultValue={state.values.status ?? 'active'}
                  errorMessage={state.fieldErrors.status?.[0]}
                />
                <FormSelect
                  label="레벨"
                  name="level"
                  options={[
                    { value: '1', label: 'Lv.1 (기본)' },
                    { value: '2', label: 'Lv.2' },
                    { value: '3', label: 'Lv.3' },
                    { value: '4', label: 'Lv.4' },
                    { value: '5', label: 'Lv.5' },
                    { value: '6', label: 'Lv.6 (최고)' },
                  ]}
                  defaultValue={String(state.values.level ?? 1)}
                  errorMessage={state.fieldErrors.level?.[0]}
                />
              </div>
            </Article>

            <Article>
              <div className="flex items-center justify-end gap-2.5">
                <Button variant="cancel" type="button">
                  취소
                </Button>
                <Button variant="add" type="submit" disabled={isPending}>
                  {isPending ? '추가 중…' : '관리자 추가'}
                </Button>
              </div>
            </Article>
          </aside>
        </>
      )}
    </ServerForm>
  )
}
