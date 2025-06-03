'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const links = [
  { name: '📊 Панель', href: '/admin/dashboard' },
  { name: '📈 Аналитика', href: '/admin/analytics' }
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-full md:w-64 bg-gray-100 h-full p-4 border-r">
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'block px-4 py-2 rounded hover:bg-gray-200',
              pathname === link.href && 'bg-gray-300 font-bold'
            )}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
