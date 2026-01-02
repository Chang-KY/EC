'use client'

import React, { useCallback, useEffect, useId, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { Dialog } from '@/components/ui/dialog/Dialog'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Image from 'next/image'
import clsx from 'clsx'
import ErrorMessage from '@/components/ui/ErrorMessage'

type ImageFieldProps = {
  name: string
  multiple?: boolean
  maxFiles?: number
  accept?: string
  errorMessage?: string
  className?: string
  value?: PreviewItem[]
  onValueChange?: React.Dispatch<React.SetStateAction<PreviewItem[]>>
}

export default function ImageField({
  name,
  multiple = false,
  maxFiles = multiple ? 20 : 1,
  accept = 'image/*',
  errorMessage,
  className = '',
  value,
  onValueChange,
}: ImageFieldProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [innerItems, setInnerItems] = useState<PreviewItem[]>([])
  const items = value ?? innerItems
  const setItems = onValueChange ?? setInnerItems

  const [draftAlt, setDraftAlt] = useState<Record<number, string>>({})

  const latestItemsRef = useRef<PreviewItem[]>(items)
  useEffect(() => {
    latestItemsRef.current = items
  }, [items])

  useEffect(() => {
    return () => {
      latestItemsRef.current.forEach((it) => URL.revokeObjectURL(it.url))
    }
  }, [])

  const openDialog = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const addFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return

      const incoming = Array.from(fileList)
        .filter((f) => f.size > 0)
        .filter((f) => f.type.startsWith('image/'))

      if (incoming.length === 0) return

      setItems((prev) => {
        // 단일 모드면 기존 URL 정리
        if (!multiple) prev.forEach((it) => URL.revokeObjectURL(it.url))

        const next: PreviewItem[] = multiple ? [...prev] : []
        const remain = maxFiles - next.length

        const sliced = incoming.slice(0, remain).map((file) => ({
          file,
          url: URL.createObjectURL(file),
          alt: '',
        }))

        return [...next, ...sliced]
      })

      // 같은 파일 다시 선택 가능하게
      if (inputRef.current) inputRef.current.value = ''
    },
    [maxFiles, multiple, setItems],
  )

  const setAltAt = useCallback(
    (index: number, alt: string) => {
      setItems((prev) => prev.map((it, i) => (i === index ? { ...it, alt } : it)))
    },
    [setItems],
  )

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      addFiles(e.target.files)
    },
    [addFiles],
  )

  const resolvedAlt = (it: PreviewItem) => (it.alt?.trim() ? it.alt : it.file.name)

  const removeAt = useCallback(
    (index: number) => {
      setItems((prev) => {
        const target = prev[index]
        if (target) URL.revokeObjectURL(target.url)
        return prev.filter((_, i) => i !== index)
      })
      setDraftAlt((prev) => ({ ...prev, [index]: '' }))
    },
    [setItems],
  )

  return (
    <div className={clsx('space-y-2', className)}>
      <button
        type="button"
        onClick={openDialog}
        className="absolute top-5 right-5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
      >
        파일 선택
      </button>

      {/* input은 트리거 역할(보여지는 “파일이 들어있나”는 신경 X) */}
      <input
        id={inputId}
        ref={inputRef}
        name={name}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={onChange}
      />

      {/* ALT hidden inputs */}
      {!multiple ? (
        <input type="hidden" name={`${name}.alt`} value={items[0]?.alt ?? ''} />
      ) : (
        items.map((it, idx) => (
          <input key={idx} type="hidden" name={`${name}.alt`} value={it.alt ?? ''} />
        ))
      )}

      {items.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, idx) => (
            <div key={`${it.file.name}-${it.file.size}-${idx}`} className="relative">
              <div
                className="group relative aspect-square w-full overflow-hidden rounded-md ring-1 ring-gray-300 transition"
                title={`ALT - ${draftAlt[idx] ?? '지정 안됨'}`}
              >
                <Image
                  src={it.url}
                  alt={resolvedAlt(it)}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition group-hover:opacity-80"
                  fill
                />

                <div className="pointer-events-none absolute inset-0">
                  <div className="pointer-events-auto absolute top-2 right-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <Dialog
                      title="ALT 입력 안내"
                      subTitle="적절한 ALT 텍스트를 제공하면 웹 접근성이 향상되고 SEO에도 긍정적인 영향을 미칩니다."
                      contents={
                        <Input
                          className="w-full"
                          value={draftAlt[idx] ?? ''}
                          onChange={(e) =>
                            setDraftAlt((prev) => ({ ...prev, [idx]: e.target.value }))
                          }
                          placeholder="예: 흰색 배경 위의 검은색 운동화"
                        />
                      }
                      onCancel={() => {
                        setAltAt(idx, '')
                        setDraftAlt((prev) => ({ ...prev, [idx]: '' }))
                      }}
                      action={({ close }) => (
                        <Button
                          variant="add"
                          type="button"
                          onClick={() => {
                            setAltAt(idx, draftAlt[idx] ?? '')
                            close()
                          }}
                        >
                          Save
                        </Button>
                      )}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setDraftAlt((prev) => ({ ...prev, [idx]: items[idx]?.alt ?? '' }))
                        }
                        className="inline-flex size-7 items-center justify-center rounded-full bg-black/55 text-white hover:bg-black/65"
                        title="ALT 입력"
                      >
                        <span className="text-[11px] leading-none font-bold">ALT</span>
                      </button>
                    </Dialog>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        removeAt(idx)
                      }}
                      className="inline-flex size-7 items-center justify-center rounded-full bg-black/55 text-white hover:bg-black/65"
                      title="삭제"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
    </div>
  )
}
