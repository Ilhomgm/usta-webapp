'use client'

import { useState } from 'react'
import Head from 'next/head'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

const ADMIN_PASSWORD = 'USTA999X' // Можно заменить на переменную окружения

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      router.push('/admin/dashboard')
    } else {
      setError('Неверный пароль')
    }
  }

  return (
    <>
      <Head>
        <title>Вход администратора - USTA</title>
      </Head>
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <h1 className="text-xl font-bold mb-4 text-center">Вход в админ-панель</h1>
            <Input
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4"
            />
            {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
            <Button className="w-full" onClick={handleLogin}>
              Войти
            </Button>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
