'use client'

import { useParams } from 'next/navigation'
import Head from 'next/head'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StarIcon, PhoneCallIcon } from 'lucide-react'

const mockMaster = {
  name: 'Алишер Ахмедов',
  category: 'Электрик',
  rating: 4.9,
  reviews: 127,
  phone: '+998 90 123 45 67',
  verified: true,
  gallery: [
    '/images/work1.jpg',
    '/images/work2.jpg',
    '/images/work3.jpg',
  ],
  description: 'Профессиональный электрик с 12-летним стажем. Работаю быстро и аккуратно, гарантия качества.',
}

export default function MasterProfilePage() {
  const { id } = useParams()

  return (
    <>
      <Head>
        <title>{mockMaster.name} - Профиль мастера | USTA</title>
      </Head>
      <main className="min-h-screen bg-white p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="shadow-lg">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{mockMaster.name}</h1>
                {mockMaster.verified && <Badge>✅ Верифицирован</Badge>}
              </div>
              <div className="flex items-center space-x-3 text-yellow-500">
                <StarIcon className="w-5 h-5" />
                <span className="font-medium">{mockMaster.rating} ({mockMaster.reviews} отзывов)</span>
              </div>
              <p className="text-gray-700">{mockMaster.description}</p>
              <Button className="w-full" variant="outline">
                <PhoneCallIcon className="w-4 h-4 mr-2" /> Позвонить мастеру
              </Button>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-xl font-semibold mb-4">Галерея работ</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {mockMaster.gallery.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt="Работа мастера"
                  className="rounded-lg object-cover shadow-sm hover:scale-105 transition-transform duration-300"
                />
              ))}
            </div>
          </div>
        </div>
     import ReviewsSection from '@/components/master/ReviewsSection'
...
<ReviewsSection />
      </main>
    </>
  )
}
