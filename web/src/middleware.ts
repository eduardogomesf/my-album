import { AxiosError } from 'axios'
import { NextRequest, NextResponse } from 'next/server'

import { api } from './app/lib/axios'

function removeAuthCookies(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/sign-in', request.url))
  response.cookies.delete('accessToken')
  response.cookies.delete('refreshToken')
  response.cookies.delete('userId')
  return response
}

async function refreshToken(
  request: NextRequest,
  userId: string,
  refreshToken: string,
) {
  let tokenWasRefreshed = true

  const response = await api
    .post(
      '/refresh-token',
      {},
      {
        headers: {
          Cookie: `refreshToken=${refreshToken}; userId=${userId}`,
        },
      },
    )
    .catch((error: AxiosError) => {
      console.log(error?.response?.data)
      tokenWasRefreshed = false
    })

  if (!tokenWasRefreshed) {
    return removeAuthCookies(request)
  }

  const middlewareResponse = NextResponse.next()

  const cookies = response?.headers['set-cookie'] as unknown as string

  middlewareResponse.headers.set('Set-Cookie', cookies)

  return middlewareResponse
}

const publicPathnames = ['/sign-in', '/sign-up']

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname

  if (url === '/sign-out') {
    return removeAuthCookies(request)
  }

  const accessTokenCookie = request.cookies.get('accessToken')

  if (publicPathnames.includes(url)) {
    if (accessTokenCookie?.value) {
      return NextResponse.redirect(new URL('/', request.url))
    } else {
      return NextResponse.next()
    }
  }

  if (!accessTokenCookie?.value) {
    const refreshTokenCookie = request.cookies.get('refreshToken')
    const userIdCookie = request.cookies.get('userId')

    if (!refreshTokenCookie?.value || !userIdCookie?.value) {
      return removeAuthCookies(request)
    } else {
      return await refreshToken(
        request,
        userIdCookie.value,
        refreshTokenCookie.value,
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/((?!api|static|.*\\..*|_next).*)',
}
