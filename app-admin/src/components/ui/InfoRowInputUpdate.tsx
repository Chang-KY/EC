'use client'

import React, { useState, useTransition } from 'react'
import { Check, FilePenLine, X } from 'lucide-react'
import { infoRowUpdateAtomsButtonAtom } from '@/store/infoRowUpdateAtoms'
import { useAtom } from 'jotai'
import Input from '@/components/ui/Input'
import { useRouter } from 'next/navigation'
import { InputNumberNotForm } from '@/components/ui/InputNumberNotForm'

type ActionResult = { ok: true } | { ok: false; message: string }

type UpdatePayload<TId extends string | number> = { id: TId } & Record<
  string,
  string | number | undefined
>

export type UpdateAction<TId extends string | number> = (
  data: UpdatePayload<TId>,
) => Promise<ActionResult>

export default function InfoRowInputUpdate<TId extends string | number>({
  targetId,
  id,
  inputTypeNumber = false,
  initialValue,
  field,
  action,
  inputProps,
}: {
  targetId?: string
  id: TId
  inputTypeNumber?: boolean
  initialValue: string | number
  field: string
  action: UpdateAction<TId>
  inputProps?: Omit<React.ComponentProps<typeof Input>, 'value' | 'onChange' | 'disabled'>
}) {
  const [isUpdate, setIsUpdate] = useAtom(infoRowUpdateAtomsButtonAtom)
  const [value, setValue] = useState<string | number>(initialValue ?? '')
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  const close = () => setIsUpdate(undefined)

  const save = () => {
    startTransition(async () => {
      const payload = {
        id, // 숫자로 변환 가능하면 number, 아니면 string(uuid 그대로)
        [field]: value,
      }

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
            {inputTypeNumber ? (
              <InputNumberNotForm
                value={value}
                onValueChange={(raw) => setValue(raw)}
                disabled={pending}
                {...inputProps}
              />
            ) : (
              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={pending}
                {...inputProps}
              />
            )}

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
