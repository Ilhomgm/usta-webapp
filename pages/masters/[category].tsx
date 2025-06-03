import { useRouter } from 'next/router'
import Head from 'next/head'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function CategoryPage() {
  const router = useRouter()
  const { category } = router.query

  return (
    <>
      <Head>
        <title>{category} - Мастера USTA</title>
      </Head>
      <main className="min-h-screen p-6 bg-white">
        <h1 className="text-3xl font-bold mb-6 text-center">Мастера категории: {category}</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="hover:shadow-md">
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-2">Мастер #{i}</h2>
                <p className="text-sm text-gray-600 mb-2">Описание мастера</p>
                <Button className="w-full">Связаться</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  )
}
