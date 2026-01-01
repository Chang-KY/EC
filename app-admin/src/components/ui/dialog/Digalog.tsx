'use client'

import React from 'react'
import {
  DialogContent,
  DialogDescription,
  DialogElements,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog/dialogElements'
import Button from '@/components/ui/Button'

export function DialogCloseButton({
  title,
  subTitle,
  contents,
  children,
  action,
  onCancel,
}: {
  title: string
  subTitle: string
  contents: React.ReactNode
  children: React.ReactNode
  action?: (helpers: { close: () => void }) => React.ReactNode
  onCancel?: () => void
}) {
  const [open, setOpen] = React.useState(false)

  const close = React.useCallback(() => {
    setOpen(false)
  }, [])

  const handleCancel = React.useCallback(() => {
    onCancel?.()
    close()
  }, [onCancel, close])

  return (
    <DialogElements open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{subTitle}</DialogDescription>
        </DialogHeader>

        <div className="flex w-full items-center gap-2">{contents}</div>

        <DialogFooter className="sm:justify-start">
          <div className="flex w-full items-center justify-end gap-2">
            <Button type="button" variant="cancel" onClick={handleCancel}>
              Cancel
            </Button>

            {action?.({ close })}
          </div>
        </DialogFooter>
      </DialogContent>
    </DialogElements>
  )
}
