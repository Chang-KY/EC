import React from 'react'
import LoginForm from '@/features/(public)/login/components/LoginForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '대시보드 | Admin',
  description:
    '주문, 매출, 트래픽 등 서비스 운영 현황을 한눈에 확인할 수 있는 관리자 대시보드입니다.',
}

const LoginPage = async () => {
  return (
    <div className="flex size-full min-h-dvh items-center justify-center">
      <div className="m-auto min-w-96">
        <LoginForm />
      </div>
    </div>
  )
}

export default LoginPage
