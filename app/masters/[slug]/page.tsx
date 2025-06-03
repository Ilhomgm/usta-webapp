import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import Head from 'next/head'

const sampleMasters = [
  {
    id: 1,
    name: 'Иван Петров',
    rating: 4.8,
    experience: '5 лет',
    photo: '/master.jpg',
  },
  {
    id: 2,
    name: 'Али Беков',
    rating: 4.6,
    experience: '3 года',
    photo: '/master.jpg',
  },
  {
    id: 3,
    name: 'Сергей Назаров',
    rating: 4.9,
    experience: '7 лет',
    photo: '/master.jpg',
  }
]

export default function CategoryPage() {
  const params = useParams()
  const category = decodeURIComponent(params.slug || '')

  return (
    <>
      <Head>
        <title>{category} – мастера</title>
      </Head>
      <main className="min-h-screen px-6 py-8 bg-white">
        <h1 className="text-3xl font-bold mb-6 text-center">Мастера категории: {category}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sampleMasters.map(master => (
            <Card key={master.id} className="hover:shadow-lg transition">
              <CardContent className="p-4 text-center">
                <Image src={master.photo} width={100} height={100} alt={master.name} className="rounded-full mx-auto mb-3" />
                <h2 className="text-lg font-semibold">{master.name}</h2>
                <p className="text-sm text-gray-600">Опыт: {master.experience}</p>
                <p className="text-yellow-600 font-bold">Рейтинг: {master.rating} ⭐</p>
                <Button className="mt-3 w-full">Связаться</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  )
}
