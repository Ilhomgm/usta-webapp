import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function MastersPage() {
  const categories = [
    { name: 'Электрик', icon: '/illustration.png' },
    { name: 'Сантехник', icon: '/illustration.png' },
    { name: 'Строитель', icon: '/illustration.png' },
    { name: 'Клининг', icon: '/illustration.png' },
    { name: 'Маляр', icon: '/illustration.png' },
    { name: 'Автомеханик', icon: '/illustration.png' },
    { name: 'Кондиционерщик', icon: '/illustration.png' },
    { name: 'Мебельщик', icon: '/illustration.png' },
    { name: 'Сварщик', icon: '/illustration.png' }
  ]

  return (
    <>
      <Head>
        <title>Категории мастеров – USTA</title>
      </Head>
      <main className="min-h-screen px-6 py-8 bg-gray-50">
        <h1 className="text-4xl font-bold text-center mb-8">Категории мастеров</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <Card key={idx} className="hover:shadow-lg transition">
              <CardContent className="p-4 text-center">
                <Image src={cat.icon} width={100} height={100} alt={cat.name} className="mx-auto mb-3" />
                <h2 className="text-lg font-semibold mb-2">{cat.name}</h2>
                <Link href={`/masters/${cat.name.toLowerCase()}`}>
                  <Button className="w-full">Найти</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  )
}
