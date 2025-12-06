import { defaultMeta, routeMeta } from '@/config/meta/routeMeta'

export function getPageMeta(pathname: string) {
  const found = routeMeta.find((r) => r.test(pathname))
  return found ? found.meta(pathname) : defaultMeta
}
