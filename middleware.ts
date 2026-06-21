import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuth = !!req.auth;
  const isAuthPage = pathname.startsWith('/login');
  const isAdminPage = pathname.startsWith('/admin');
  const isApi = pathname.startsWith('/api');

  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    return NextResponse.next();
  }

  if (isAdminPage && !isAuth) {
    let from = pathname;
    if (req.nextUrl.search) {
      from += req.nextUrl.search;
    }

    return NextResponse.redirect(
      new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
    );
  }

  const res = NextResponse.next();

  // 동적 API 응답은 절대 캐시되면 안 됨. Cache-Control이 없으면
  // Cloudflare가 캐시 가능한 응답으로 보고 max-age를 붙여 stale 응답을 서빙한다.
  // (정적 파일을 서빙하는 /api/storage와 next-auth /api/auth는 matcher에서 제외)
  if (isApi) {
    res.headers.set('Cache-Control', 'no-store');
  }

  return res;
});

export const config = {
  matcher: ['/admin/:path*', '/login', '/api/((?!storage|auth).*)'],
};
