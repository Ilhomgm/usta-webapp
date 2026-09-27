'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const [pending,setPending] = useState(false)
  const handleLogin = async () => {
    setPending(true)
    setError('')
    try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/admin')
      router.refresh()
    } else {
      setError(res.status===503?'Админка не настроена. Запустите node scripts/setup-local.mjs и перезапустите сервер.':res.status===429?'Слишком много попыток. Повторите через минуту.':'Не удалось войти. Проверьте пароль.')
    }
    }catch{setError('Нет соединения с сервером.')}
    finally{setPending(false)}
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">Администратор USTA</h1>
      <p className="mb-6 text-sm text-gray-600">Локальный пароль находится в ADMIN-ACCESS.local.txt</p>
      <form className="w-full max-w-sm space-y-4" onSubmit={e=>{e.preventDefault();handleLogin()}}>
        <Input
          aria-label="Пароль администратора"
          autoComplete="current-password"
          required
          type="password"
          placeholder="Введите пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button className="w-full" type="submit" disabled={pending}>{pending?'Вход…':'Войти'}</Button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>
    </main>
  )
}
