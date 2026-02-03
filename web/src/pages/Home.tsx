import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Swiper, Card, Grid } from 'antd-mobile'
import { characterApi } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

interface Character {
  id: number
  name: string
  avatar: string
  description: string
  category: string
  chatCount: number
}

export default function Home() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const [hotCharacters, setHotCharacters] = useState<Character[]>([])
  const [newCharacters, setNewCharacters] = useState<Character[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const res = await characterApi.list({ page: 1, pageSize: 10 })
      setHotCharacters(res.items.slice(0, 4))
      setNewCharacters(res.items)
    } catch (error) {
      // handled by interceptor
    }
  }

  const banners = [
    { id: 1, image: 'https://via.placeholder.com/750x300/ff6b9d/ffffff?text=AI+虚拟伴侣' },
    { id: 2, image: 'https://via.placeholder.com/750x300/9d6bff/ffffff?text=新角色上线' },
  ]

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-400 to-primary-500 text-white px-4 py-4 safe-area-top">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">WeLove</h1>
            <p className="text-sm text-white/80">你好，{user?.nickname}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">💰 {user?.coins}</span>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="px-4 mt-4">
        <Swiper autoplay loop className="rounded-xl overflow-hidden">
          {banners.map((banner) => (
            <Swiper.Item key={banner.id}>
              <div className="h-32 bg-gradient-to-r from-primary-300 to-primary-400 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg font-semibold">AI 虚拟伴侣</span>
              </div>
            </Swiper.Item>
          ))}
        </Swiper>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mt-4">
        <Grid columns={4} gap={12}>
          {[
            { icon: '💕', label: '推荐', path: '/characters' },
            { icon: '🔥', label: '热门', path: '/characters' },
            { icon: '✨', label: '新角色', path: '/characters' },
            { icon: '👑', label: 'VIP', path: '/wallet' },
          ].map((item) => (
            <Grid.Item key={item.label} onClick={() => navigate(item.path)}>
              <div className="flex flex-col items-center py-2">
                <span className="text-2xl mb-1">{item.icon}</span>
                <span className="text-xs text-gray-600">{item.label}</span>
              </div>
            </Grid.Item>
          ))}
        </Grid>
      </div>

      {/* Hot Characters */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">🔥 热门角色</h2>
          <span
            className="text-sm text-primary-500"
            onClick={() => navigate('/characters')}
          >
            查看更多
          </span>
        </div>
        <Grid columns={2} gap={12}>
          {hotCharacters.map((char) => (
            <Grid.Item key={char.id}>
              <Card
                className="rounded-xl overflow-hidden"
                onClick={() => navigate(`/character/${char.id}`)}
              >
                <div className="h-32 bg-gradient-to-b from-primary-100 to-primary-200 flex items-center justify-center">
                  <span className="text-5xl">👩</span>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-800">{char.name}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                    {char.description}
                  </p>
                  <div className="flex items-center mt-2 text-xs text-gray-400">
                    <span>💬 {char.chatCount}</span>
                  </div>
                </div>
              </Card>
            </Grid.Item>
          ))}
        </Grid>
      </div>

      {/* New Characters */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">✨ 新角色</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
          {newCharacters.map((char) => (
            <div
              key={char.id}
              className="flex-shrink-0 w-28"
              onClick={() => navigate(`/character/${char.id}`)}
            >
              <div className="w-28 h-28 rounded-xl bg-gradient-to-b from-primary-100 to-primary-200 flex items-center justify-center">
                <span className="text-4xl">👩</span>
              </div>
              <p className="text-sm text-center mt-2 text-gray-700">{char.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
