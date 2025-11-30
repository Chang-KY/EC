import { PageMeta } from '@/config/meta/types'
import { adminRouteMeta } from '@/config/meta/route/admins'
import { productRouteMeta } from '@/config/meta/route/products'
import { analyticsRouteMeta } from '@/config/meta/route/analytics'
import { categoriesRouteMeta } from '@/config/meta/route/categories'
import { couponsRouteMeta } from '@/config/meta/route/coupons'
import { filesRouteMeta } from '@/config/meta/route/files'
import { notificationsRouteMeta } from '@/config/meta/route/notifications'
import { ordersRouteMeta } from '@/config/meta/route/orders'
import { reviewsRouteMeta } from '@/config/meta/route/reviews'
import { settingsRouteMeta } from '@/config/meta/route/settings'
import { usersRouteMeta } from '@/config/meta/route/users'
import { dashboardRouteMeta } from '@/config/meta/route/dashboard'

export const defaultMeta: PageMeta = {
  title: '에러 페이지',
  subtitle: '존재하지 않는 페이지 입니다.',
}

export const routeMeta: {
  test: (p: string) => boolean
  meta: (p: string) => PageMeta
}[] = [
  ...dashboardRouteMeta,
  ...adminRouteMeta,
  ...productRouteMeta,
  ...analyticsRouteMeta,
  ...categoriesRouteMeta,
  ...couponsRouteMeta,
  ...filesRouteMeta,
  ...notificationsRouteMeta,
  ...ordersRouteMeta,
  ...reviewsRouteMeta,
  ...settingsRouteMeta,
  ...usersRouteMeta,
]
