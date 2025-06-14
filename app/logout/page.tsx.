'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    // ❌ Удаляем куку
    document.cookie = 'usta-auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

    // 🔁 Перенаправляем на /login
    router.push('/login')
  }, [router])

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500 text-lg">Выход...</p>
    </main>
  )
}
