'use client'

import Head from 'next/head'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function AdminDashboardPage() {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Админ-панель - USTA</title>
      </Head>
      <main className="min-h-screen p-6 bg-gray-100">
        <h1 className="text-3xl font-bold text-center mb-6">Админ-панель USTA</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg">
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-2">Мастера</h2>
              <p className="text-sm mb-4">Просмотр и управление мастерами.</p>
              <Button onClick={() => router.push('/admin/masters')}>Открыть</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg">
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-2">Заявки</h2>
              <p className="text-sm mb-4">Список всех поступивших заявок.</p>
              <Button onClick={() => router.push('/admin/orders')}>Открыть</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg">
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-2">Категории</h2>
              <p className="text-sm mb-4">Добавление/удаление категорий услуг.</p>
              <Button onClick={() => router.push('/admin/categories')}>Открыть</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
