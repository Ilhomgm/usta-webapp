'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function HomePage() {
  return (
    <section className="text-center py-20">
      <h1 className="text-5xl font-bold mb-6 text-blue-600">Добро пожаловать в USTA</h1>
      <p className="text-xl mb-8 text-gray-700">Умная платформа для поиска мастеров и сервисов в вашем городе</p>
      <div className="flex justify-center gap-4">
        <Link href="/masters">
          <Button className="px-6 py-3 text-lg">Категории мастеров</Button>
        </Link>
        <Link href="/services">
          <Button variant="outline" className="px-6 py-3 text-lg">Сервисы</Button>
        </Link>
      </div>
      <div className="mt-16">
        <Image
          src="/illustration.png"
          alt="USTA иллюстрация"
          width={500}
          height={300}
        />
      </div>
    </section>
  )
}
