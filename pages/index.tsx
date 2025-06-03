import Head from 'next/head'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { MapPin, Search, Star } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <>
      <Head>
        <title>USTA SuperApp — Услуги рядом</title>
      </Head>
      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl font-bold text-center text-black mb-6"
        >
          Добро пожаловать в USTA SuperApp
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col items-center gap-4 mb-10"
        >
          <Link href="/masters">
            <Button className="text-lg px-8 py-4 flex items-center gap-2 shadow-xl">
              <Search size={20} /> Найти мастера
            </Button>
          </Link>
          <Link href="/map">
            <Button variant="outline" className="text-lg px-8 py-4 flex items-center gap-2">
              <MapPin size={20} /> Смотреть по карте
            </Button>
          </Link>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          <h2 className="text-2xl font-semibold text-center mb-6">🔥 Популярные категории</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {['Электрик', 'Сантехник', 'Клининг', 'Автомеханик', 'Кондиционерщик', 'Мебельщик'].map(
              (category, index) => (
                <Card key={index} className="hover:shadow-md transition-all">
                  <CardContent className="p-4">
                    <div className="text-lg font-medium flex items-center gap-2">
                      <Star size={16} className="text-yellow-500" />
                      {category}
                    </div>
                    <Button variant="ghost" className="mt-2 w-full">
                      Открыть
                    </Button>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        </motion.section>
      </main>
    </>
  )
}
