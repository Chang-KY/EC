import React from 'react'
import Aside from '@/components/layout/aside/Aside'
import Main from '@/components/layout/Main'
import Header from '@/components/layout/header/Header'
import Footer from '@/components/layout/Footer'

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <Aside />
      <Main>{children}</Main>
      <Footer />
    </div>
  )
}
