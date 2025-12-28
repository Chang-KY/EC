import React from 'react'
import '@/app/globals.css'
import ToastProvider from '@/provider/ToastProvider'
import type { Metadata } from 'next'
import TanStackProvider from '@/provider/TanStackProvider'
import { suit } from '@/font/suit/font'
import JotaiProvider from '@/provider/JotaiProvider'

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
    <html lang="ko" className={`${suit.className} ${suit.variable}`}>
      <body>
        <TanStackProvider>
          <JotaiProvider>{children}</JotaiProvider>
        </TanStackProvider>
        <ToastProvider />
      </body>
    </html>
  )
}
