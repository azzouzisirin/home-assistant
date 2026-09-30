import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import db from '../config/db.js'

const TTL_MS = 10 * 60 * 1000
const MAX_ATTEMPTS = 5

export function createCode(email, purpose) {
  const code = String(crypto.randomInt(0, 1000000)).padStart(6, '0')

  db.prepare('DELETE FROM email_codes WHERE email = ? AND purpose = ?').run(email, purpose)
  db.prepare(
    'INSERT INTO email_codes (email, purpose, code_hash, expires_at) VALUES (?, ?, ?, ?)'
  ).run(email, purpose, bcrypt.hashSync(code, 8), Date.now() + TTL_MS)

  return code
}

export function checkCode(email, purpose, code, { consume = true } = {}) {
  const row = db
    .prepare('SELECT * FROM email_codes WHERE email = ? AND purpose = ?')
    .get(email, purpose)

  if (!row) return false

  if (row.expires_at < Date.now() || row.attempts >= MAX_ATTEMPTS) {
    db.prepare('DELETE FROM email_codes WHERE id = ?').run(row.id)
    return false
  }

  if (!bcrypt.compareSync(String(code), row.code_hash)) {
    db.prepare('UPDATE email_codes SET attempts = attempts + 1 WHERE id = ?').run(row.id)
    return false
  }

  if (consume) {
    db.prepare('DELETE FROM email_codes WHERE id = ?').run(row.id)
  }
  return true
}