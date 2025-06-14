import '@/app/globals.css'

export const metadata = {
  title: 'USTA WebApp',
  description: 'Инновационная платформа USTA – мастера, маркет, AI и всё в одном.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js"></script>
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: 'Arial, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
