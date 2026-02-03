import axios from 'axios'
import { Toast } from 'antd-mobile'
import { useAuthStore } from '@/stores/auth'

const api = axios.create({
  baseURL: '/api/trpc',
  timeout: 30000,
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    const data = response.data?.result?.data ?? response.data
    return data
  },
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    const msg = error.response?.data?.error?.message || error.response?.data?.message || '请求失败'
    Toast.show({ icon: 'fail', content: msg })
    return Promise.reject(error)
  }
)

// tRPC helpers
const trpcQuery = <T>(procedure: string, input?: Record<string, unknown>): Promise<T> => {
  const params = input ? { input: JSON.stringify(input) } : {}
  return api.get(`/${procedure}`, { params }) as Promise<T>
}

const trpcMutation = <T>(procedure: string, input?: Record<string, unknown>): Promise<T> => {
  return api.post(`/${procedure}`, input) as Promise<T>
}

// Auth API
export const authApi = {
  login: (phone: string, code?: string) =>
    trpcMutation<{ token: string; user: any }>('auth.login', { phone, code }),

  getProfile: () => trpcQuery<any>('auth.profile'),

  updateProfile: (data: any) => trpcMutation<any>('auth.updateProfile', data),
}

// Character API
export const characterApi = {
  list: (params: { page?: number; pageSize?: number; category?: string; search?: string }) =>
    trpcQuery<any>('character.list', params),

  detail: (id: number) => trpcQuery<any>('character.detail', { id }),

  categories: () => trpcQuery<any>('character.categories'),

  checkUnlock: (characterId: number) => trpcQuery<any>('character.checkUnlock', { characterId }),

  unlock: (characterId: number) => trpcMutation<any>('character.unlock', { characterId }),
}

// Chat API
export const chatApi = {
  sessions: (params?: { page?: number; pageSize?: number }) =>
    trpcQuery<any>('chat.sessions', params || {}),

  getSession: (characterId: number) =>
    trpcMutation<{ sessionId: number }>('chat.getSession', { characterId }),

  messages: (sessionId: number, params?: { page?: number; pageSize?: number }) =>
    trpcQuery<any>('chat.messages', { sessionId, ...params }),

  send: (sessionId: number, content: string) =>
    trpcMutation<any>('chat.send', { sessionId, content }),

  togglePin: (sessionId: number) =>
    trpcMutation<any>('chat.togglePin', { sessionId }),

  deleteSession: (sessionId: number) =>
    trpcMutation<any>('chat.deleteSession', { sessionId }),
}

// Moment API
export const momentApi = {
  list: (params?: { page?: number; pageSize?: number; characterId?: number }) =>
    trpcQuery<any>('moment.list', params || {}),

  detail: (id: number) => trpcQuery<any>('moment.detail', { id }),

  toggleLike: (momentId: number) =>
    trpcMutation<{ liked: boolean }>('moment.toggleLike', { momentId }),

  comment: (momentId: number, content: string) =>
    trpcMutation<any>('moment.comment', { momentId, content }),
}

// Wallet API
export const walletApi = {
  balance: () => trpcQuery<any>('wallet.balance'),

  transactions: (params?: { page?: number; pageSize?: number; type?: string }) =>
    trpcQuery<any>('wallet.transactions', params || {}),

  rechargeOptions: () => trpcQuery<any>('wallet.rechargeOptions'),

  recharge: (amount: number, paymentMethod: string) =>
    trpcMutation<any>('wallet.recharge', { amount, paymentMethod }),
}

// Gift API
export const giftApi = {
  list: () => trpcQuery<any>('gift.list'),

  send: (characterId: number, giftId: number, quantity?: number) =>
    trpcMutation<any>('gift.send', { characterId, giftId, quantity: quantity || 1 }),

  ranking: (characterId: number) =>
    trpcQuery<any>('gift.ranking', { characterId }),
}

export default api
