import React from 'react'
import clsx from 'clsx'
import { Ellipsis } from 'lucide-react'
import DropdownMenu from '@/components/ui/dropdown-menu/DropdownMenu'
import ArticleBoard from '@/components/layout/article/ArticleBoard'
import { iconButtonClassName } from '@/constants/iconButtonClassName'
import Required from '@/components/ui/Required'

type ArticleProps = {
  title?: string
  subtitle?: string
  required?: boolean
  actions?: React.ReactNode
  menu?: DropdownMenuState[]
} & React.HTMLAttributes<HTMLElement>

export default function Article(props: ArticleProps) {
  const { id, title, subtitle, children, className, required, actions, menu, ...rest } = props

  const boardContentMap = (menu ?? []).reduce<Record<string, React.ReactNode>>((acc, item) => {
    if (item.boardContent) acc[item.id] = item.boardContent
    return acc
  }, {})

  return (
    <article
      id={id ? `${id}-article` : undefined}
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
            triggerButton={
              <div role="button" className={iconButtonClassName}>
                <Ellipsis size={14} />
              </div>
            }
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
              {required && <Required />}
            </h2>
            {subtitle && (
              <p className="mt-1 text-xs whitespace-pre-line text-gray-400">{subtitle}</p>
            )}
          </div>

          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      )}
      <div className="space-y-3 text-sm">{children}</div>
    </article>
  )
}
