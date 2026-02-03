import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: number
  phone: string
  nickname: string
  avatar: string
  gender: string
  coins: number
  vipLevel: number
}

interface AuthState {
  token: string | null
  user: User | null
  isLoggedIn: boolean
  setAuth: (token: string, user: User) => void
  updateUser: (user: Partial<User>) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoggedIn: false,

      setAuth: (token, user) => set({
        token,
        user,
        isLoggedIn: true
      }),

      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),

      logout: () => set({
        token: null,
        user: null,
        isLoggedIn: false
      })
    }),
    {
      name: 'welove-auth'
    }
  )
)
