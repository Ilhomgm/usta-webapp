import {NextRequest,NextResponse} from 'next/server'
import {store} from '@/lib/store'
import {originAllowed} from '@/lib/request-security.mjs'
import {boundedBody} from '@/lib/request-body.mjs'
import {aiReady,assistant,transcribe,AIError,validateMessages} from '@/lib/ai.mjs'
import {DomainError} from '@/lib/marketplace.mjs'
export const runtime='nodejs'
export const dynamic='force-dynamic'
const reply=(value:unknown,status=200)=>NextResponse.json(value,{status,headers:{'Cache-Control':'no-store'}})
export async function GET(req:NextRequest){
 if(!store().authenticate(req.cookies.get('usta_account')?.value))return reply({error:'Войдите в аккаунт'},401)
 return reply({configured:aiReady(),provider:'OpenAI',voiceLimitMB:10})
}
export async function POST(req:NextRequest){
 try{
  if(!originAllowed(req.headers.get('origin'),req.nextUrl.origin,process.env.USTA_PUBLIC_ORIGIN)||req.headers.get('sec-fetch-site')==='cross-site')return reply({error:'Недопустимый источник запроса'},403)
  const user=store().authenticate(req.cookies.get('usta_account')?.value)
  if(!user)return reply({error:'Войдите в аккаунт'},401)
  if(!aiReady())throw new AIError('ИИ ещё не подключён. Администратору нужно настроить OPENAI_API_KEY. Карта и обычные заказы доступны.',503)
  const type=req.headers.get('content-type')||''
  if(type.startsWith('multipart/form-data')){
   const bytes=await boundedBody(req,11*1024*1024)
   let form:FormData
   try{form=await new Response(bytes,{headers:{'Content-Type':type}}).formData()}catch{throw new AIError('Некорректный аудиофайл')}
   const file=form.get('audio')
   if(!file||typeof file==='string')throw new AIError('Выберите аудиофайл')
   store().consumeAI(user)
   return reply(await transcribe(file))
  }
  if(!type.startsWith('application/json'))return reply({error:'Ожидается JSON или аудиофайл'},415)
  const bytes=await boundedBody(req,110000)
  let data
  try{data=JSON.parse(new TextDecoder().decode(bytes))}catch{throw new AIError('Некорректный JSON')}
  const messages=validateMessages(data?.messages)
  store().consumeAI(user)
  const result=await assistant(messages,{role:user.role,city:user.city,specialty:user.specialty})
  // Matching and statistics are computed from our database, never fabricated by the model.
  const matches=result.ready&&user.role==='client'?store().matches(user,{category:result.category,city:result.city||user.city,...(user.location||{})}):{items:[]}
  return reply({result,matches:matches.items})
 }catch(error){
  if(error instanceof AIError||error instanceof DomainError)return reply({error:error.message},error.status)
  if(error instanceof Error&&'status' in error&&error.status===413)return reply({error:error.message},413)
  return reply({error:'Не удалось выполнить запрос. Ваш текст остаётся на экране.'},500)
 }
}
