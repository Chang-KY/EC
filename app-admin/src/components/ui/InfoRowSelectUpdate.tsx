'use client'

import React, { useTransition } from 'react'
import clsx from 'clsx'
import { Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import DropdownButton from '@/components/ui/DropdownButton'

type ActionResult = { ok: true } | { ok: false; message: string }

type UpdateAction = (data: { adminId: string } & Record<string, string>) => Promise<ActionResult>

export default function InfoRowSelectUpdate({
  adminId,
  field,
  value,
  label,
  disabled,
  action,
}: {
  adminId: string
  field: string
  label: string
  disabled: boolean
  value: string
  action: UpdateAction
}) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  const handleSelect = () => {
    if (disabled) return

    startTransition(async () => {
      const payload = {
        adminId,
        [field]: value,
      } as { adminId: string } & Record<string, string>

      const res = await action(payload)
      if (!res.ok) return
      router.refresh()
    })
  }

  return (
    <div
      className={clsx(
        'flex size-full items-center justify-between',
        (disabled || pending) && 'pointer-events-none opacity-70',
      )}
    >
      <DropdownButton label={label} disabled={disabled || pending} onClick={handleSelect} />
      {disabled && <Check className="size-4 text-green-400" />}
    </div>
  )
}
