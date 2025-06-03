'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Head from 'next/head'

export default function AdminHomePage() {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Админка - USTA</title>
      </Head>
      <main className="min-h-screen p-6 bg-white flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold mb-4">Добро пожаловать в админ-панель USTA</h1>
        <p className="text-lg mb-6 text-gray-600">Выберите нужный раздел ниже:</p>
        <div className="flex space-x-4">
          <Button onClick={() => router.push('/admin/dashboard')}>📊 Панель</Button>
          <Button onClick={() => router.push('/admin/analytics')}>📈 Аналитика</Button>
        </div>
      </main>
    </>
  )
}
