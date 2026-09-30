import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../config/db.js'
import { sendMail } from '../services/mail.service.js'
import { createCode, checkCode } from '../services/code.service.js'

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

async function sendVerificationCode(email) {
  const code = createCode(email, 'verify')
  await sendMail({
    to: email,
    subject: 'Verify your email',
    text: `Your verification code is ${code}. It expires in 10 minutes.`
  })
}

export async function register(req, res) {
  const { email, password } = req.body || {}

  if (!email || !email.includes('@') || !password || password.length < 8) {
    return res.status(400).json({ error: 'Invalid email or password shorter than 8 characters' })
  }

  const existing = db.prepare('SELECT id, email_verified FROM users WHERE email = ?').get(email)
  if (existing && existing.email_verified) {
    return res.status(409).json({ error: 'Email already registered' })
  }

  const hash = bcrypt.hashSync(password, 10)
  if (existing) {
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hash, existing.id)
  } else {
    db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)').run(email, hash)
  }

  try {
    await sendVerificationCode(email)
  } catch (err) {
    console.error('Mail error:', err.message)
    return res.status(502).json({ error: 'Could not send the verification email' })
  }

  res.status(201).json({ ok: true })
}

export async function login(req, res) {
  const { email, password } = req.body || {}

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  const user = db
    .prepare('SELECT id, password_hash, email_verified FROM users WHERE email = ?')
    .get(email)

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  if (!user.email_verified) {
    try {
      await sendVerificationCode(email)
    } catch (err) {
      console.error('Mail error:', err.message)
    }
    return res.status(403).json({ error: 'Email not verified', code: 'EMAIL_NOT_VERIFIED' })
  }

  res.json({ token: signToken(user.id) })
}

export function verifyEmail(req, res) {
  const { email, code } = req.body || {}

  if (!email || !code) {
    return res.status(400).json({ error: 'Email and code are required' })
  }

  const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email)

  if (!user || !checkCode(email, 'verify', code)) {
    return res.status(400).json({ error: 'Invalid or expired code' })
  }

  db.prepare('UPDATE users SET email_verified = 1 WHERE id = ?').run(user.id)
  res.json({ token: signToken(user.id) })
}

export async function resendVerification(req, res) {
  const { email } = req.body || {}

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required' })
  }

  const user = db.prepare('SELECT id, email_verified FROM users WHERE email = ?').get(email)

  if (user && !user.email_verified) {
    try {
      await sendVerificationCode(email)
    } catch (err) {
      console.error('Mail error:', err.message)
    }
  }

  res.json({ ok: true })
}

export function me(req, res) {
  const user = db
    .prepare('SELECT id, email, language, is_guest, created_at FROM users WHERE id = ?')
    .get(req.userId)

  if (!user) return res.status(404).json({ error: 'User not found' })

  res.json({ user })
}

export function deleteAccount(req, res) {
  db.prepare('DELETE FROM users WHERE id = ?').run(req.userId)
  res.json({ ok: true })
}

export async function forgotPassword(req, res) {
  const { email } = req.body || {}

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required' })
  }

  const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email)

  if (user) {
    const code = createCode(email, 'reset')
    try {
      await sendMail({
        to: email,
        subject: 'Your password reset code',
        text: `Your code is ${code}. It expires in 10 minutes. If you did not ask for it, ignore this email.`
      })
    } catch (err) {
      console.error('Mail error:', err.message)
    }
  }

  res.json({ ok: true })
}

export function verifyResetCode(req, res) {
  const { email, code } = req.body || {}

  if (!email || !code) {
    return res.status(400).json({ error: 'Email and code are required' })
  }

  if (!checkCode(email, 'reset', code, { consume: false })) {
    return res.status(400).json({ error: 'Invalid or expired code' })
  }

  res.json({ ok: true })
}

export function resetPassword(req, res) {
  const { email, code, password } = req.body || {}

  if (!email || !code || !password || password.length < 8) {
    return res.status(400).json({ error: 'Email, code and a password of 8+ characters are required' })
  }

  if (!checkCode(email, 'reset', code)) {
    return res.status(400).json({ error: 'Invalid or expired code' })
  }

  const hash = bcrypt.hashSync(password, 10)
  db.prepare('UPDATE users SET password_hash = ?, email_verified = 1 WHERE email = ?').run(hash, email)

  res.json({ ok: true })
}
export function guestLogin(req, res) {
  const info = db.prepare('INSERT INTO users (is_guest, email_verified) VALUES (1, 1)').run()
  res.status(201).json({ token: signToken(info.lastInsertRowid) })
}