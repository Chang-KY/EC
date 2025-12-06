import React, { ReactNode } from 'react'
import SectionNavigator from '@/components/layout/aside/SectionNavigator'

export default async function CommerceLayout({ children }: { children: ReactNode }) {
  return <SectionNavigator sn="commerce">{children}</SectionNavigator>
}
