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

export function Dialog({
  title,
  subTitle,
  cancelMention = 'Cancel',
  contents,
  children,
  action,
  onCancel,
  autoOpenKey,
}: {
  title: string
  subTitle: string
  cancelMention?: string
  contents?: React.ReactNode
  children?: React.ReactNode
  action?: (helpers: { close: () => void }) => React.ReactNode
  onCancel?: () => void
  autoOpenKey?: string | null
}) {
  const [open, setOpen] = React.useState(false)
  const lastAutoKeyRef = React.useRef<string | null>(null)

  // autoOpenKey가 생기면 자동으로 열기
  React.useEffect(() => {
    if (!autoOpenKey) return

    // 같은 메시지로는 재오픈 안 함 (무한 반복 방지)
    if (lastAutoKeyRef.current === autoOpenKey) return
    lastAutoKeyRef.current = autoOpenKey

    setOpen(true)
  }, [autoOpenKey])

  const close = React.useCallback(() => {
    setOpen(false)
  }, [])

  const handleCancel = React.useCallback(() => {
    onCancel?.()
    close()
  }, [onCancel, close])

  return (
    <DialogElements open={open} onOpenChange={setOpen}>
      {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{subTitle}</DialogDescription>
        </DialogHeader>

        {contents && <div className="flex w-full items-center gap-2">{contents}</div>}

        <DialogFooter className="sm:justify-start">
          <div className="flex w-full items-center justify-end gap-2">
            {/* cancelMention이 있으면 취소 버튼 */}
            {cancelMention ? (
              <Button type="button" variant="cancel" onClick={handleCancel}>
                {cancelMention}
              </Button>
            ) : null}

            {action?.({ close })}
          </div>
        </DialogFooter>
      </DialogContent>
    </DialogElements>
  )
}
