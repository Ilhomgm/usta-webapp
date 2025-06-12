'use client'

import Head from 'next/head'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <>
      <Head>
        <title>USTA — Найди своего мастера</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-5xl font-bold mb-4">USTA</h1>
        <p className="text-xl text-gray-600 mb-6">
          Умный помощник по поиску мастеров, услуг и специалистов.
        </p>
        <div className="flex space-x-4">
          <Link href="/masters"><Button>🔧 Мастера</Button></Link>
          <Link href="/admin"><Button variant="outline">🛠 Админ-панель</Button></Link>
        </div>
      </main>
    </>
  )
}
