'use client'

import { useParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { SendHorizonalIcon, UserIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

type Message = {
  id: number
  sender: 'client' | 'master'
  text: string
  time: string
}

export default function ChatPage() {
  const { chatId } = useParams()
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'master', text: 'Здравствуйте! Чем могу помочь?', time: '10:00' },
    { id: 2, sender: 'client', text: 'Мне нужен электрик на завтра', time: '10:01' },
  ])
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = () => {
    if (newMessage.trim() === '') return
    const now = new Date()
    const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`
    const message: Message = {
      id: Date.now(),
      sender: 'client',
      text: newMessage,
      time,
    }
    setMessages([...messages, message])
    setNewMessage('')
  }

  return (
    <main className="min-h-screen p-4 bg-white">
      <h1 className="text-xl font-bold mb-4">Чат с мастером #{chatId}</h1>
      <Card className="max-w-2xl mx-auto shadow-md">
        <CardContent className="h-[60vh] overflow-y-auto space-y-2 p-4 bg-gray-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="max-w-xs bg-white p-2 rounded-lg shadow text-sm">
                <p className="mb-1">{msg.text}</p>
                <span className="text-xs text-gray-400">{msg.time}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </CardContent>
        <div className="p-4 border-t flex space-x-2">
          <Input
            placeholder="Напишите сообщение..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <Button onClick={sendMessage}>
            <SendHorizonalIcon className="w-4 h-4 mr-1" />
            Отправить
          </Button>
        </div>
      </Card>
    </main>
  )
}
