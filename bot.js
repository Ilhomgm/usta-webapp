const { Telegraf } = require('telegraf')
const token = process.env.BOT_TOKEN
const url = process.env.WEB_APP_URL
if (!token || !url || new URL(url).protocol !== 'https:') {
  throw new Error('Set BOT_TOKEN and an HTTPS WEB_APP_URL before starting the bot')
}
const bot = new Telegraf(token)
bot.start(ctx => ctx.reply('Открыть USTA:', {
  reply_markup: { inline_keyboard: [[{ text: 'Открыть USTA', web_app: { url } }]] }
}))
bot.launch().catch(() => { console.error('Bot startup failed'); process.exitCode = 1 })
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

