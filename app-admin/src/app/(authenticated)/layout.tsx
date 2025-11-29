import React from 'react'
import Header from '@/components/layout/Header'
import Aside from '@/components/layout/aside/Aside'
import Main from '@/components/layout/Main'

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Header />
      <Aside />
      <Main>{children}</Main>
    </div>
  )
}

export default AdminLayout
