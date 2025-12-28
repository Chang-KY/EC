'use client'

import { Provider } from 'jotai'
import { createStore } from 'jotai/vanilla'
import 'jotai-devtools/styles.css'
import dynamic from 'next/dynamic'
import React from 'react'

const DevTools = dynamic(() => import('jotai-devtools').then((m) => m.DevTools), { ssr: false })
const store = createStore()

export default function JotaiProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {children}
      {process.env.NODE_ENV === 'development' ? <DevTools store={store} /> : null}
    </Provider>
  )
}
