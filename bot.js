const { Telegraf } = require("telegraf");

const bot = new Telegraf("ВСТАВЬ_СЮДА_СВОЙ_ТОКЕН");

bot.command("start", (ctx) => {
  ctx.reply("Привет! Нажми кнопку ниже для запуска WebApp:", {
    reply_markup: {
      keyboard: [
        [
          {
            text: "🚀 Открыть USTA WebApp",
            web_app: {
              url: "https://usta-webapp.vercel.app"
            }
          }
        ]
      ],
      resize_keyboard: true
    }
  });
});

bot.launch();
console.log("✅ Бот запущен");
