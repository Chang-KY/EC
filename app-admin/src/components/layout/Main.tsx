import React from 'react'

const Main = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="fixed top-10 right-0 bottom-0 left-[50px] size-full w-[calc(100%-50px)]">
      {children}
    </main>
  )
}

export default Main
