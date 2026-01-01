'use client'

import React, { useCallback, useEffect, useId, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { DialogCloseButton } from '@/components/ui/dialog/Digalog'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Image from 'next/image'

type ImageFieldProps = {
  label?: string
  name: string
  /** multiple이면 여러 장 선택 가능 */
  multiple?: boolean
  /** multiple일 때 최대 장수 제한 */
  maxFiles?: number
  required?: boolean
  accept?: string
  errorMessage?: string
  hint?: string
  className?: string
}

type PreviewItem = {
  file: File
  url: string
  alt?: string
}

export default function ImageField({
  name,
  multiple = false,
  maxFiles = multiple ? 20 : 1,
  required,
  accept = 'image/*',
  errorMessage,
  className = '',
}: ImageFieldProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [items, setItems] = useState<PreviewItem[]>([])
  const [draftAlt, setDraftAlt] = useState<Record<number, string>>({})

  useEffect(() => {
    return () => {
      items.forEach((it) => URL.revokeObjectURL(it.url))
    }
  }, [items])

  useEffect(() => {
    const el = inputRef.current
    if (!el) return

    const dt = new DataTransfer()
    for (const it of items) dt.items.add(it.file)
    el.files = dt.files
  }, [items])

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
        const next: PreviewItem[] = multiple ? [...prev] : []
        const remain = maxFiles - next.length

        const sliced = incoming.slice(0, remain).map((file) => ({
          file,
          url: URL.createObjectURL(file),
          alt: '',
        }))

        return [...next, ...sliced]
      })

      if (inputRef.current) inputRef.current.value = ''
    },
    [maxFiles, multiple],
  )

  const setAltAt = useCallback((index: number, alt: string) => {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, alt } : it)))
  }, [])

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      addFiles(e.target.files)
    },
    [addFiles],
  )

  const resolvedAlt = (it: PreviewItem) => (it.alt?.trim() ? it.alt : it.file.name)

  const removeAt = useCallback((index: number) => {
    setItems((prev) => {
      const target = prev[index]
      if (target) URL.revokeObjectURL(target.url)
      const next = prev.filter((_, i) => i !== index)
      return next
    })
  }, [])

  return (
    <div className={`space-y-2 ${className}`}>
      <button
        type="button"
        onClick={openDialog}
        className="absolute top-7 right-7 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
      >
        파일 선택
      </button>
      <input
        id={inputId}
        ref={inputRef}
        name={name}
        type="file"
        accept={accept}
        multiple={multiple}
        required={required}
        className="sr-only"
        onChange={onChange}
      />

      {!multiple ? (
        <input type="hidden" name={`${name}.alt`} value={items[0]?.alt ?? ''} />
      ) : (
        items.map((it, idx) => (
          <input key={idx} type="hidden" name={`${name}.alt`} value={it.alt ?? ''} />
        ))
      )}

      {items.length > 0 ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {items.map((it, idx) => {
            return (
              <div key={`${it.file.name}-${it.file.size}-${idx}`} className="relative">
                <div
                  className="group relative aspect-square w-full overflow-hidden rounded-md ring-1 transition"
                  title={`ALT - ${draftAlt[idx]}`}
                >
                  <Image
                    src={it.url}
                    alt={resolvedAlt(it)}
                    width={640}
                    height={640}
                    className="h-full w-full object-cover transition group-hover:opacity-80"
                  />

                  <div className="pointer-events-none absolute inset-0">
                    <div className="pointer-events-auto absolute top-2 right-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      {/* ALT 버튼 */}
                      <DialogCloseButton
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
                          // Cancel 누르면 alt 삭제
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
                            저장
                          </Button>
                        )}
                      >
                        {/* trigger button */}
                        <button
                          type="button"
                          onClick={() => {
                            setDraftAlt((prev) => ({ ...prev, [idx]: items[idx]?.alt ?? '' }))
                          }}
                          className="inline-flex size-7 items-center justify-center rounded-full bg-black/55 text-white hover:bg-black/65"
                          title="ALT 입력"
                        >
                          <span className="text-[11px] leading-none font-bold">ALT</span>
                        </button>
                      </DialogCloseButton>

                      {/* 삭제 버튼 */}
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
            )
          })}
        </div>
      ) : null}
      {errorMessage ? <p className="text-sm text-rose-600">{errorMessage}</p> : null}
    </div>
  )
}
