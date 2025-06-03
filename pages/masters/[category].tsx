import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

const categories = [
  'Электрик',
  'Сантехник',
  'Автомеханик',
  'Клининг',
  'Сварщик',
  'Мебельщик',
  'Маляр',
  'Кондиционерщик',
  'Строитель',
]

export default function HomePage() {
  return (
    <>
      <Head>
        <title>USTA Super App</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 p-6">
        <motion.h1
          className="text-4xl font-bold text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Добро пожаловать в USTA — Сервис мастеров
        </motion.h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {categories.map((category, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link href={`/masters/${category}`}>
                <Button className="w-full py-6 text-lg font-medium shadow hover:scale-105 transition-all">
                  {category}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </>
  )
}
