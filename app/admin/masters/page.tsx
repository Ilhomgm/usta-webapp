'use client'

import Head from 'next/head'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Master {
  id: number
  name: string
  phone: string
  category: string
  verified: boolean
}

const sampleMasters: Master[] = [
  { id: 1, name: 'Алишер Ахмедов', phone: '+998 90 123 45 67', category: 'Электрик', verified: true },
  { id: 2, name: 'Бахтиёр Юнусов', phone: '+998 91 765 43 21', category: 'Сантехник', verified: false }
]

export default function AdminMastersPage() {
  const [masters, setMasters] = useState<Master[]>(sampleMasters)

  const toggleVerify = (id: number) => {
    setMasters(prev =>
      prev.map(master =>
        master.id === id ? { ...master, verified: !master.verified } : master
      )
    )
  }

  const removeMaster = (id: number) => {
    setMasters(prev => prev.filter(master => master.id !== id))
  }

  return (
    <>
      <Head>
        <title>Мастера - Админка</title>
      </Head>
      <main className="min-h-screen p-6 bg-gray-50">
        <h1 className="text-2xl font-bold mb-4 text-center">Управление мастерами</h1>
        <div className="grid gap-6">
          {masters.map(master => (
            <Card key={master.id} className="hover:shadow">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">{master.name}</h2>
                    <p className="text-sm text-gray-500">{master.category}</p>
                    <p className="text-sm">{master.phone}</p>
                    <p className="text-sm">
                      Статус:{' '}
                      <span className={master.verified ? 'text-green-600' : 'text-red-600'}>
                        {master.verified ? 'Верифицирован' : 'Не верифицирован'}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button onClick={() => toggleVerify(master.id)}>
                      {master.verified ? 'Снять верификацию' : 'Верифицировать'}
                    </Button>
                    <Button variant="destructive" onClick={() => removeMaster(master.id)}>
                      Удалить
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  )
}
