'use client'

import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.expand()
      window.Telegram.WebApp.ready()
    }
  }, [])

  return (
    <main style={{ textAlign: 'center', marginTop: '30%' }}>
      <h1 style={{ fontSize: '24px', color: '#00b894' }}>Добро пожаловать в USTA WebApp</h1>
      <p style={{ marginTop: '10px' }}>Вы открыли приложение через Telegram</p>
    </main>
  )
}
