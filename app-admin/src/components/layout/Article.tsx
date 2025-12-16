import React from 'react'
import clsx from 'clsx'

type ArticleProps = {
  title?: string
  subtitle?: string
  actions?: React.ReactNode
} & React.HTMLAttributes<HTMLElement>

export default function Article(props: ArticleProps) {
  const { title, subtitle, children, className, actions, ...rest } = props

  return (
    <article
      {...rest}
      className={clsx(
        'rounded border border-gray-300 bg-white p-5 dark:border-gray-800 dark:bg-black',
        className,
      )}
    >
      {title && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold tracking-tight text-black dark:text-white">
              {title}
            </p>
            {subtitle && <p className="mt-1 text-xs text-gray-400">{subtitle}</p>}
          </div>

          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      )}
      <div className="space-y-4 text-sm">{children}</div>
    </article>
  )
}
