// One process per token. Never monitor groups for unsolicited advertising.
const {Telegraf}=require('telegraf')
const {randomBytes}=require('node:crypto')
async function main(){
 const {assistant,transcribe,aiReady}=await import('./lib/ai.mjs')
 const {createMarketplace}=await import('./lib/marketplace.mjs')
 const {boundedBody}=await import('./lib/request-body.mjs')
 const token=process.env.BOT_TOKEN,url=process.env.WEB_APP_URL
 if(!token||!url||new URL(url).protocol!=='https:')throw Error('Configure BOT_TOKEN and HTTPS WEB_APP_URL')
 const store=createMarketplace(),bot=new Telegraf(token),sessions=new Map(),active=new Set()
 const appUrl=new URL(url);appUrl.searchParams.set('view','assistant')
 const keyboard={inline_keyboard:[[{text:'Открыть USTA',web_app:{url:appUrl.href}}]]}
 const privateChat=ctx=>ctx.chat?.type==='private'
 function session(ctx){const s=sessions.get(ctx.from.id);if(s&&Date.now()-s.updated<3600000){s.updated=Date.now();return s}sessions.delete(ctx.from.id);return null}
 const sweep=setInterval(()=>{for(const [id,s] of sessions)if(Date.now()-s.updated>3600000)sessions.delete(id)},600000);sweep.unref()
 const intro=ctx=>ctx.reply('USTA — yordamchi / помощник. Опишите задачу текстом или голосом. Текст и аудио обрабатывает OpenAI. Выберите роль, чтобы включить ИИ для этой беседы. /new — новый диалог, /stop — выключить ИИ.',{reply_markup:{inline_keyboard:[[{text:'Я клиент / Mijoz',callback_data:'ai:client'},{text:'Я мастер / Usta',callback_data:'ai:pro'}],...keyboard.inline_keyboard]}})
 bot.start(async ctx=>{if(privateChat(ctx))await intro(ctx)})
 bot.command('usta',async ctx=>{if(privateChat(ctx))return intro(ctx);return ctx.reply('USTA: опишите задачу и найдите мастера. Vazifangizni yozing va usta toping.',{reply_markup:{inline_keyboard:[[{text:'Открыть помощника',url:`https://t.me/${bot.botInfo.username}?start=group`}]]}})})
 bot.action(/^ai:(client|pro)$/,async ctx=>{
  await ctx.answerCbQuery();if(!privateChat(ctx))return
  if(!aiReady())return ctx.reply('ИИ пока не подключён администратором.',{reply_markup:keyboard})
  if(sessions.size>=5000&&!sessions.has(ctx.from.id))return ctx.reply('Сервис занят. Откройте веб-приложение.',{reply_markup:keyboard})
  sessions.set(ctx.from.id,{role:ctx.match[1],messages:[],transcript:null,updated:Date.now()})
  await ctx.reply('Расскажите о задаче. Vazifangiz haqida yozing yoki ovozli xabar yuboring.')
 })
 bot.command('stop',async ctx=>{if(privateChat(ctx)){sessions.delete(ctx.from.id);await ctx.reply('ИИ выключен, временный диалог удалён. /start — начать снова.')}})
 bot.command('new',async ctx=>{if(privateChat(ctx)){sessions.delete(ctx.from.id);await intro(ctx)}})
 async function respond(ctx,text){
  const current=session(ctx);if(!current)return intro(ctx)
  if(active.has(ctx.from.id))return ctx.reply('Предыдущий запрос ещё обрабатывается.')
  if(current.messages.length>=16)return ctx.reply('Начните новый диалог: /new')
  active.add(ctx.from.id)
  try{
   store.consumeAI({id:`telegram:${ctx.from.id}`})
   const messages=[...current.messages,{role:'user',content:text}]
   const result=await assistant(messages,{role:current.role,city:'Уточните город'})
   if(sessions.get(ctx.from.id)!==current)return
   current.messages=[...messages,{role:'assistant',content:result.reply}];current.updated=Date.now()
   await ctx.reply(result.reply.slice(0,3900))
   if(result.ready&&current.role==='client'){
    const found=result.city.length>=2?store.matches({id:`telegram:${ctx.from.id}`},{category:result.category,city:result.city}).items:[]
    const summary=`Черновик / Qoralama\n${result.title}\n${result.description}\n\n${found.length?'Мастера по категории и городу: '+found.map(p=>p.name).join(', ')+'. Доступность и цену нужно подтвердить.':'Уточните город или откройте карту для поиска мастера.'}\n\nСкопируйте описание в заявку в приложении. Заказ пока не отправлен.`
    await ctx.reply(summary.slice(0,3900),{reply_markup:keyboard})
   }
  }catch(error){await ctx.reply(error.status?error.message:'Не удалось обработать запрос. Попробуйте ещё раз.')}
  finally{active.delete(ctx.from.id)}
 }
 bot.on('text',async ctx=>{if(privateChat(ctx)&&!ctx.message.text.startsWith('/')){const current=session(ctx);if(current)current.transcript=null;await respond(ctx,ctx.message.text)}})
 bot.on('voice',async ctx=>{
  if(!privateChat(ctx))return
  const current=session(ctx);if(!current)return intro(ctx)
  if(active.has(ctx.from.id))return ctx.reply('Предыдущий запрос ещё обрабатывается.')
  const voice=ctx.message.voice
  if(voice.duration>90||voice.file_size>10*1024*1024)return ctx.reply('Отправьте запись до 90 секунд и 10 МБ.')
  active.add(ctx.from.id)
  try{
   store.consumeAI({id:`telegram:${ctx.from.id}`})
   const link=await ctx.telegram.getFileLink(voice.file_id)
   const downloaded=await fetch(link,{signal:AbortSignal.timeout(20000)})
   if(!downloaded.ok)throw Error('Audio download failed')
   const bytes=await boundedBody(downloaded,10*1024*1024)
   const result=await transcribe(new File([bytes],'voice.ogg',{type:'audio/ogg'}))
   if(sessions.get(ctx.from.id)!==current)return
   const transcriptId=randomBytes(8).toString('hex');current.transcript={text:result.text,id:transcriptId};current.updated=Date.now()
   await ctx.reply(('Распознано / Matn:\n'+result.text+'\n\nПроверьте текст. Если есть ошибка, отправьте исправленный текст сообщением.').slice(0,3900),{reply_markup:{inline_keyboard:[[{text:'Верно, обработать / Davom etish',callback_data:`transcript:${transcriptId}`}]]}})
  }catch(error){await ctx.reply(error.status?error.message:'Не удалось распознать запись. Напишите текст или попробуйте ещё раз.')}
  finally{active.delete(ctx.from.id)}
 })
 bot.action(/^transcript:([a-f0-9]{16})$/,async ctx=>{await ctx.answerCbQuery();if(!privateChat(ctx))return;const current=session(ctx);if(!current?.transcript||current.transcript.id!==ctx.match[1])return ctx.reply('Запись устарела. Отправьте новое сообщение.');const text=current.transcript.text;current.transcript=null;await respond(ctx,text)})
 bot.catch(()=>console.error('Telegram update failed; private content omitted'))
 process.once('SIGINT',()=>bot.stop('SIGINT'));process.once('SIGTERM',()=>bot.stop('SIGTERM'))
 await bot.launch()
}
main().catch(()=>{console.error('Bot startup failed. Check server-only BOT_TOKEN, WEB_APP_URL and database access.');process.exitCode=1})
