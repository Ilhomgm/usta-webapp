import test from 'node:test'
import assert from 'node:assert/strict'
import { configured, passwordMatches, createSession, verifySession, SESSION_TTL } from '../lib/admin-session.mjs'

test('admin sessions fail closed, reject tampering, expire and rotate', () => {
  delete process.env.ADMIN_PASSWORD
  delete process.env.SESSION_SECRET
  assert.equal(configured(), false)
  assert.equal(verifySession('true'), false)
  assert.equal(passwordMatches('usta123'), false)
  process.env.ADMIN_PASSWORD = 'test-only-strong-password'
  process.env.SESSION_SECRET = 'test-only-session-secret-at-least-32-characters'
  assert.equal(passwordMatches('wrong'), false)
  assert.equal(passwordMatches(null), false)
  assert.equal(passwordMatches(process.env.ADMIN_PASSWORD), true)
  const now = 1700000000000
  const token = createSession(now)
  assert.equal(verifySession(token, now), true)
  assert.equal(verifySession(token + 'x', now), false)
  assert.equal(verifySession(token.split('.')[0] + '.' + 'я'.repeat(43), now), false)
  assert.equal(verifySession('true', now), false)
  assert.equal(verifySession(token, now + SESSION_TTL * 1000), false)
  process.env.SESSION_SECRET = 'rotated-session-secret-at-least-32-characters'
  assert.equal(verifySession(token, now), false)
  delete process.env.ADMIN_PASSWORD
  delete process.env.SESSION_SECRET
})
