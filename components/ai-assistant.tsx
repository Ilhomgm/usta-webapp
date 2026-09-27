'use client'
import {useEffect,useRef,useState} from 'react'
import {Mic,Square,Sparkles,Send} from 'lucide-react'
import PriceInsight from './price-insight'
export type AIDraft={title:string;description:string;category:string;serviceCode:string;city:string}
type Message={role:'user'|'assistant';content:string}
type Result=AIDraft&{reply:string;language:string;questions:string[];checklist:string[];urgent:boolean;ready:boolean}
type Match={id:string;name:string;city:string;category:string;rating:number|null;distanceKm:number|null}
export default function AIAssistant({user,onDraft}:{user:{role:string;city:string};onDraft:(draft:AIDraft,master?:Match)=>void}){
 const [configured,setConfigured]=useState<boolean|null>(null),[error,setError]=useState(''),[busy,setBusy]=useState(false)
 const [input,setInput]=useState(''),[messages,setMessages]=useState<Message[]>([]),[result,setResult]=useState<Result|null>(null),[matches,setMatches]=useState<Match[]>([])
 const [recording,setRecording]=useState(false),[seconds,setSeconds]=useState(0),[permissionPending,setPermissionPending]=useState(false)
 const [audio,setAudio]=useState<File|null>(null),[audioUrl,setAudioUrl]=useState('')
 const recorder=useRef<MediaRecorder|null>(null),stream=useRef<MediaStream|null>(null),timer=useRef<ReturnType<typeof setInterval>|null>(null),mounted=useRef(true)
 useEffect(()=>{mounted.current=true;fetch('/api/assistant').then(async r=>{const d=await r.json();if(!r.ok)throw Error(d.error);setConfigured(d.configured)}).catch(e=>setError(e.message));return()=>{mounted.current=false;if(timer.current)clearInterval(timer.current);if(recorder.current?.state==='recording')recorder.current.stop();stream.current?.getTracks().forEach(t=>t.stop())}},[])
 useEffect(()=>{if(!audio){setAudioUrl('');return}const url=URL.createObjectURL(audio);setAudioUrl(url);return()=>URL.revokeObjectURL(url)},[audio])
 async function startRecording(){
  setError('');setPermissionPending(true)
  try{
   if(!navigator.mediaDevices?.getUserMedia||typeof MediaRecorder==='undefined')throw Error('Запись недоступна в этом браузере. Прикрепите аудиофайл или напишите текст.')
   const media=await navigator.mediaDevices.getUserMedia({audio:true})
   if(!mounted.current){media.getTracks().forEach(t=>t.stop());return}
   stream.current=media
   const mime=['audio/webm;codecs=opus','audio/mp4','audio/webm'].find(t=>MediaRecorder.isTypeSupported(t))
   const instance=new MediaRecorder(media,mime?{mimeType:mime}:undefined);recorder.current=instance
   const chunks:BlobPart[]=[];let size=0;let elapsed=0
   instance.ondataavailable=e=>{if(e.data.size){size+=e.data.size;chunks.push(e.data);if(size>10*1024*1024&&instance.state==='recording')instance.stop()}}
   instance.onstop=()=>{media.getTracks().forEach(t=>t.stop());if(timer.current)clearInterval(timer.current);if(!mounted.current)return;setRecording(false);if(size>10*1024*1024){setError('Запись слишком большая. Максимум 10 МБ.');return}const type=instance.mimeType;setAudio(new File(chunks,type.includes('mp4')?'voice.m4a':'voice.webm',{type}))}
   instance.onerror=()=>{media.getTracks().forEach(t=>t.stop());if(timer.current)clearInterval(timer.current);if(mounted.current){setRecording(false);setError('Не удалось записать звук. Прикрепите файл.')}}
   instance.start(1000);setRecording(true);setSeconds(0);setAudio(null)
   timer.current=setInterval(()=>{elapsed++;setSeconds(elapsed);if(elapsed>=90&&instance.state==='recording')instance.stop()},1000)
  }catch(e){stream.current?.getTracks().forEach(t=>t.stop());if(mounted.current)setError(e instanceof Error&&e.name==='NotAllowedError'?'Доступ к микрофону не разрешён. Можно написать текст.':e instanceof Error?e.message:'Не удалось включить микрофон')}
  finally{if(mounted.current)setPermissionPending(false)}
 }
 async function recognize(){
  if(!audio)return;setBusy(true);setError('')
  try{const form=new FormData();form.set('audio',audio);const res=await fetch('/api/assistant',{method:'POST',body:form});const data=await res.json();if(!res.ok)throw Error(data.error);setInput(data.text);setAudio(null)}catch(e){setError(e instanceof Error?e.message:'Ошибка распознавания')}finally{setBusy(false)}
 }
 async function send(){
  const next:Message[]=[...messages,{role:'user',content:input.trim()}];if(!input.trim())return
  setBusy(true);setError('')
  try{const res=await fetch('/api/assistant',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:next})});const data=await res.json();if(!res.ok)throw Error(data.error);setMessages([...next,{role:'assistant',content:data.result.reply}]);setResult(data.result);setMatches(data.matches||[]);setInput('')}
  catch(e){setError(e instanceof Error?e.message:'Нет соединения. Попробуйте ещё раз.')}finally{setBusy(false)}
 }
 return <section className="usta-ai"><div className="usta-ai-intro"><div className="usta-eyebrow"><Sparkles size={18}/> USTA ПОМОЩНИК</div><h2>{user.role==='client'?'Расскажите. Разберёмся вместе.':'Меньше переписки. Больше ясности.'}</h2><p>{user.role==='client'?'Опишите задачу своими словами — текстом или голосом. Помощник уточнит детали и подготовит заявку.':'Опишите работу и ваши условия. Помощник подготовит понятный ответ клиенту и список уточнений.'}</p><span className="usta-ai-language">O‘zbekcha · Русский · Голос и текст</span></div>
 {configured===false&&<div className="usta-ai-setup" role="status"><strong>ИИ ожидает подключения</strong><p>Администратору нужно добавить ключ OpenAI на сервер. Здесь не показываются вымышленные ответы. Карта, заявки и статистика доступны.</p></div>}
 <div className="usta-ai-grid"><div><div className="usta-ai-chat" aria-live="polite">{messages.length===0?<div className="usta-ai-examples"><p>Можно начать так:</p>{(user.role==='client'?["Oshxonadagi krandan suv oqyapti. Toshkentda santexnik kerak.",'Нужно заменить смеситель. Что уточнить у мастера?']:['Помоги составить отклик на замену смесителя. Материалы покупает клиент.','Mijozga ish narxini qanday tushuntirsam bo‘ladi?']).map(example=><button className="usta-button secondary" key={example} onClick={()=>setInput(example)}>{example}</button>)}</div>:messages.map((m,i)=><div key={i} className={`usta-ai-message ${m.role}`}><strong>{m.role==='user'?'Вы':'USTA · ИИ'}</strong><p>{m.content}</p></div>)}{busy&&<p role="status">Обрабатываем запрос…</p>}</div>
 {error&&<div role="alert" className="usta-ai-setup">{error}</div>}
 <form className="usta-form usta-ai-compose" onSubmit={e=>{e.preventDefault();send()}}><label>{audio?'Можно прослушать запись ниже':'Ваша задача'}<textarea value={input} maxLength={6000} onChange={e=>setInput(e.target.value)} placeholder="Напишите на удобном языке… / Savolingizni yozing…" required disabled={busy}/></label>
 <div className="usta-ai-actions"><button type="button" className="usta-button secondary small" disabled={busy||permissionPending||configured!==true} onClick={()=>recording?recorder.current?.stop():startRecording()}>{recording?<><Square size={16}/> Остановить · {seconds} с</>:<><Mic size={16}/> {permissionPending?'Разрешите микрофон…':'Записать голос'}</>}</button><label className="usta-audio-upload">Прикрепить аудио<input type="file" accept=".webm,.mp3,.mp4,.m4a,.wav,.ogg" disabled={busy||recording||configured!==true} onChange={e=>{const file=e.target.files?.[0];if(file){if(file.size>10*1024*1024)setError('Максимум 10 МБ');else{setAudio(file);setError('')}}e.target.value=''}}/></label><button className="usta-button small" disabled={busy||recording||permissionPending||configured!==true||!input.trim()||messages.length>=16}><Send size={16}/> Отправить</button></div>
 <small>Текст и выбранное аудио отправляются в OpenAI для обработки. Запись — до 90 секунд, файл — до 10 МБ. Распознанный текст можно исправить перед отправкой. Качество узбекской речи ещё требует проверки на реальных записях.</small></form>
 {audio&&<div className="usta-ai-audio"><audio controls src={audioUrl}/><button disabled={busy} className="usta-button small" onClick={recognize}>Распознать речь</button><button disabled={busy} className="usta-text-button" onClick={()=>setAudio(null)}>Удалить запись</button></div>}
 {!!messages.length&&<button disabled={busy||recording} className="usta-text-button" onClick={()=>{setMessages([]);setResult(null);setMatches([]);setInput('');setError('');setAudio(null)}}>Новый диалог</button>}
 </div><aside className="usta-ai-side">{result?<><div className="usta-panel"><strong>{result.urgent?'Сначала безопасность':'План действий'}</strong>{result.questions.length>0&&<><h3>Нужно уточнить</h3><ul>{result.questions.map((q,i)=><li key={i}>{q}</li>)}</ul></>}{result.checklist.length>0&&<ul>{result.checklist.map((q,i)=><li key={i}>{q}</li>)}</ul>}{result.ready&&user.role==='client'&&<><h3>{result.title}</h3><p>{result.description}</p><button className="usta-button" onClick={()=>onDraft(result)}>Проверить и оформить заявку</button></>}<small>Помощник не отправляет предложения и не согласует обязательства от вашего имени.</small></div>
 {matches.length>0&&<div className="usta-panel"><h3>Подходящие мастера</h3><p>По категории и городу; расстояние — от вашей сохранённой точки. Время и цену нужно уточнить.</p>{matches.map(m=><div className="usta-ai-match" key={m.id}><strong>{m.name}</strong><span>{m.rating?`★ ${m.rating}`:'Пока без отзывов'}{m.distanceKm!==null?` · ≈ ${m.distanceKm} км`:''}</span><button className="usta-text-button" onClick={()=>onDraft(result,m)}>Подготовить личную заявку</button></div>)}</div>}</>:<div className="usta-panel"><h3>От разговора к делу</h3><ol><li>Объясните задачу.</li><li>Ответьте на уточнения.</li><li>Проверьте черновик.</li><li>Выберите мастера и согласуйте условия.</li></ol><p>ИИ помогает с формулировками. Реальные мастера и цены берутся из USTA.</p></div>}
 <PriceInsight key={result?.serviceCode||'initial'} city={result?.city||user.city} initialService={result?.serviceCode||'tap_replace'}/></aside></div></section>
}
