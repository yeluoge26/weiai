import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { NavBar, Input, Button, Popup, Grid, Toast } from 'antd-mobile'
import { chatApi, characterApi, giftApi } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

interface Character {
  id: number
  name: string
  avatar: string
}

interface Gift {
  id: number
  name: string
  icon: string
  price: number
}

export default function ChatRoom() {
  const { characterId } = useParams<{ characterId: string }>()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const updateUser = useAuthStore((state) => state.updateUser)
  const [character, setCharacter] = useState<Character | null>(null)
  const [sessionId, setSessionId] = useState<number | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [showGifts, setShowGifts] = useState(false)
  const [gifts, setGifts] = useState<Gift[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (characterId) {
      initChat(parseInt(characterId))
    }
  }, [characterId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const initChat = async (charId: number) => {
    try {
      const [charRes, sessionRes] = await Promise.all([
        characterApi.detail(charId),
        chatApi.getSession(charId),
      ])
      setCharacter(charRes)
      setSessionId(sessionRes.sessionId)

      const msgRes = await chatApi.messages(sessionRes.sessionId)
      setMessages(msgRes.items)
    } catch (error) {
      // handled by interceptor
    }
  }

  const handleSend = async () => {
    if (!input.trim() || !sessionId || sending) return

    const content = input.trim()
    setInput('')
    setSending(true)

    // Optimistically add user message
    const tempUserMsg: Message = {
      id: Date.now(),
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, tempUserMsg])

    try {
      const res = await chatApi.send(sessionId, content)
      // Replace temp message and add AI response
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempUserMsg.id),
        res.userMessage,
        res.aiMessage,
      ])
    } catch (error) {
      // Remove temp message on error
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id))
      setInput(content)
    } finally {
      setSending(false)
    }
  }

  const loadGifts = async () => {
    try {
      const res = await giftApi.list()
      setGifts(res)
      setShowGifts(true)
    } catch (error) {
      // handled by interceptor
    }
  }

  const handleSendGift = async (gift: Gift) => {
    if (!character) return

    if ((user?.coins || 0) < gift.price) {
      Toast.show({ icon: 'fail', content: '金币不足' })
      return
    }

    try {
      const res = await giftApi.send(character.id, gift.id, 1)
      updateUser({ coins: res.newBalance })
      Toast.show({ icon: 'success', content: `送出 ${gift.name}` })
      setShowGifts(false)

      // Add gift message to chat
      if (res.thankMessage) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            role: 'assistant',
            content: res.thankMessage,
            createdAt: new Date().toISOString(),
          },
        ])
      }
    } catch (error) {
      // handled by interceptor
    }
  }

  if (!character) {
    return <div className="flex items-center justify-center min-h-screen">加载中...</div>
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <NavBar
        onBack={() => navigate(-1)}
        className="bg-white border-b flex-shrink-0"
        right={
          <span className="text-sm text-gray-500" onClick={() => navigate(`/character/${character.id}`)}>
            资料
          </span>
        }
      >
        {character.name}
      </NavBar>

      {/* Messages */}
      <div className="flex-1 overflow-auto px-4 py-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-10 h-10 rounded-full bg-gradient-to-b from-primary-100 to-primary-200 flex items-center justify-center flex-shrink-0 mr-2">
                <span className="text-lg">👩</span>
              </div>
            )}
            <div
              className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-primary-500 text-white rounded-br-sm'
                  : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
            {msg.role === 'user' && (
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 ml-2">
                <span className="text-lg">👤</span>
              </div>
            )}
          </div>
        ))}
        {sending && (
          <div className="flex justify-start mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-b from-primary-100 to-primary-200 flex items-center justify-center flex-shrink-0 mr-2">
              <span className="text-lg">👩</span>
            </div>
            <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
              <span className="text-gray-400 text-sm">正在输入...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t px-4 py-3 safe-area-bottom flex-shrink-0">
        <div className="flex items-end gap-2">
          <Button
            size="small"
            onClick={loadGifts}
            className="flex-shrink-0"
          >
            🎁
          </Button>
          <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-2">
            <Input
              placeholder="输入消息..."
              value={input}
              onChange={setInput}
              onEnterPress={handleSend}
            />
          </div>
          <Button
            color="primary"
            size="small"
            onClick={handleSend}
            loading={sending}
            disabled={!input.trim()}
            style={{ '--background-color': '#ff6b9d', '--border-color': '#ff6b9d' } as any}
          >
            发送
          </Button>
        </div>
      </div>

      {/* Gift Popup */}
      <Popup
        visible={showGifts}
        onMaskClick={() => setShowGifts(false)}
        bodyStyle={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}
      >
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">送礼物</h3>
            <span className="text-sm text-gray-500">💰 {user?.coins}</span>
          </div>
          <Grid columns={4} gap={12}>
            {gifts.map((gift) => (
              <Grid.Item key={gift.id}>
                <div
                  className="flex flex-col items-center py-2"
                  onClick={() => handleSendGift(gift)}
                >
                  <span className="text-3xl mb-1">🎁</span>
                  <span className="text-xs text-gray-700">{gift.name}</span>
                  <span className="text-xs text-primary-500">{gift.price}💰</span>
                </div>
              </Grid.Item>
            ))}
          </Grid>
        </div>
      </Popup>
    </div>
  )
}
