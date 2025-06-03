import Head from 'next/head'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function MarketPage() {
  return (
    <>
      <Head>
        <title>Продажа - USTA</title>
      </Head>
      <main className="min-h-screen p-6 bg-white">
        <h1 className="text-3xl font-bold mb-4 text-center">Категории товаров</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            'Инструменты', 'Б/у техника', 'Запчасти', 'Мебель', 'Автотовары', 'Оборудование', 'Строительные материалы'
          ].map((item, i) => (
            <Card key={i} className="hover:shadow-md">
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-2">{item}</h2>
                <Button className="w-full">Смотреть</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  )
}
