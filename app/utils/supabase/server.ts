import { createServerClient, parseCookieHeader } from '@supabase/ssr'

export const createServerSupabase = (context: any) => {
  return createServerClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const cookieStr = context.request.headers.get('Cookie') ?? ''
          return parseCookieHeader(cookieStr)
        },
        setAll(cookiesToSet) {
          // Logic set cookie phụ thuộc vào adapter deploy của TanStack Start
        },
      },
    }
  )
}
