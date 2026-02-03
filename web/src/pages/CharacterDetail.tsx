import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, NavBar, Toast, Dialog } from 'antd-mobile'
import { characterApi, chatApi } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

interface Character {
  id: number
  name: string
  avatar: string
  cover: string
  description: string
  personality: string
  category: string
  tags: string[]
  greeting: string
  isPremium: boolean
  price: number
  chatCount: number
  likeCount: number
}

export default function CharacterDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const updateUser = useAuthStore((state) => state.updateUser)
  const [character, setCharacter] = useState<Character | null>(null)
  const [unlocked, setUnlocked] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (id) {
      loadCharacter(parseInt(id))
    }
  }, [id])

  const loadCharacter = async (characterId: number) => {
    try {
      const [charRes, unlockRes] = await Promise.all([
        characterApi.detail(characterId),
        characterApi.checkUnlock(characterId),
      ])
      setCharacter(charRes)
      setUnlocked(unlockRes.unlocked)
    } catch (error) {
      // handled by interceptor
    }
  }

  const handleUnlock = async () => {
    if (!character) return

    const result = await Dialog.confirm({
      content: `确定花费 ${character.price} 金币解锁 ${character.name}？`,
    })

    if (!result) return

    if ((user?.coins || 0) < character.price) {
      Toast.show({ icon: 'fail', content: '金币不足，请先充值' })
      navigate('/wallet')
      return
    }

    try {
      await characterApi.unlock(character.id)
      setUnlocked(true)
      updateUser({ coins: (user?.coins || 0) - character.price })
      Toast.show({ icon: 'success', content: '解锁成功' })
    } catch (error) {
      // handled by interceptor
    }
  }

  const handleStartChat = async () => {
    if (!character) return

    if (character.isPremium && !unlocked) {
      handleUnlock()
      return
    }

    setLoading(true)
    try {
      await chatApi.getSession(character.id)
      navigate(`/chat/${character.id}`)
    } catch (error) {
      // handled by interceptor
    } finally {
      setLoading(false)
    }
  }

  if (!character) {
    return <div className="flex items-center justify-center min-h-screen">加载中...</div>
  }

  return (
    <div className="min-h-screen bg-white">
      <NavBar onBack={() => navigate(-1)} className="bg-white/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-10">
        {character.name}
      </NavBar>

      {/* Cover */}
      <div className="pt-11">
        <div className="h-64 bg-gradient-to-b from-primary-200 to-primary-300 flex items-center justify-center relative">
          <span className="text-8xl">👩</span>
          {character.isPremium && !unlocked && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <span className="text-white text-lg">🔒 需要解锁</span>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="px-4 py-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{character.name}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span>💬 {character.chatCount}</span>
              <span>❤️ {character.likeCount}</span>
            </div>
          </div>
          {character.isPremium && (
            <span className="bg-yellow-400 text-white text-sm px-3 py-1 rounded-full">
              {unlocked ? '已解锁' : `${character.price} 金币`}
            </span>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {character.tags.map((tag) => (
            <span
              key={tag}
              className="bg-primary-50 text-primary-500 px-3 py-1 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Description */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">角色介绍</h3>
          <p className="text-gray-700 leading-relaxed">{character.description}</p>
        </div>

        {/* Personality */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">性格特点</h3>
          <p className="text-gray-700">{character.personality}</p>
        </div>

        {/* Greeting */}
        <div className="mt-6 bg-primary-50 rounded-xl p-4">
          <h3 className="text-sm font-medium text-primary-600 mb-2">打招呼</h3>
          <p className="text-gray-700 italic">"{character.greeting}"</p>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3 safe-area-bottom">
        <Button
          block
          color="primary"
          size="large"
          loading={loading}
          onClick={handleStartChat}
          style={{ '--background-color': '#ff6b9d', '--border-color': '#ff6b9d' } as any}
        >
          {character.isPremium && !unlocked ? `解锁并开始聊天 (${character.price}金币)` : '开始聊天'}
        </Button>
      </div>
    </div>
  )
}
