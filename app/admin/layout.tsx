import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { COOKIE_NAME, verifySession } from '@/lib/admin-session.mjs'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  if (!verifySession(cookieStore.get(COOKIE_NAME)?.value)) redirect('/login')
  return <>{children}</>
}
