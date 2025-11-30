import React from 'react'
import MainStatus from '@/components/layout/MainStatus'

const Main = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="fixed top-10 right-0 bottom-0 left-[50px] size-full">
      <MainStatus />
      {children}
    </main>
  )
}

export default Main
