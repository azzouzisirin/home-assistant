import 'dotenv/config'
import { sendMail } from '../services/mail.service.js'

await sendMail({
  to: process.env.MAIL_USER,
  subject: 'Test email',
  text: 'If you can read this, email sending works.'
})

console.log('Email sent')