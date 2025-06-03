import fs from 'fs'
import path from 'path'
import { Card, CardContent } from '@/components/ui/card'

type Master = {
  id: number
  name: string
  category: string
  phone: string
}

export default function MastersListPage() {
  const mastersFile = path.join(process.cwd(), 'data', 'masters.json')
  let masters: Master[] = []

  if (fs.existsSync(mastersFile)) {
    const fileContent = fs.readFileSync(mastersFile, 'utf-8')
    masters = JSON.parse(fileContent)
  }

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-6">Список всех мастеров</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {masters.map((master) => (
          <Card key={master.id}>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-2">{master.name}</h2>
              <p>Категория: {master.category}</p>
              <p>Телефон: {master.phone}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}
