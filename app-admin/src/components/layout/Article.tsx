import React from 'react'
import clsx from 'clsx'

type ArticleProps = {
  title?: string
  subtitle?: string
  children: React.ReactNode
  className?: string
} & React.HTMLAttributes<HTMLElement>

export default async function Article(props: ArticleProps) {
  const { title, subtitle, children, className, ...rest } = props

  return (
    <article
      {...rest}
      className={clsx(
        'rounded border border-gray-300 bg-white p-5 dark:border-gray-800 dark:bg-black',
        className,
      )}
    >
      {title && (
        <div className="mb-4">
          <p className="text-sm font-semibold tracking-tight text-black dark:text-white">{title}</p>
          {subtitle && <p className="mt-1 text-xs text-gray-400">{subtitle}</p>}
        </div>
      )}
      <div className="space-y-4 text-sm">{children}</div>
    </article>
  )
}
