import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname

  if(url === '/sign-out') {
    const response = NextResponse.redirect(new URL('/sign-in', request.url))
    response.cookies.delete('accessToken')
    response.cookies.delete('refreshToken')
    response.cookies.delete('userId')
    return response
  }


  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * - /sign-in
     * - /sign-up
     */
    '/((?!sign-in|sign-up).*)',
  ],
};