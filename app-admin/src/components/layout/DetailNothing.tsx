import React from 'react'
import Section from '@/components/layout/Section'
import Article from '@/components/layout/article/Article'
import Link from 'next/link'
import AppButton from '@/components/ui/AppButton'

export default async function DetailNothing({
  href,
  title,
  description,
}: {
  href: string
  title: string
  description?: string
}) {
  return (
    <Section pathTitle="not-found">
      <Article title={title}>
        <p className="text-sm text-gray-500">{description}</p>
        <div className="flex items-center justify-end">
          <Link href={href}>
            <AppButton type="button" variant="cancel">
              돌아가기
            </AppButton>
          </Link>
        </div>
      </Article>
    </Section>
  )
}
