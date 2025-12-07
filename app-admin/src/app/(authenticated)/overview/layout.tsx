import React, { ReactNode } from 'react'
import SectionNavigator from '@/components/layout/aside/SectionNavigator'

export default async function OverviewLayout({ children }: { children: ReactNode }) {
  return (
    <section className="">
      <SectionNavigator sn="overview" />
      <div className="ml-60 h-full w-[calc(100%-15rem)]">{children}</div>
    </section>
  )
}
