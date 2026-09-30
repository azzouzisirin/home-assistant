import { request } from './client.js'

export const register = (email, password) =>
  request('/auth/register', { method: 'POST', body: { email, password } })

export const login = (email, password) =>
  request('/auth/login', { method: 'POST', body: { email, password } })

export const verifyEmail = (email, code) =>
  request('/auth/verify-email', { method: 'POST', body: { email, code } })

export const resendVerification = (email) =>
  request('/auth/resend-verification', { method: 'POST', body: { email } })

export const getMe = (token) => request('/auth/me', { token })

export const deleteMe = (token) => request('/auth/me', { method: 'DELETE', token })

export const forgotPassword = (email) =>
  request('/auth/forgot-password', { method: 'POST', body: { email } })

export const verifyResetCode = (email, code) =>
  request('/auth/verify-reset-code', { method: 'POST', body: { email, code } })

export const resetPassword = (email, code, password) =>
  request('/auth/reset-password', { method: 'POST', body: { email, code, password } })
export const guestLogin = () => request('/auth/guest', { method: 'POST' })