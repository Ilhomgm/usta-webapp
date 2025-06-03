'use client'

import { StarIcon, UserIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const mockReviews = [
  {
    name: 'Мустафа И.',
    rating: 5,
    text: 'Очень вежливый и аккуратный мастер. Все сделал на 5+, рекомендую!',
    date: '2025-06-01',
  },
  {
    name: 'Лола М.',
    rating: 4,
    text: 'Работа выполнена хорошо, но немного задержался по времени.',
    date: '2025-05-30',
  },
  {
    name: 'Рустам К.',
    rating: 5,
    text: 'Настоящий профессионал. Помог даже с тем, что не входило в заказ.',
    date: '2025-05-25',
  },
]

export default function ReviewsSection() {
  return (
    <section className="space-y-4 mt-8">
      <h2 className="text-xl font-semibold">Отзывы клиентов</h2>
      {mockReviews.map((review, i) => (
        <Card key={i} className="shadow-sm border">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <UserIcon className="w-4 h-4 text-gray-500" />
                <span className="font-semibold">{review.name}</span>
              </div>
              <span className="text-sm text-gray-400">{review.date}</span>
            </div>
            <div className="flex items-center text-yellow-500">
              {[...Array(review.rating)].map((_, i) => (
                <StarIcon key={i} className="w-4 h-4" />
              ))}
            </div>
            <p className="text-gray-700">{review.text}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  )
}
