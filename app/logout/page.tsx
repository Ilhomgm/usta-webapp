'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
export default function LogoutPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  async function logout() {
    try {
      const result = await fetch('/api/logout', { method: 'POST' })
      if (!result.ok) throw new Error()
      router.replace('/login')
      router.refresh()
    } catch { setError('Не удалось выйти. Попробуйте снова.') }
  }
  return <main className="p-8"><button onClick={logout}>Выйти из аккаунта</button><p role="alert">{error}</p></main>
}

