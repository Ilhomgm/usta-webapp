'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

export default function Navbar() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="w-full px-4 py-3 shadow-md flex justify-between items-center bg-white dark:bg-gray-900">
      <Link href="/">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">USTA</span>
      </Link>
      <nav className="flex items-center gap-4">
        <Link href="/masters" className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:underline">
          Мастера
        </Link>
        <Link href="/orders" className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:underline">
          Заказы
        </Link>
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="p-2 rounded-full border border-gray-300 dark:border-gray-600"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </nav>
    </header>
  )
}
