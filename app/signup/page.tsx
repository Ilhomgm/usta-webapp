'use client'

import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    phone: '',
    location: '',
    bio: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('📦 Отправка формы:', formData)
    alert('Регистрация прошла успешно!')
    router.push('/')
  }

  return (
    <>
      <Head>
        <title>Регистрация мастера - USTA</title>
      </Head>
      <main className="min-h-screen p-6 bg-white flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-100 p-6 rounded-xl shadow-xl w-full max-w-2xl space-y-4"
        >
          <h1 className="text-2xl font-bold mb-4 text-center">Регистрация мастера</h1>

          <div>
            <Label htmlFor="name">ФИО</Label>
            <Input name="name" id="name" required value={formData.name} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="category">Категория</Label>
            <Input name="category" id="category" required value={formData.category} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="phone">Телефон</Label>
            <Input name="phone" id="phone" required value={formData.phone} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="location">Локация</Label>
            <Input name="location" id="location" required value={formData.location} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="bio">О себе</Label>
            <Textarea name="bio" id="bio" rows={4} value={formData.bio} onChange={handleChange} />
          </div>

          <Button type="submit" className="w-full">
            Зарегистрироваться
          </Button>
        </form>
      </main>
    </>
  )
}
