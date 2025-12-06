import React, { ReactNode } from 'react'
import SectionNavigator from '@/components/layout/aside/SectionNavigator'

export default async function OverviewLayout({ children }: { children: ReactNode }) {
  return <SectionNavigator sn="overview">{children}</SectionNavigator>
}
