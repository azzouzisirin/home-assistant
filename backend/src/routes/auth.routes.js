import { Router } from 'express'
import {
  register,
  verifyEmail,
  resendVerification,
  login,
  guestLogin,
  me,
  deleteAccount,
  forgotPassword,
  verifyResetCode,
  resetPassword
} from '../controllers/auth.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'

const router = Router()
router.post('/register', register)
router.post('/verify-email', verifyEmail)
router.post('/resend-verification', resendVerification)
router.post('/login', login)
router.post('/guest', guestLogin)
router.get('/me', requireAuth, me)
router.delete('/me', requireAuth, deleteAccount)
router.post('/forgot-password', forgotPassword)
router.post('/verify-reset-code', verifyResetCode)
router.post('/reset-password', resetPassword)

export default router