'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddMasterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [phone, setPhone] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('/api/add-master', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, category, phone }),
    })

    if (res.ok) {
      alert('Мастер добавлен!')
      router.push('/admin')
    } else {
      alert('Ошибка при добавлении мастера')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg p-6 rounded-xl w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center mb-4">Добавить мастера</h1>
        <input
          type="text"
          placeholder="Имя"
          className="w-full border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Категория (например: электрик)"
          className="w-full border p-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Телефон"
          className="w-full border p-2 rounded"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-600 text-white py-2 w-full rounded hover:bg-blue-700">
          Сохранить
        </button>
      </form>
    </main>
  )
}
