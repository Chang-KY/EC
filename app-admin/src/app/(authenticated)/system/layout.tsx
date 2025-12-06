import React, { ReactNode } from 'react'
import SectionNavigator from '@/components/layout/aside/SectionNavigator'

export default async function SystemLayout({ children }: { children: ReactNode }) {
  return <SectionNavigator sn="system">{children}</SectionNavigator>
}
