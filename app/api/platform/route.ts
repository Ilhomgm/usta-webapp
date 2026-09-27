import { NextRequest, NextResponse } from 'next/server'
import { DomainError } from '@/lib/marketplace.mjs'
import { store } from '@/lib/store'
import { originAllowed, secureCookie } from '@/lib/request-security.mjs'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
const cookieName = 'usta_account'
const response = (value: unknown, status = 200) => NextResponse.json(value, {status,headers:{'Cache-Control':'no-store'}})
function errorResponse(error: unknown) {
  if (error instanceof DomainError) return response({error:error.message},error.status)
  console.error('USTA request failed',error)
  return response({error:'Не удалось выполнить запрос. Попробуйте снова.'},500)
}
export async function GET(req: NextRequest) {
  try {
    const user = store().authenticate(req.cookies.get(cookieName)?.value)
    return response(user ? store().state(user) : {user:null})
  } catch(error) { return errorResponse(error) }
}
export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get('origin')
    if (!originAllowed(origin,req.nextUrl.origin,process.env.USTA_PUBLIC_ORIGIN) || req.headers.get('sec-fetch-site') === 'cross-site') return response({error:'Недопустимый источник запроса'},403)
    if (!req.headers.get('content-type')?.startsWith('application/json')) return response({error:'Ожидается JSON'},415)
    const raw = await req.text()
    if (raw.length > 16000) return response({error:'Слишком большой запрос'},413)
    let payload
    try { payload=JSON.parse(raw) } catch { return response({error:'Некорректный JSON'},400) }
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return response({error:'Некорректный запрос'},400)
    const {action,...data}=payload
    if (action==='register' || action==='login') {
      store().limit('auth:global',200)
      const result=action==='register'?store().register(data):store().login(data)
      const res=response({user:result.user})
      res.cookies.set(cookieName,result.token,{httpOnly:true,sameSite:'lax',secure:secureCookie(req.nextUrl.origin),path:'/',maxAge:604800})
      return res
    }
    const token=req.cookies.get(cookieName)?.value
    if (action==='logout') {
      if (token) store().logout(token)
      const res=response({ok:true}); res.cookies.delete(cookieName); return res
    }
    const user=store().authenticate(token)
    if(action==='nearby')return response(store().nearby(user,data))
    if(action==='priceStats')return response(store().priceStats(user,data))
    if(action==='matches')return response(store().matches(user,data))
    if (user) store().limit(`write:${user.id}`,150)
    return response(store().mutate(user,action,data))
  } catch(error) { return errorResponse(error) }
}
