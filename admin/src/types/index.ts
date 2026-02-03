// User Types
export interface User {
  id: number
  username: string
  email: string
  phone?: string
  avatar?: string
  vipLevel: 'normal' | 'vip' | 'svip'
  coins: number
  points: number
  status: 'active' | 'banned'
  createdAt: string
  updatedAt: string
}

// Character Types
export interface Character {
  id: number
  name: string
  avatar: string
  category: 'system' | 'rpg' | 'companion'
  subCategory?: string
  personality: string
  gender: 'male' | 'female'
  description: string
  systemPrompt: string
  isRPG: boolean
  isNSFW: boolean
  hasTTS: boolean
  ttsVoiceId?: string
  chatCount: number
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

// Gift Types
export interface Gift {
  id: number
  name: string
  icon: string
  category: string
  price: number
  affinityPoints: number
  status: 'active' | 'inactive'
}

// Script Types
export interface Script {
  id: number
  name: string
  characterId: number
  characterName: string
  description?: string
  nodeCount: number
  completionCount: number
  avgAffinity: number
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
}

export interface ScriptNode {
  id: string
  type: 'dialogue' | 'choice' | 'ending'
  content: string
  choices?: ScriptChoice[]
  endingType?: 'good' | 'normal' | 'bad'
  nextNodeId?: string
}

export interface ScriptChoice {
  text: string
  nextId: string
  affinity: number
}

// Moment Types
export interface Moment {
  id: number
  authorType: 'user' | 'ai'
  authorId: number
  authorName: string
  authorAvatar: string
  content: string
  images: string[]
  likeCount: number
  commentCount: number
  status: 'normal' | 'hidden'
  createdAt: string
}

// API Response Types
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface PaginatedResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// Dashboard Stats
export interface DashboardStats {
  totalUsers: number
  userGrowth: number
  activeCharacters: number
  todayMessages: number
  messageGrowth: number
  todayRevenue: number
  revenueGrowth: number
}
