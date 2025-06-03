import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/navbar'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'USTA - Сервис мастеров',
  description: 'Лучший сервис по поиску мастеров в Узбекистане',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main className="pt-4">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
