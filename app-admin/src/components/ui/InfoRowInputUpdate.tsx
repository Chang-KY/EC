'use client'
import React, { useState, useTransition } from 'react'
import { Check, FilePenLine, X } from 'lucide-react'
import { infoRowUpdateAtomsButtonAtom } from '@/store/infoRowUpdateAtoms'
import { useAtom } from 'jotai'
import Input from '@/components/ui/Input'
import { useRouter } from 'next/navigation'

type ActionResult = { ok: true } | { ok: false; message: string }
type UpdateAction = (data: { adminId: string } & Record<string, string>) => Promise<ActionResult>

export default function InfoRowInputUpdate({
  targetId,
  adminId,
  initialValue,
  field,
  action,
  inputProps,
  normalize = (v) => v,
}: {
  targetId?: string
  adminId: string
  initialValue: string
  field: string
  action: UpdateAction
  inputProps?: Omit<React.ComponentProps<typeof Input>, 'value' | 'onChange' | 'disabled'>
  normalize?: (v: string) => string
}) {
  const [isUpdate, setIsUpdate] = useAtom(infoRowUpdateAtomsButtonAtom)
  const [value, setValue] = useState(initialValue ?? '')
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  const close = () => setIsUpdate(undefined)

  const save = () => {
    startTransition(async () => {
      const payload = {
        adminId,
        [field]: normalize(value),
      } as { adminId: string } & Record<string, string>
      const res = await action(payload)
      if (!res.ok) return
      close()
      router.refresh()
    })
  }

  const cancel = () => {
    setValue(initialValue ?? '')
    close()
  }

  return (
    <>
      {isUpdate === targetId && (
        <div className="absolute inset-0 w-full bg-white">
          <div className="absolute inset-0 flex size-full items-center justify-between gap-3 bg-white">
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={pending}
              {...inputProps}
            />

            <div className="flex justify-end gap-1">
              <button
                type="button"
                className="inline-flex size-6 items-center justify-center rounded-md border border-emerald-200/60 bg-emerald-50/40 text-emerald-700/70 transition hover:bg-emerald-50/80 hover:text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200/70 dark:hover:bg-emerald-950/50"
                aria-label="저장"
                onClick={save}
                disabled={pending}
              >
                <Check className="size-4" />
              </button>

              <button
                type="button"
                className="inline-flex size-6 items-center justify-center rounded-md border border-gray-200/80 bg-gray-50/40 text-gray-600/70 transition hover:bg-gray-50/80 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-950/30 dark:text-gray-300/70 dark:hover:bg-gray-950/50"
                aria-label="취소"
                onClick={cancel}
                disabled={pending}
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        className="rounded-full bg-indigo-50/50 p-1 hover:bg-indigo-200"
        title="수정"
        onClick={() => setIsUpdate(targetId)}
      >
        <FilePenLine size={14} />
      </button>
    </>
  )
}
