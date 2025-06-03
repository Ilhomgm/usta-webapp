"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/theme/mode-toggle"

const navItems = [
  { href: "/", label: "🏠 Главная" },
  { href: "/masters", label: "👷‍♂️ Мастера" },
  { href: "/services", label: "🛠 Услуги" },
  { href: "/market", label: "🛒 Купля-продажа" },
  { href: "/ai", label: "🤖 AI-помощник" },
  { href: "/admin", label: "🛡️ Админ" }
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="w-full flex justify-between items-center p-4 bg-white dark:bg-black shadow-md sticky top-0 z-50">
      <div className="flex space-x-4">
        {navItems.map(({ href, label }) => (
          <Link key={href} href={href}>
            <Button
              variant={pathname === href ? "default" : "ghost"}
              className={cn("text-sm")}
            >
              {label}
            </Button>
          </Link>
        ))}
      </div>
      <ModeToggle />
    </nav>
  )
}
