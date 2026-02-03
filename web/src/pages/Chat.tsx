import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { List, SwipeAction, Dialog, Toast, Image } from 'antd-mobile'
import { AddOutline } from 'antd-mobile-icons'
import { chatApi } from '@/services/api'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

interface ChatSession {
  id: number
  characterId: number
  characterName: string
  characterAvatar: string
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
  isPinned: boolean
}

// Mock data matching the screenshots
const mockSessions: ChatSession[] = [
  { id: 1, characterId: 1, characterName: '凌霄子', characterAvatar: '', lastMessage: '(剑眉微皱,目光从手中长剑上移开,落在...', lastMessageAt: '2026-01-09', unreadCount: 0, isPinned: false },
  { id: 2, characterId: 2, characterName: '苏婉儿', characterAvatar: '', lastMessage: '[收到礼物-爱心] *温柔地微笑* 收到爱心...', lastMessageAt: '2026-01-08', unreadCount: 0, isPinned: false },
  { id: 3, characterId: 3, characterName: '严厉上司·王总', characterAvatar: '', lastMessage: '开始聊天吧', lastMessageAt: '2026-01-08', unreadCount: 0, isPinned: false },
  { id: 4, characterId: 4, characterName: '沈夜', characterAvatar: '', lastMessage: '开始聊天吧', lastMessageAt: '2026-01-08', unreadCount: 0, isPinned: false },
  { id: 5, characterId: 5, characterName: '云墨仙子', characterAvatar: '', lastMessage: '开始聊天吧', lastMessageAt: '2026-01-07', unreadCount: 0, isPinned: false },
  { id: 6, characterId: 6, characterName: '陆景深', characterAvatar: '', lastMessage: '*修长的手指轻轻摩挲着手机屏幕,眼底...', lastMessageAt: '2026-01-07', unreadCount: 0, isPinned: false },
  { id: 7, characterId: 7, characterName: '小微', characterAvatar: '', lastMessage: '哇!是数字"11"耶!🤩 这是在玩什么神秘...', lastMessageAt: '2026-01-05', unreadCount: 0, isPinned: false },
  { id: 8, characterId: 8, characterName: '暖心', characterAvatar: '', lastMessage: '嗨,你好呀!🌸 很高兴见到你。我是暖心...', lastMessageAt: '2026-01-05', unreadCount: 0, isPinned: false },
  { id: 9, characterId: 9, characterName: '智博', characterAvatar: '', lastMessage: '您好,我是智博,一个致力于提供深度分...', lastMessageAt: '2026-01-05', unreadCount: 0, isPinned: false },
]

export default function Chat() {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState<ChatSession[]>(mockSessions)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    setLoading(true)
    try {
      const res = await chatApi.sessions()
      if (res.items && res.items.length > 0) {
        setSessions(res.items)
      }
    } catch {
      // Use mock data if API fails
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (session: ChatSession) => {
    const result = await Dialog.confirm({
      content: `确定删除与"${session.characterName}"的对话？`,
    })
    if (result) {
      try {
        await chatApi.deleteSession(session.id)
      } catch {
        // Ignore errors for mock
      }
      setSessions(sessions.filter(s => s.id !== session.id))
      Toast.show({ icon: 'success', content: '已删除' })
    }
  }

  const formatTime = (time: string) => {
    const date = dayjs(time)
    const now = dayjs()
    const diffDays = now.diff(date, 'day')
    if (diffDays < 1) {
      return date.format('HH:mm')
    } else if (diffDays < 30) {
      return `${diffDays}天前`
    } else {
      return date.format('MM/DD')
    }
  }

  // Avatar colors based on character name
  const getAvatarBg = (name: string) => {
    const colors = [
      'from-blue-100 to-blue-200',
      'from-purple-100 to-purple-200',
      'from-pink-100 to-pink-200',
      'from-green-100 to-green-200',
      'from-yellow-100 to-yellow-200',
      'from-red-100 to-red-200',
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b px-4 py-3 z-10 flex justify-between items-center">
        <h1 className="text-xl font-semibold">聊天</h1>
        <button
          className="w-8 h-8 flex items-center justify-center text-gray-600"
          onClick={() => navigate('/contacts')}
        >
          <AddOutline fontSize={24} />
        </button>
      </div>

      {/* Chat List */}
      {sessions.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <span className="text-4xl mb-4">💬</span>
          <p>暂无聊天记录</p>
          <p className="text-sm mt-1">去通讯录找角色开始聊天吧</p>
          <button
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-full text-sm"
            onClick={() => navigate('/contacts')}
          >
            开始聊天
          </button>
        </div>
      ) : (
        <List>
          {sessions.map((session) => (
            <SwipeAction
              key={session.id}
              rightActions={[
                {
                  key: 'delete',
                  text: '删除',
                  color: 'danger',
                  onClick: () => handleDelete(session),
                },
              ]}
            >
              <List.Item
                prefix={
                  <div className={`w-12 h-12 rounded-full overflow-hidden bg-gradient-to-b ${getAvatarBg(session.characterName)} flex items-center justify-center`}>
                    {session.characterAvatar ? (
                      <Image
                        src={session.characterAvatar}
                        width={48}
                        height={48}
                        fit="cover"
                        style={{ borderRadius: '50%' }}
                      />
                    ) : (
                      <span className="text-lg font-medium text-gray-600">
                        {session.characterName.slice(0, 1)}
                      </span>
                    )}
                  </div>
                }
                description={
                  <div className="text-gray-500 text-sm truncate max-w-[220px]">
                    {session.lastMessage}
                  </div>
                }
                extra={
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-gray-400">
                      {formatTime(session.lastMessageAt)}
                    </span>
                    {session.unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-1.5 min-w-[18px] h-[18px] flex items-center justify-center">
                        {session.unreadCount > 99 ? '99+' : session.unreadCount}
                      </span>
                    )}
                  </div>
                }
                onClick={() => navigate(`/chat/${session.characterId}`)}
                arrow={false}
              >
                <div className="flex items-center gap-2">
                  {session.isPinned && (
                    <span className="text-xs text-blue-500">📌</span>
                  )}
                  <span className="font-medium text-gray-800">{session.characterName}</span>
                </div>
              </List.Item>
            </SwipeAction>
          ))}
        </List>
      )}
    </div>
  )
}
