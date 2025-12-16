import React from 'react'
import PageTitle from '@/components/layout/PageTitle'
import clsx from 'clsx'

type SectionProps = {
  pathTitle: string
} & React.HTMLAttributes<HTMLElement>

export default async function Section(props: SectionProps) {
  const { pathTitle, children, className, ...rest } = props
  return (
    <section {...rest} className={clsx(className)}>
      <PageTitle pathName={pathTitle} />
      <div className="px-20">{children}</div>
    </section>
  )
}
