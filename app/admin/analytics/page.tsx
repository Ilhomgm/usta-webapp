'use client'

import Head from 'next/head'
import { Card, CardContent } from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

const data = [
  { name: 'Пн', заявки: 12 },
  { name: 'Вт', заявки: 18 },
  { name: 'Ср', заявки: 10 },
  { name: 'Чт', заявки: 19 },
  { name: 'Пт', заявки: 25 },
  { name: 'Сб', заявки: 32 },
  { name: 'Вс', заявки: 20 }
]

export default function DashboardPage() {
  return (
    <>
      <Head>
        <title>Аналитика - USTA Admin</title>
      </Head>
      <main className="min-h-screen p-6 bg-white">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Аналитика платформы
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-2">Общее количество заявок</h2>
              <p className="text-2xl font-bold">1,248</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">Заявки по дням</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="заявки" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
