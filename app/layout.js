export const metadata = {
  title: "USTA WebApp",
  description: "Универсальный Super App: услуги, рынок, мастера, AI, карта, база данных, авторизация, Telegram Bot",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body style={{ margin: 0, fontFamily: "sans-serif", background: "#f5f5f5" }}>
        {children}
      </body>
    </html>
  );
}
