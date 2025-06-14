'use client'

import { useEffect } from 'react'

export default function MapPage() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.expand()
      window.Telegram.WebApp.ready()
    }
  }, [])

  return (
    <main style={{ padding: '20px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 'bold' }}>📍 Раздел "Мастера на карте"</h1>
      <p style={{ color: 'gray', marginTop: '10px' }}>
        Здесь будет отображаться интерактивная карта мастеров. Пока что идёт разработка.
      </p>
    </main>
  )
}
