# USTA WebApp

USTA — от проблемы до результата. Этот репозиторий содержит **прототип** web/Mini App.
Страницы каталога, чата, регистрации и админки пока используют локальные/демонстрационные
данные. Реальные заказы, база, платежи и AI ещё не подключены.

## Запуск

Node.js 24 и pnpm 11.25.0:
```sh
corepack enable
corepack prepare pnpm@11.25.0 --activate
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```
Windows: вместо cp можно использовать Copy-Item.
Для админки задайте ADMIN_PASSWORD (от 16 символов) и SESSION_SECRET
(случайное значение от 32 символов). Без них вход закрыт.
Вход: /login, админка: /admin/dashboard, выход: /logout.
Пароль по умолчанию отсутствует. Сессия подписана и действует час.
Смена SESSION_SECRET отзывает все сессии.

## Проверки

```sh
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm start
```

Используется pnpm-lock.yaml; повреждённый package-lock.json заменён.
Next.js обновлён с 13.4.19 до 15.5.26:
[официальные обновления](https://nextjs.org/blog).

## Ограничения запуска

Проверка админки выполняется серверным layout. Каждый будущий API/Server Action
обязан отдельно проверять сессию и разрешение на операцию. Ограничитель входа
работает в памяти одного процесса; для production нужен общий лимитер/WAF.
Авторизация клиентов и проверка Telegram initData ещё не реализованы.

Для deployment задайте Node 24 и секреты в окружении хостинга, затем проверьте
preview. Наличие vercel.json само по себе не создаёт deployment.
Один Telegram-токен обслуживает один polling-процесс: Python-бот либо
необязательный launcher bot.js, но не оба одновременно.

[Дорожная карта](docs/ROADMAP.md) · [Архитектура](docs/ARCHITECTURE.md) ·
[Разработка](CONTRIBUTING.md) · [Безопасность](SECURITY.md)
