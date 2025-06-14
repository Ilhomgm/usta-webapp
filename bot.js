const { Telegraf } = require("telegraf");
// Заменить на твой токен от BotFather
const bot = new Telegraf("ВАШ_БОТ_ТОКЕН");

bot.command("start", (ctx) => {
  ctx.reply("Добро пожаловать в USTA!", {
    reply_markup: {
      keyboard: [
        [
          {
            text: "🚀 Открыть USTA WebApp",
            web_app: { url: "https://usta-webapp.vercel.app" }
          }
        ]
      ],
      resize_keyboard: true
    }
  });
});

bot.launch();
console.log("✅ Бот запущен");
