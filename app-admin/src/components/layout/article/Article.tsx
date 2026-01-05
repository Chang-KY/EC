import React from 'react'
import clsx from 'clsx'
import { Ellipsis } from 'lucide-react'
import DropdownMenu from '@/components/ui/DropdownMenu/DropdownMenu'
import ArticleBoard from '@/components/layout/article/ArticleBoard'

type ArticleProps = {
  title?: string
  subtitle?: string
  actions?: React.ReactNode
  menu?: DropdownMenuState[]
} & React.HTMLAttributes<HTMLElement>

export default function Article(props: ArticleProps) {
  const { id, title, subtitle, children, className, actions, menu, ...rest } = props

  const boardContentMap = (menu ?? []).reduce<Record<string, React.ReactNode>>((acc, item) => {
    if (item.boardContent) acc[item.id] = item.boardContent
    return acc
  }, {})

  return (
    <article
      id={`${id}-article`}
      {...rest}
      className={clsx(
        'relative rounded border border-gray-300 bg-white p-5 dark:border-gray-800 dark:bg-black',
        className,
        'h-auto',
      )}
    >
      <ArticleBoard id={id} boardContent={boardContentMap} />
      <div className="absolute top-3 right-3">
        {menu && (
          <DropdownMenu
            align="end"
            triggerButton={<Ellipsis className="size-6 rounded-full p-1" />}
            label="Option"
            menuElement={menu}
          />
        )}
      </div>
      {title && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-black dark:text-white">
              {title}
            </h2>
            {subtitle && <p className="mt-1 text-xs text-gray-400">{subtitle}</p>}
          </div>

          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      )}
      <div className="space-y-3 text-sm">{children}</div>
    </article>
  )
}
