import React from 'react'
import Article from '@/components/layout/Article'
import FormInput from '@/components/form/FormInput'
import FormSelect from '@/components/form/FormSelect'
import Button from '@/components/ui/button/Button'

export default async function AdminsForm() {
  return (
    <form className="grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
      {/* 왼쪽: 기본 정보 영역 */}
      <div className="space-y-5">
        {/* 로그인 정보 */}
        <Article title="로그인 정보">
          <div className="space-y-4">
            <FormInput placeholder="admin@example.com" label="이메일" name="email" required />

            <div className="grid gap-4 md:grid-cols-2">
              <FormInput
                placeholder="8자 이상"
                label="비밀번호"
                name="password"
                type="password"
                required
              />
              <FormInput label="비밀번호 확인" name="passwordConfirm" type="password" required />
            </div>
          </div>
        </Article>

        {/* 기본 정보 */}
        <Article title="기본 정보">
          <div className="grid gap-4 md:grid-cols-2">
            <FormInput placeholder="장권영" label="이름" name="name" />
            <FormInput placeholder="010-0000-0000" label="전화번호" name="phone" type="tel" />
          </div>
        </Article>
      </div>

      {/* 오른쪽: 사이드바(역할/상태/레벨 + 버튼) */}
      <aside className="space-y-4 lg:sticky lg:top-28">
        {/* 접근 권한 설정 카드 */}
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
            />
            <FormSelect
              label="상태"
              name="status"
              options={[
                { value: 'active', label: '활성' },
                { value: 'suspended', label: '비활성' },
                { value: 'revoked', label: '정지' },
              ]}
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
            />
          </div>
        </Article>

        {/* 버튼 영역 카드 */}
        <Article>
          <div className="flex items-center justify-end gap-2.5">
            <Button variant="cancel" type="button">
              취소
            </Button>
            <Button variant="add" type="submit">
              관리자 추가
            </Button>
          </div>
        </Article>
      </aside>
    </form>
  )
}
