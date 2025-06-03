'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Head from 'next/head'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = () => {
    if (password === 'USTA-KOROL-999X') {
      router.push('/admin')
    } else {
      setError('Неверный пароль')
    }
  }

  return (
    <>
      <Head>
        <title>Вход — USTA Admin</title>
      </Head>
      <main className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center">Вход в админ-панель</h1>
          <input
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded"
          />
          {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
          <Button className="w-full" onClick={handleLogin}>Войти</Button>
        </div>
      </main>
    </>
  )
}
