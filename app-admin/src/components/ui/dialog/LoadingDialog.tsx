'use client'

import React from 'react'
import {
  DialogContent,
  DialogDescription,
  DialogElements,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog/dialogElements'

export function LoadingDialog({
  title,
  subTitle,
  autoOpenKey,
}: {
  title: string
  subTitle: string
  autoOpenKey: boolean
}) {
  return (
    <DialogElements open={autoOpenKey}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{subTitle}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </DialogElements>
  )
}
