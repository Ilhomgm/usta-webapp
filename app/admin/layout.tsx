import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { COOKIE_NAME, verifySession } from '@/lib/admin-session.mjs'
import AdminSidebar from '@/components/layout/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  if (!verifySession(cookieStore.get(COOKIE_NAME)?.value)) redirect('/login')
  return <div className="flex min-h-screen"><AdminSidebar /><main className="flex-1 p-6 bg-white">{children}</main></div>
}

