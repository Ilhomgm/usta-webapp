'use client'

import Head from 'next/head'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Order {
  id: number
  clientName: string
  description: string
  category: string
  status: 'новая' | 'в работе' | 'завершена' | 'отклонена'
}

const initialOrders: Order[] = [
  {
    id: 1,
    clientName: 'Сардор Хасанов',
    description: 'Не работает розетка в комнате',
    category: 'Электрик',
    status: 'новая'
  },
  {
    id: 2,
    clientName: 'Дилором Саидова',
    description: 'Протечка под мойкой',
    category: 'Сантехник',
    status: 'в работе'
  }
]

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders)

  const updateStatus = (id: number, newStatus: Order['status']) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    )
  }

  return (
    <>
      <Head>
        <title>Заявки - Админка</title>
      </Head>
      <main className="min-h-screen p-6 bg-gray-100">
        <h1 className="text-2xl font-bold mb-4 text-center">Заявки от клиентов</h1>
        <div className="grid gap-6">
          {orders.map(order => (
            <Card key={order.id}>
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">{order.clientName}</h2>
                    <p className="text-sm text-gray-600">{order.category}</p>
                    <p className="text-sm">{order.description}</p>
                    <p className="text-sm font-medium">
                      Статус:{' '}
                      <span className={
                        order.status === 'новая' ? 'text-blue-600' :
                        order.status === 'в работе' ? 'text-yellow-600' :
                        order.status === 'завершена' ? 'text-green-600' :
                        'text-red-600'
                      }>
                        {order.status}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button onClick={() => updateStatus(order.id, 'в работе')}>В работу</Button>
                    <Button onClick={() => updateStatus(order.id, 'завершена')}>Завершить</Button>
                    <Button variant="destructive" onClick={() => updateStatus(order.id, 'отклонена')}>
                      Отклонить
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
