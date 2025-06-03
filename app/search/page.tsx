'use client'

import { useState } from 'react'
import Head from 'next/head'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const allMasters = [
  { name: 'Алишер Ахмедов', category: 'Электрик', city: 'Ташкент', rating: 4.9 },
  { name: 'Нодир Хамраев', category: 'Сантехник', city: 'Андижан', rating: 4.7 },
  { name: 'Жахонгир Рахмонов', category: 'Автомеханик', city: 'Самарканд', rating: 4.5 },
  // ... можно подключить базу данных позже
]

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [city, setCity] = useState('')
  const [filtered, setFiltered] = useState(allMasters)

  const handleSearch = () => {
    const q = query.toLowerCase()
    const c = city.toLowerCase()
    const result = allMasters.filter(master =>
      master.name.toLowerCase().includes(q) &&
      master.city.toLowerCase().includes(c)
    )
    setFiltered(result)
  }

  return (
    <>
      <Head>
        <title>Поиск мастеров - USTA</title>
      </Head>
      <main className="min-h-screen p-6 bg-white">
        <h1 className="text-2xl font-bold mb-6 text-center">Поиск мастеров</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center">
          <Input
            placeholder="Введите имя или категорию"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full md:w-1/3"
          />
          <Input
            placeholder="Город"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full md:w-1/3"
          />
          <Button onClick={handleSearch}>Поиск</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.length > 0 ? (
            filtered.map((master, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <h2 className="text-lg font-bold">{master.name}</h2>
                  <p className="text-sm text-gray-600">Категория: {master.category}</p>
                  <p className="text-sm text-gray-600">Город: {master.city}</p>
                  <p className="text-sm text-yellow-600">Рейтинг: {master.rating}⭐</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">Ничего не найдено</p>
          )}
        </div>
      </main>
    </>
  )
}
