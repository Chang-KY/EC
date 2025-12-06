import React from 'react'
import Aside from '@/components/layout/aside/Aside'
import Main from '@/components/layout/Main'
import { getCurrentUser } from '@/features/(public)/login/service'
import { redirect } from 'next/navigation'
import { ROUTES } from '@/constants/routes'
import Header from '@/components/layout/header/Header'
import Footer from '@/components/layout/Footer'

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getCurrentUser()
  if (!user) redirect(ROUTES.LOGIN)
  return (
    <div>
      <Header />
      <Aside />
      <Main>{children}</Main>
      <Footer />
    </div>
  )
}

export default AdminLayout
