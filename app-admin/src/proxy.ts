import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabase } from '@/utils/supabase/supabase'

const PUBLIC_PATHS = ['/login'] // 여기만 비로그인 허용
const AFTER_LOGIN = '/'

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  // Next 내부/정적 파일은 matcher에서 대부분 걸러지지만, 혹시 몰라 한 번 더 방어
  if (
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico' ||
    /\.(?:png|jpg|jpeg|gif|svg|ico|css|js|woff2?)$/.test(pathname)
  ) {
    return NextResponse.next()
  }

  const response = NextResponse.next()

  const sb = await supabase()
  const {
    data: { user },
    error,
  } = await sb.auth.getUser()

  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))

  // 1) 비로그인: public 아니면 전부 /login으로
  if (!user && !isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname + search) // 원래 가려던 곳
    return NextResponse.redirect(url)
  }

  // 2) 로그인: /login 들어오면 홈/대시보드로
  if (user && isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = AFTER_LOGIN
    url.search = ''
    return NextResponse.redirect(url)
  }

  return response
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)'],
}
