import { createHmac, timingSafeEqual, createHash } from 'node:crypto'

export const COOKIE_NAME = 'usta-admin'
export const SESSION_TTL = 3600

function secret() {
  const value = process.env.SESSION_SECRET
  return value && value.length >= 32 ? value : null
}

export function configured() {
  return Boolean(secret() && process.env.ADMIN_PASSWORD?.length >= 16)
}

export function passwordMatches(password) {
  if (!configured() || typeof password !== 'string' || password.length > 1024) return false
  const hash = value => createHash('sha256').update(value).digest()
  return timingSafeEqual(hash(password), hash(process.env.ADMIN_PASSWORD))
}

export function createSession(now = Date.now()) {
  if (!configured()) throw new Error('Admin access is not configured')
  const payload = Buffer.from(JSON.stringify({ role: 'admin', exp: Math.floor(now / 1000) + SESSION_TTL })).toString('base64url')
  return payload + '.' + createHmac('sha256', secret()).update(payload).digest('base64url')
}

export function verifySession(token, now = Date.now()) {
  if (!configured() || typeof token !== 'string' || token.length > 1024) return false
  const parts = token.split('.')
  if (parts.length !== 2) return false
  const [payload, signature] = parts
  const expected = createHmac('sha256', secret()).update(payload).digest('base64url')
  if (!/^[A-Za-z0-9_-]{43}$/.test(signature) ||
      !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString())
    const time = Math.floor(now / 1000)
    return data.role === 'admin' && Number.isInteger(data.exp) &&
      data.exp > time && data.exp <= time + SESSION_TTL
  } catch { return false }
}
