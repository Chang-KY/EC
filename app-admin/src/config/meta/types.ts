import type { AriaAttributes } from 'react'

export type PageMeta = {
  title: string
  subtitle?: string
  breadcrumb?: breadcrumb
}

export type breadcrumb = {
  label: string
  href?: string
  ariaCurrent?: AriaAttributes['aria-current']
}[]

export type RouteMetaConfig = {
  test: (p: string) => boolean
  meta: (p: string) => PageMeta
}
