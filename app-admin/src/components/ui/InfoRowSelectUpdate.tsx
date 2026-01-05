'use client'

import React, { useTransition } from 'react'
import clsx from 'clsx'
import { Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import DropdownButton from '@/components/ui/DropdownButton'

type ActionResult = { ok: true } | { ok: false; message: string }

type UpdatePayload<TId extends string | number> = { id: TId } & Record<
  string,
  string | number | undefined
>

export type UpdateAction<TId extends string | number> = (
  data: UpdatePayload<TId>,
) => Promise<ActionResult>

export default function InfoRowSelectUpdate<TId extends string | number>({
  id,
  field,
  value,
  label,
  disabled,
  action,
}: {
  id: TId
  field: string
  label: string
  disabled: boolean
  value: string
  action: UpdateAction<TId>
}) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  const handleSelect = () => {
    if (disabled) return

    startTransition(async () => {
      const payload = {
        id: id,
        [field]: value,
      }

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
