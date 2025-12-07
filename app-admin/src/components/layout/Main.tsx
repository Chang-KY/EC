import React from 'react'

const Main = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="fixed top-10 right-0 bottom-0 left-[50px] h-[calc(100%-52px)] w-[calc(100%-50px)] overflow-y-auto bg-white">
      {children}
    </main>
  )
}

export default Main
