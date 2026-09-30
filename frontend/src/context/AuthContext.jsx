import { createContext, useContext, useEffect, useState } from 'react'
import {
  login as apiLogin,
  guestLogin as apiGuestLogin,
  register as apiRegister,
  verifyEmail as apiVerifyEmail,
  getMe,
  deleteMe
} from '../api/auth.js'

const AuthContext = createContext(null)
const TOKEN_KEY = 'token'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setLoading(false)
      return
    }
    getMe(token)
      .then((data) => setUser(data.user))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false))
  }, [])

  async function finish(token) {
    localStorage.setItem(TOKEN_KEY, token)
    const data = await getMe(token)
    setUser(data.user)
  }

  async function login(email, password) {
    const { token } = await apiLogin(email, password)
    await finish(token)
  }

  async function guestLogin() {
    const { token } = await apiGuestLogin()
    await finish(token)
  }

  function register(email, password) {
    return apiRegister(email, password)
  }

  async function verifyEmail(email, code) {
    const { token } = await apiVerifyEmail(email, code)
    await finish(token)
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }

  async function deleteAccount() {
    await deleteMe(localStorage.getItem(TOKEN_KEY))
    logout()
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, guestLogin, register, verifyEmail, logout, deleteAccount }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)