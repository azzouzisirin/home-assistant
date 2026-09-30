import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  }
})

export async function sendMail({ to, subject, text }) {
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    text
  })
}