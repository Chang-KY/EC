import React, { ReactNode } from 'react'
import SectionNavigator from '@/components/layout/aside/SectionNavigator'

export default async function EtcLayout({ children }: { children: ReactNode }) {
  return <SectionNavigator sn="etc">{children}</SectionNavigator>
}
