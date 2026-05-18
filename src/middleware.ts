import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // /admin 以外はそのまま通す
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // Cookie を読み書きするためにレスポンスを用意
  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // セッション確認（getUser はサーバー側で安全に検証される）
  const { data: { user } } = await supabase.auth.getUser()

  // 未ログインで /admin/login 以外にアクセス → ログインページへ
  // callbackUrl に元の URL を渡してログイン後に戻れるようにする
  if (!user && pathname !== '/admin/login') {
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // ログイン済みで /admin/login にアクセス → ダッシュボードへ
  if (user && pathname === '/admin/login') {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return response
}

// middleware を動かすパスを指定（静的ファイルは除外）
export const config = {
  matcher: ['/admin/:path*'],
}
