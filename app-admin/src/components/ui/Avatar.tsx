'use client'

import * as React from 'react'
import Image, { type ImageProps } from 'next/image'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const avatarVariants = cva(
  'relative inline-flex shrink-0 overflow-hidden bg-gray-200 text-gray-700 dark:bg-zinc-800 dark:text-zinc-200',
  {
    variants: {
      size: {
        xs: 'h-6 w-6 text-[10px]',
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-base',
        xl: 'h-16 w-16 text-lg',
      },
      shape: {
        circle: 'rounded-full',
        rounded: 'rounded-xl',
        square: 'rounded-none',
      },
      ring: {
        none: '',
        default: 'ring-1 ring-border border-gray-300 dark:border-gray-800',
      },
    },
    defaultVariants: {
      size: 'md',
      shape: 'circle',
      ring: 'none',
    },
  },
)

type AvatarProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> &
  VariantProps<typeof avatarVariants> & {
    src?: ImageProps['src'] | null
    alt?: string
    /** 이미지가 없거나 로딩 실패 시 보여줄 내용 (없으면 alt에서 이니셜 생성) */
    fallback?: React.ReactNode
    priority?: boolean
    quality?: number
    sizes?: string
    hideFallbackOnLoading?: boolean
    imageClassName?: string
  }

function initialsFromAlt(alt?: string) {
  if (!alt) return '?'
  const clean = alt.trim()
  if (!clean) return '?'
  // 한글/영문 둘 다 대응: 단어 첫 글자 2개
  const parts = clean.split(/\s+/).slice(0, 2)
  return parts
    .map((p) => p[0])
    .join('')
    .toUpperCase()
}

function defaultSizes(size: AvatarProps['size']) {
  switch (size) {
    case 'xs':
      return '24px'
    case 'sm':
      return '32px'
    case 'md':
      return '40px'
    case 'lg':
      return '48px'
    case 'xl':
      return '64px'
    default:
      return '40px'
  }
}

export function Avatar({
  className,
  size,
  shape,
  ring,
  src,
  alt,
  fallback,
  priority,
  quality,
  sizes,
  hideFallbackOnLoading = false,
  imageClassName,
  ...rest
}: AvatarProps) {
  const [loaded, setLoaded] = React.useState(false)
  const [errored, setErrored] = React.useState(false)

  React.useEffect(() => {
    // src 바뀌면 로딩 상태 리셋
    setLoaded(false)
    setErrored(false)
  }, [src])

  const showImage = Boolean(src) && Boolean(alt) && !errored
  const showFallback = !showImage || (!loaded && !hideFallbackOnLoading)

  const fallbackNode = fallback ?? (
    <span className="font-semibold select-none">{initialsFromAlt(alt)}</span>
  )

  return (
    <div
      className={cn(avatarVariants({ size, shape, ring }), className)}
      aria-label={alt}
      {...rest}
    >
      {showImage && (
        <Image
          fill
          src={src as ImageProps['src']}
          alt={alt as string}
          priority={priority}
          quality={quality}
          sizes={sizes ?? defaultSizes(size)}
          className={cn('object-cover', imageClassName)}
          onLoadingComplete={() => setLoaded(true)}
          onError={() => setErrored(true)}
        />
      )}

      {/* Fallback 레이어 */}
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center',
          showFallback ? 'opacity-100' : 'opacity-0',
          'transition-opacity duration-150',
        )}
        aria-hidden={!showFallback}
      >
        {fallbackNode}
      </div>
    </div>
  )
}
