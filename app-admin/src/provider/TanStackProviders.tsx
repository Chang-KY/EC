'use client'

import React from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { getQueryClient } from '@/lib/query/getQueryClient'

const TanStackProviders = ({
  children,
  dehydratedState,
}: {
  children: React.ReactNode
  dehydratedState?: unknown
}) => {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}

export default TanStackProviders
