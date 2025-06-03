export async function POST(req) {
  const { prompt } = await req.json();

  const reply = `📌 Демонстрация: вы спросили — "${prompt}".\n\nОтвет от GPT подключим после ввода ключа.`;

  // Для боевого режима подключаем:
  // const apiKey = process.env.OPENAI_API_KEY;
  // const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", { ... });

  return Response.json({ reply });
}
