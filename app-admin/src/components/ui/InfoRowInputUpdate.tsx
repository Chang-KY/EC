'use client'

import React, { useState, useTransition } from 'react'
import { Check, FilePenLine, X } from 'lucide-react'
import { infoRowUpdateAtomsButtonAtom } from '@/store/infoRowUpdateAtoms'
import { useAtom } from 'jotai'
import Input from '@/components/ui/Input'
import { useRouter } from 'next/navigation'
import { InputNumberNotForm } from '@/components/ui/InputNumberNotForm'
import clsx from 'clsx'
import { generateCouponCode } from '@/features/(authenticated)/commerce/coupons/utils/generateCouponCode'
import Loading from '@/components/loading/Loading'
import { iconButtonClassName } from '@/constants/iconButtonClassName'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toErrorMessages } from '@/utils/toFieldError'

type ActionResult = { ok: true } | { ok: false; message: string }

type UpdatePayload<TId extends string | number> = { id: TId } & Record<
  string,
  string | number | boolean | null | undefined | unknown
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
  isViewValueLength,
  maxLength,
  icon,
  onIconClick,
}: {
  targetId?: string
  id: TId
  inputTypeNumber?: boolean
  initialValue: string | number
  field: string
  action: UpdateAction<TId>
  inputProps?: Omit<React.ComponentProps<typeof Input>, 'value' | 'onChange' | 'disabled'>
  isViewValueLength?: boolean
  maxLength?: number
  icon?: React.ReactNode
  onIconClick?: () => void
}) {
  const [isUpdate, setIsUpdate] = useAtom(infoRowUpdateAtomsButtonAtom)
  const [value, setValue] = useState<string | number>(initialValue ?? '')
  const router = useRouter()
  const close = () => setIsUpdate(undefined)

  const mutation = useMutation({
    mutationFn: async (nextValue: string | number) => {
      const payload = {
        id,
        [field]: nextValue,
      }
      const res = await action(payload)
      if (!res.ok) {
        throw new Error(res.message)
      }
      return res
    },
    onSuccess: async () => {
      close()
      router.refresh()
    },
  })

  const isBusy = mutation.isPending

  const save = () => {
    mutation.mutate(value)
  }

  const cancel = () => {
    setValue(initialValue ?? '')
    mutation.reset()
    close()
  }

  const handleIconClick = React.useCallback(() => {
    mutation.reset()

    if (onIconClick) {
      onIconClick()
      return
    }

    setValue(generateCouponCode(16))
  }, [mutation, onIconClick])

  return (
    <>
      {isUpdate === targetId && (
        <>
          {isBusy && (
            <div className="absolute inset-x-0 z-10 flex h-[50px] w-[calc(100%+1rem)] items-center justify-center gap-3 rounded-md bg-indigo-100/80">
              <Loading size={20} />
              <span className="text-xs">수정중입니다...</span>
            </div>
          )}
          <div className="absolute inset-0 flex size-full items-center justify-between gap-3 bg-white">
            {inputTypeNumber ? (
              <InputNumberNotForm
                value={value}
                onValueChange={(raw) => {
                  mutation.reset()
                  setValue(raw)
                }}
                disabled={isBusy}
                {...inputProps}
              />
            ) : (
              <Input
                maxLength={maxLength}
                value={value}
                onChange={(e) => {
                  mutation.reset()
                  setValue(e.target.value)
                }}
                disabled={isBusy}
                {...inputProps}
              />
            )}
            {isViewValueLength && (
              <span
                className={clsx('absolute -bottom-1 text-[10px]', icon ? 'right-27' : 'right-17.5')}
              >
                {(value as string).length} / {maxLength}
              </span>
            )}
            {mutation.isError && (
              <div className="absolute inset-x-0 top-10 z-10 mb-3 w-[calc(100%+3.5rem)] rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                <ul className="space-y-1">
                  {toErrorMessages(mutation.error).map((message, index) => (
                    <li key={`${message}-${index}`}>{message}</li>
                  ))}
                </ul>
              </div>
            )}
            {icon && (
              <button
                type="button"
                onClick={handleIconClick}
                className="absolute inset-y-0 right-18 size-6.5"
              >
                {icon}
              </button>
            )}

            <div className="flex justify-end gap-1">
              <button
                type="button"
                className="inline-flex size-6 items-center justify-center rounded-md border border-emerald-200/60 bg-emerald-50/40 text-emerald-700/70 transition hover:bg-emerald-50/80 hover:text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200/70 dark:hover:bg-emerald-950/50"
                aria-label="저장"
                onClick={save}
                disabled={isBusy}
              >
                <Check className="size-4" />
              </button>

              <button
                type="button"
                className="inline-flex size-6 items-center justify-center rounded-md border border-gray-200/80 bg-gray-50/40 text-gray-600/70 transition hover:bg-gray-50/80 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-950/30 dark:text-gray-300/70 dark:hover:bg-gray-950/50"
                aria-label="취소"
                onClick={cancel}
                disabled={isBusy}
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        </>
      )}

      <button
        type="button"
        className={iconButtonClassName}
        title="수정"
        onClick={() => setIsUpdate(targetId)}
      >
        <FilePenLine size={14} />
      </button>
    </>
  )
}
