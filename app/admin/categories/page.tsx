'use client'

import Head from 'next/head'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<string[]>([
    'Электрик',
    'Сантехник',
    'Маляр',
    'Клининг',
    'Сварщик'
  ])
  const [newCategory, setNewCategory] = useState('')

  const addCategory = () => {
    if (newCategory.trim() !== '' && !categories.includes(newCategory.trim())) {
      setCategories(prev => [...prev, newCategory.trim()])
      setNewCategory('')
    }
  }

  const removeCategory = (category: string) => {
    setCategories(prev => prev.filter(c => c !== category))
  }

  return (
    <>
      <Head>
        <title>Категории мастеров - Админка</title>
      </Head>
      <main className="min-h-screen p-6 bg-gray-100">
        <h1 className="text-2xl font-bold mb-4 text-center">Категории мастеров</h1>

        <div className="mb-6 flex gap-4 items-center">
          <Input
            placeholder="Новая категория"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
          />
          <Button onClick={addCategory}>Добавить</Button>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((category, i) => (
            <Card key={i}>
              <CardContent className="p-4 flex justify-between items-center">
                <span>{category}</span>
                <Button variant="destructive" size="sm" onClick={() => removeCategory(category)}>
                  Удалить
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  )
}
