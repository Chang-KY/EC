import type { Metadata } from 'next'
import './globals.css'
import React from 'react'
import ToastProvider from '@/provider/ToastProvider'

export const metadata: Metadata = {
  title: 'EC Admin | 이커머스 관리 콘솔',
  description: 'EC Admin에서 상품, 카테고리, 쿠폰, 주문을 한 곳에서 효율적으로 관리하세요.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body>
        {children}
        <ToastProvider />
      </body>
    </html>
  )
}
