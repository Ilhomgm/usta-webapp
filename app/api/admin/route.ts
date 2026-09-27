import { NextRequest, NextResponse } from 'next/server'
import { COOKIE_NAME, verifySession } from '@/lib/admin-session.mjs'
import { originAllowed } from '@/lib/request-security.mjs'
import { DomainError } from '@/lib/marketplace.mjs'
import { store } from '@/lib/store'
export const runtime='nodejs'
export const dynamic='force-dynamic'
const json=(data:unknown,status=200)=>NextResponse.json(data,{status,headers:{'Cache-Control':'no-store'}})
export async function GET(request:NextRequest) {
  if(!verifySession(request.cookies.get(COOKIE_NAME)?.value))return json({error:'Войдите как администратор'},401)
  return json(store().adminState())
}
export async function POST(request:NextRequest) {
  if(!verifySession(request.cookies.get(COOKIE_NAME)?.value))return json({error:'Войдите как администратор'},401)
  if(!originAllowed(request.headers.get('origin'),request.nextUrl.origin,process.env.USTA_PUBLIC_ORIGIN)||request.headers.get('sec-fetch-site')==='cross-site')return json({error:'Недопустимый источник запроса'},403)
  try {
    const raw=await request.text()
    if(raw.length>4096)return json({error:'Слишком большой запрос'},413)
    let data
    try{data=JSON.parse(raw)}catch{return json({error:'Некорректный JSON'},400)}
    if(!data||typeof data!=='object'||Array.isArray(data))return json({error:'Некорректный запрос'},400)
    return json(store().moderate(data.action,data))
  }catch(error){
    if(error instanceof DomainError)return json({error:error.message},error.status)
    console.error('Admin request failed',error)
    return json({error:'Не удалось выполнить действие'},500)
  }
}
