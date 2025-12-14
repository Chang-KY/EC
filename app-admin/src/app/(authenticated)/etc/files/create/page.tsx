import React from 'react'
import PageTitle from '@/components/layout/PageTitle'
import Button from '@/components/ui/Button'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '파일 업로드 | Admin',
  description:
    '상품 이미지, 배너, 첨부 파일 등 서비스에 사용할 리소스를 업로드하고 메타데이터를 등록하는 페이지입니다.',
}

const AdminsPage = () => {
  return (
    <section>
      <PageTitle pathName="/admins">
        <Button>sdf</Button>
      </PageTitle>
    </section>
  )
}

export default AdminsPage
