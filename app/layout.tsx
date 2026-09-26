import type { Metadata } from 'next'
import Script from 'next/script'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'USTA — от проблемы до результата',
  description: 'Платформа локальных и профессиональных услуг',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="bg-amber-50 p-3 text-center text-sm" role="status">
            Прототип USTA. Заказы, регистрация и оплата пока не подключены.
          </div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

