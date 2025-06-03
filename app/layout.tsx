import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import Navbar from '@/components/navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'USTA WebApp',
  description: 'Инновационная платформа USTA – мастера, маркет, AI и всё в одном.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Navbar />
          <main className="container mx-auto p-4">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
