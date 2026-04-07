import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
  AUTH_ACCESS_TOKEN_COOKIE,
  AUTH_REFRESH_TOKEN_COOKIE,
  authCookieOptions,
  verifyAccessToken,
  createSupabaseServerAuthClient
} from './src/lib/supabaseClient'

const protectedPrefixes = ['/finanzas', '/carteras', '/presupuestos']
const publicAuthPaths = ['/login', '/register']

const isProtectedPath = (pathname: string): boolean => (
  protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
)
const isPublicAuthPath = (pathname: string): boolean => publicAuthPaths.includes(pathname)

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isProtected = isProtectedPath(pathname)
  const isPublicAuth = isPublicAuthPath(pathname)

  if (!isProtected && !isPublicAuth) {
    return NextResponse.next()
  }

  const accessToken = request.cookies.get(AUTH_ACCESS_TOKEN_COOKIE)?.value
  const refreshToken = request.cookies.get(AUTH_REFRESH_TOKEN_COOKIE)?.value

  let isValidSession = false
  let cookiesToSet: { access: string; refresh: string; expiresIn: number } | null = null

  if (accessToken) {
    try {
      isValidSession = await verifyAccessToken(accessToken)
    } catch (error) {
      console.error('[middleware] No se pudo verificar el access token.', error)
      isValidSession = false
    }
  }

  if (!isValidSession && refreshToken) {
    try {
      const supabase = createSupabaseServerAuthClient()
      const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken })

      if (data.session && !error) {
        isValidSession = true
        cookiesToSet = {
          access: data.session.access_token,
          refresh: data.session.refresh_token,
          expiresIn: data.session.expires_in
        }
      }
    } catch (error) {
      console.error('[middleware] No se pudo refrescar la sesion.', error)
    }
  }

  let response: NextResponse

  if (!isValidSession) {
    response = isProtected
      ? NextResponse.redirect(new URL('/login', request.url))
      : NextResponse.next()
    response.cookies.delete(AUTH_ACCESS_TOKEN_COOKIE)
    response.cookies.delete(AUTH_REFRESH_TOKEN_COOKIE)
    return response
  }

  if (isPublicAuth) {
    response = NextResponse.redirect(new URL('/finanzas', request.url))
  } else {
    response = NextResponse.next()
  }
  // Actualización de Cookies (Si se renovó la sesión)
  if (cookiesToSet) {
    response.cookies.set({
      name: AUTH_ACCESS_TOKEN_COOKIE,
      value: cookiesToSet.access,
      ...authCookieOptions,
      maxAge: cookiesToSet.expiresIn
    })
    response.cookies.set({
      name: AUTH_REFRESH_TOKEN_COOKIE,
      value: cookiesToSet.refresh,
      ...authCookieOptions,
      maxAge: 60 * 60 * 24 * 30 // Renovar los 30 días
    })
  }
  return response
}

export const config = {
  matcher: ['/login', '/register', '/finanzas/:path*', '/carteras/:path*', '/presupuestos/:path*']
}