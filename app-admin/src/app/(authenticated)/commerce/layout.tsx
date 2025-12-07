import React, { ReactNode } from 'react'
import SectionNavigator from '@/components/layout/aside/SectionNavigator'

export default async function CommerceLayout({ children }: { children: ReactNode }) {
  return (
    <section className="">
      <SectionNavigator sn="commerce" />
      <div className="ml-60 h-full w-[calc(100%-15rem)]">{children}</div>
    </section>
  )
}
