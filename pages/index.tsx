import Head from 'next/head'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Head>
        <title>USTA SuperApp</title>
        <meta name="description" content="Универсальный сервис мастеров и услуг по всему Узбекистану и миру" />
      </Head>

      <main className="min-h-screen bg-gradient-to-tr from-gray-50 via-white to-gray-100 p-6">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-2">USTA SuperApp</h1>
          <p className="text-gray-600 text-lg">Найди лучших мастеров, закажи услуги, продай или купи — всё в одном месте.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { title: 'Мастера', description: 'Электрики, сантехники, строители и др.', href: '/masters' },
            { title: 'Услуги', description: 'Бытовые, авто, IT, клининг и многое другое.', href: '/services' },
            { title: 'Продажа', description: 'Покупай и продавай технику, инструменты и всё нужное.', href: '/market' },
          ].map((item, index) => (
            <Card key={index} className="hover:shadow-xl transition duration-200">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                <p className="text-sm text-gray-500 mb-4">{item.description}</p>
                <Link href={item.href}>
                  <Button className="w-full">Перейти</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  )
}
