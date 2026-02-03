import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavBar, Tabs, Image, Empty, SwipeAction, Dialog, Toast } from 'antd-mobile'

interface FavoriteCharacter {
  id: number
  name: string
  avatar: string
  description: string
  tags: string[]
  createdAt: string
}

interface FavoriteMoment {
  id: number
  characterName: string
  characterAvatar: string
  content: string
  createdAt: string
}

const mockCharacters: FavoriteCharacter[] = [
  {
    id: 1,
    name: '凌霄子',
    avatar: '',
    description: '天璇门掌门大弟子,剑道修为已臻化境',
    tags: ['修真', '高冷'],
    createdAt: '2026-01-08',
  },
  {
    id: 2,
    name: '苏婉儿',
    avatar: '',
    description: '温婉如水,善解人意的邻家女孩',
    tags: ['温柔', '邻家'],
    createdAt: '2026-01-07',
  },
]

const mockMoments: FavoriteMoment[] = [
  {
    id: 1,
    characterName: '凌霄子',
    characterAvatar: '',
    content: '今日修炼有感,剑道之极,非在剑锋之利,而在心境之明。',
    createdAt: '2026-01-09',
  },
]

export default function Favorites() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('characters')
  const [characters, setCharacters] = useState<FavoriteCharacter[]>(mockCharacters)
  const [moments, setMoments] = useState<FavoriteMoment[]>(mockMoments)

  const getAvatarBg = (name: string) => {
    const colors = [
      'from-blue-100 to-blue-200',
      'from-purple-100 to-purple-200',
      'from-pink-100 to-pink-200',
      'from-green-100 to-green-200',
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  const handleRemoveCharacter = async (id: number) => {
    const result = await Dialog.confirm({ content: '确定取消收藏该角色？' })
    if (result) {
      setCharacters(characters.filter(c => c.id !== id))
      Toast.show({ icon: 'success', content: '已取消收藏' })
    }
  }

  const handleRemoveMoment = async (id: number) => {
    const result = await Dialog.confirm({ content: '确定取消收藏该动态？' })
    if (result) {
      setMoments(moments.filter(m => m.id !== id))
      Toast.show({ icon: 'success', content: '已取消收藏' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar onBack={() => navigate(-1)}>我的收藏</NavBar>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        style={{ '--active-line-color': '#3b82f6', '--active-title-color': '#3b82f6' }}
      >
        <Tabs.Tab key="characters" title="角色">
          <div className="p-4">
            {characters.length === 0 ? (
              <Empty description="暂无收藏的角色" />
            ) : (
              characters.map(character => (
                <SwipeAction
                  key={character.id}
                  rightActions={[
                    {
                      key: 'delete',
                      text: '取消收藏',
                      color: 'danger',
                      onClick: () => handleRemoveCharacter(character.id),
                    },
                  ]}
                >
                  <div
                    className="flex items-center gap-3 p-3 bg-white rounded-lg mb-2"
                    onClick={() => navigate(`/chat/${character.id}`)}
                  >
                    <div className={`w-12 h-12 rounded-full overflow-hidden bg-gradient-to-b ${getAvatarBg(character.name)} flex items-center justify-center`}>
                      {character.avatar ? (
                        <Image src={character.avatar} width={48} height={48} fit="cover" style={{ borderRadius: '50%' }} />
                      ) : (
                        <span className="text-lg font-medium text-gray-600">{character.name.slice(0, 1)}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{character.name}</div>
                      <div className="text-sm text-gray-500 truncate">{character.description}</div>
                      <div className="flex gap-1 mt-1">
                        {character.tags.map(tag => (
                          <span key={tag} className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </SwipeAction>
              ))
            )}
          </div>
        </Tabs.Tab>

        <Tabs.Tab key="moments" title="动态">
          <div className="p-4">
            {moments.length === 0 ? (
              <Empty description="暂无收藏的动态" />
            ) : (
              moments.map(moment => (
                <SwipeAction
                  key={moment.id}
                  rightActions={[
                    {
                      key: 'delete',
                      text: '取消收藏',
                      color: 'danger',
                      onClick: () => handleRemoveMoment(moment.id),
                    },
                  ]}
                >
                  <div className="bg-white rounded-lg p-4 mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-b ${getAvatarBg(moment.characterName)} flex items-center justify-center`}>
                        <span className="text-sm font-medium text-gray-600">{moment.characterName.slice(0, 1)}</span>
                      </div>
                      <span className="font-medium text-gray-800">{moment.characterName}</span>
                      <span className="text-xs text-gray-400 ml-auto">{moment.createdAt}</span>
                    </div>
                    <p className="text-gray-700 text-sm">{moment.content}</p>
                  </div>
                </SwipeAction>
              ))
            )}
          </div>
        </Tabs.Tab>
      </Tabs>
    </div>
  )
}
