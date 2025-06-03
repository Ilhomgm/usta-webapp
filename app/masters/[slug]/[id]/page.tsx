import { useParams } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Head from 'next/head'

export default function MasterProfilePage() {
  const params = useParams()
  const category = decodeURIComponent(params.slug || '')
  const masterId = params.id

  // Пример временных данных
  const master = {
    name: 'Иван Петров',
    rating: 4.8,
    experience: '5 лет',
    bio: 'Профессиональный электрик с опытом более 5 лет. Работаю аккуратно и быстро.',
    photo: '/master.jpg',
    phone: '+998 90 123 45 67',
    location: 'Ташкент, Чиланзар',
    reviews: [
      { name: 'Азамат', text: 'Отличная работа! Всё сделал быстро и качественно.', rating: 5 },
      { name: 'Мирзо', text: 'Приехал вовремя, всё понравилось!', rating: 4.5 }
    ]
  }

  return (
    <>
      <Head>
        <title>{master.name} – профиль</title>
      </Head>
      <main className="min-h-screen px-6 py-10 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Image src={master.photo} width={150} height={150} alt={master.name} className="rounded-full" />
            <div>
              <h1 className="text-2xl font-bold">{master.name}</h1>
              <p className="text-gray-600">Категория: {category}</p>
              <p className="text-sm text-gray-500">Опыт: {master.experience}</p>
              <p className="text-yellow-600 font-bold mt-1">Рейтинг: {master.rating} ⭐</p>
              <p className="text-sm mt-2 text-gray-700">{master.bio}</p>
              <p className="text-sm mt-2 text-gray-700">📍 {master.location}</p>
              <Button className="mt-4">Позвонить: {master.phone}</Button>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Отзывы</h2>
            <div className="space-y-4">
              {master.reviews.map((review, i) => (
                <div key={i} className="border rounded-md p-4 shadow-sm">
                  <p className="font-semibold">{review.name}</p>
                  <p className="text-sm text-gray-600 italic">"{review.text}"</p>
                  <p className="text-yellow-500 mt-1">Оценка: {review.rating} ⭐</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
