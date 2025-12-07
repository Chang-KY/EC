import React, { ReactNode } from 'react'
import SectionNavigator from '@/components/layout/aside/SectionNavigator'

export default async function EtcLayout({ children }: { children: ReactNode }) {
  return (
    <section className="">
      <SectionNavigator sn="etc" />
      <div className="ml-60 h-full w-[calc(100%-15rem)]">{children}</div>
    </section>
  )
}
