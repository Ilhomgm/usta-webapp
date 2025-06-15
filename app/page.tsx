'use client'

import { useEffect } from 'react'

export default function HomePage() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.expand()
      window.Telegram.WebApp.ready()
    }
  }, [])

  return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <h1 className="text-3xl font-bold">Добро пожаловать в USTA WebApp!</h1>
    </main>
  )
}
