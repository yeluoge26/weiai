import axios from 'axios'
import { message } from 'antd'
import { useAuthStore } from '@/stores/auth'
import type { ApiResponse, PaginatedResponse, User, Character, Gift, Script, Moment, DashboardStats } from '@/types'

const api = axios.create({
  baseURL: '/api/trpc',
  timeout: 10000,
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
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle tRPC response format
api.interceptors.response.use(
  (response) => {
    // tRPC returns { result: { data: ... } }
    const data = response.data?.result?.data ?? response.data
    return data
  },
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    const errorMessage = error.response?.data?.error?.message ||
                         error.response?.data?.message ||
                         '请求失败'
    message.error(errorMessage)
    return Promise.reject(error)
  }
)

// tRPC query helper (GET requests)
const trpcQuery = <T>(procedure: string, input?: Record<string, unknown>): Promise<T> => {
  const params = input ? { input: JSON.stringify(input) } : {}
  return api.get(`/${procedure}`, { params }) as Promise<T>
}

// tRPC mutation helper (POST requests)
const trpcMutation = <T>(procedure: string, input?: Record<string, unknown>): Promise<T> => {
  return api.post(`/${procedure}`, input) as Promise<T>
}

// Auth APIs
export const authApi = {
  login: (username: string, password: string) =>
    trpcMutation<ApiResponse<{ token: string; user: User }>>('admin.login', { username, password }),

  logout: () => trpcMutation<void>('admin.logout'),

  getProfile: () => trpcQuery<ApiResponse<User>>('admin.profile'),
}

// User APIs
export const userApi = {
  getList: (params: { page: number; pageSize: number; search?: string }) =>
    trpcQuery<ApiResponse<PaginatedResponse<User>>>('admin.user.list', params),

  getById: (id: number) =>
    trpcQuery<ApiResponse<User>>('admin.user.detail', { id }),

  update: (id: number, data: Partial<User>) =>
    trpcMutation<ApiResponse<User>>('admin.user.update', { id, ...data }),

  ban: (id: number) =>
    trpcMutation<ApiResponse<void>>('admin.user.ban', { id }),

  unban: (id: number) =>
    trpcMutation<ApiResponse<void>>('admin.user.unban', { id }),
}

// Character APIs
export const characterApi = {
  getList: (params: { page: number; pageSize: number; category?: string; search?: string }) =>
    trpcQuery<ApiResponse<PaginatedResponse<Character>>>('admin.character.list', params),

  getById: (id: number) =>
    trpcQuery<ApiResponse<Character>>('admin.character.detail', { id }),

  create: (data: Partial<Character>) =>
    trpcMutation<ApiResponse<Character>>('admin.character.create', data),

  update: (id: number, data: Partial<Character>) =>
    trpcMutation<ApiResponse<Character>>('admin.character.update', { id, ...data }),

  delete: (id: number) =>
    trpcMutation<ApiResponse<void>>('admin.character.delete', { id }),
}

// Gift APIs
export const giftApi = {
  getList: () =>
    trpcQuery<ApiResponse<Gift[]>>('admin.gift.list'),

  create: (data: Partial<Gift>) =>
    trpcMutation<ApiResponse<Gift>>('admin.gift.create', data),

  update: (id: number, data: Partial<Gift>) =>
    trpcMutation<ApiResponse<Gift>>('admin.gift.update', { id, ...data }),

  delete: (id: number) =>
    trpcMutation<ApiResponse<void>>('admin.gift.delete', { id }),
}

// Script APIs
export const scriptApi = {
  getList: (params: { page: number; pageSize: number }) =>
    trpcQuery<ApiResponse<PaginatedResponse<Script>>>('admin.script.list', params),

  getById: (id: number) =>
    trpcQuery<ApiResponse<Script>>('admin.script.detail', { id }),

  create: (data: Partial<Script>) =>
    trpcMutation<ApiResponse<Script>>('admin.script.create', data),

  update: (id: number, data: Partial<Script>) =>
    trpcMutation<ApiResponse<Script>>('admin.script.update', { id, ...data }),

  delete: (id: number) =>
    trpcMutation<ApiResponse<void>>('admin.script.delete', { id }),

  getNodes: (scriptId: number) =>
    trpcQuery<ApiResponse<unknown[]>>('admin.script.nodes', { scriptId }),

  updateNodes: (scriptId: number, nodes: unknown[]) =>
    trpcMutation<ApiResponse<void>>('admin.script.updateNodes', { scriptId, nodes }),
}

// Moment APIs
export const momentApi = {
  getList: (params: { page: number; pageSize: number }) =>
    trpcQuery<ApiResponse<PaginatedResponse<Moment>>>('admin.moment.list', params),

  hide: (id: number) =>
    trpcMutation<ApiResponse<void>>('admin.moment.hide', { id }),

  show: (id: number) =>
    trpcMutation<ApiResponse<void>>('admin.moment.show', { id }),

  delete: (id: number) =>
    trpcMutation<ApiResponse<void>>('admin.moment.delete', { id }),
}

// Dashboard APIs
export const dashboardApi = {
  getStats: () =>
    trpcQuery<ApiResponse<DashboardStats>>('admin.dashboard.stats'),

  getRecentUsers: () =>
    trpcQuery<ApiResponse<User[]>>('admin.dashboard.recentUsers'),

  getHotCharacters: () =>
    trpcQuery<ApiResponse<(Character & { gifts: number })[]>>('admin.dashboard.hotCharacters'),
}

// Settings APIs
export const settingsApi = {
  getConfig: () =>
    trpcQuery<ApiResponse<Record<string, unknown>>>('admin.settings.get'),

  updateConfig: (data: Record<string, unknown>) =>
    trpcMutation<ApiResponse<void>>('admin.settings.update', data),
}

export default api
