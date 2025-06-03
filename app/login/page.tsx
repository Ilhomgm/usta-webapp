'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'USTA-KOROL-999X') {
      // ✅ Ставим куку
      document.cookie = 'usta-auth=USTA-KOROL-999X; path=/'

      // 🔁 Переход в админку
      router.push('/admin')
    } else {
      alert('Неверный пароль')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <form onSubmit={handleLogin} className="p-6 border rounded-lg shadow w-full max-w-sm">
        <h1 className="text-xl font-bold mb-4 text-center">Вход в панель администратора</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Введите пароль"
          className="w-full px-4 py-2 border mb-4 rounded"
        />
        <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
          Войти
        </button>
      </form>
    </main>
  )
}
