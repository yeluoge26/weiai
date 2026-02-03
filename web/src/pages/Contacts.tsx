import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchBar, Tag, Image, Popup, List } from 'antd-mobile'
import { AddOutline } from 'antd-mobile-icons'

interface Character {
  id: number
  name: string
  avatar: string
  description: string
  tags: string[]
  isCustom: boolean
}

// Mock data matching the screenshots
const mockRPGCharacters: Character[] = [
  { id: 1, name: '凌霄子', avatar: '', description: '天璇门掌门大弟子,剑道修为已臻化境', tags: ['RPG', '修真', '高冷'], isCustom: false },
  { id: 2, name: '苏婉儿', avatar: '', description: '温婉如水,善解人意的邻家女孩', tags: ['RPG', '温柔', '邻家'], isCustom: false },
  { id: 3, name: '严厉上司·王总', avatar: '', description: '500强企业高管,雷厉风行', tags: ['RPG', '职场', '严厉'], isCustom: false },
  { id: 4, name: '沈夜', avatar: '', description: '神秘莫测的暗夜公子', tags: ['RPG', '仙侠', '神秘'], isCustom: false },
  { id: 5, name: '云墨仙子', avatar: '', description: '云霄派仙子,冰清玉洁', tags: ['RPG', '仙侠', '高冷'], isCustom: false },
  { id: 6, name: '陆景深', avatar: '', description: '温文尔雅的都市精英', tags: ['RPG', '都市', '温柔'], isCustom: false },
]

const mockCustomCharacters: Character[] = [
  { id: 101, name: '小微', avatar: '', description: '活泼可爱的AI助手', tags: ['助手', '活泼'], isCustom: true },
  { id: 102, name: '暖心', avatar: '', description: '温暖治愈系陪伴者', tags: ['陪伴', '治愈'], isCustom: true },
  { id: 103, name: '智博', avatar: '', description: '博学多才的知识顾问', tags: ['助手', '专业'], isCustom: true },
]

const tagColors: Record<string, string> = {
  'RPG': 'bg-blue-100 text-blue-600',
  '修真': 'bg-purple-100 text-purple-600',
  '温柔': 'bg-pink-100 text-pink-600',
  '仙侠': 'bg-indigo-100 text-indigo-600',
  '高冷': 'bg-gray-100 text-gray-600',
  '职场': 'bg-orange-100 text-orange-600',
  '都市': 'bg-green-100 text-green-600',
  '助手': 'bg-cyan-100 text-cyan-600',
  '陪伴': 'bg-rose-100 text-rose-600',
}

export default function Contacts() {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [rpgCharacters] = useState<Character[]>(mockRPGCharacters)
  const [customCharacters] = useState<Character[]>(mockCustomCharacters)

  const filterCharacters = (characters: Character[]) => {
    if (!searchText) return characters
    return characters.filter(c =>
      c.name.includes(searchText) ||
      c.description.includes(searchText) ||
      c.tags.some(t => t.includes(searchText))
    )
  }

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

  const handleCharacterClick = (character: Character) => {
    navigate(`/chat/${character.id}`)
  }

  const handleCreateCharacter = (type: string) => {
    setShowCreateModal(false)
    // Navigate to character creation page based on type
    navigate(`/create-character?type=${type}`)
  }

  const CharacterCard = ({ character }: { character: Character }) => (
    <div
      className="flex items-center gap-3 p-3 bg-white rounded-lg mb-2 active:bg-gray-50"
      onClick={() => handleCharacterClick(character)}
    >
      <div className={`w-12 h-12 rounded-full overflow-hidden bg-gradient-to-b ${getAvatarBg(character.name)} flex items-center justify-center flex-shrink-0`}>
        {character.avatar ? (
          <Image
            src={character.avatar}
            width={48}
            height={48}
            fit="cover"
            style={{ borderRadius: '50%' }}
          />
        ) : (
          <span className="text-lg font-medium text-gray-600">
            {character.name.slice(0, 1)}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-800 mb-1">{character.name}</div>
        <div className="text-sm text-gray-500 truncate">{character.description}</div>
        <div className="flex flex-wrap gap-1 mt-1">
          {character.tags.map(tag => (
            <span
              key={tag}
              className={`text-xs px-1.5 py-0.5 rounded ${tagColors[tag] || 'bg-gray-100 text-gray-600'}`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b px-4 py-3 z-10">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-xl font-semibold">通讯录</h1>
          <button
            className="w-8 h-8 flex items-center justify-center text-gray-600"
            onClick={() => setShowCreateModal(true)}
          >
            <AddOutline fontSize={24} />
          </button>
        </div>
        <SearchBar
          placeholder="搜索角色"
          value={searchText}
          onChange={setSearchText}
          style={{ '--background': '#f5f5f5' }}
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* RPG Characters Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base font-medium text-gray-800">RPG角色</span>
            <span className="text-xs text-gray-400">({filterCharacters(rpgCharacters).length})</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            <Tag color="primary" fill="outline" round>全部</Tag>
            <Tag color="default" fill="outline" round>修真</Tag>
            <Tag color="default" fill="outline" round>仙侠</Tag>
            <Tag color="default" fill="outline" round>都市</Tag>
            <Tag color="default" fill="outline" round>职场</Tag>
          </div>
          {filterCharacters(rpgCharacters).map(character => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>

        {/* Custom Characters Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base font-medium text-gray-800">自定义角色</span>
            <span className="text-xs text-gray-400">({filterCharacters(customCharacters).length})</span>
          </div>
          {filterCharacters(customCharacters).map(character => (
            <CharacterCard key={character.id} character={character} />
          ))}
          <button
            className="w-full p-4 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 flex items-center justify-center gap-2"
            onClick={() => setShowCreateModal(true)}
          >
            <AddOutline fontSize={20} />
            <span>创建新角色</span>
          </button>
        </div>
      </div>

      {/* Create Character Modal */}
      <Popup
        visible={showCreateModal}
        onMaskClick={() => setShowCreateModal(false)}
        bodyStyle={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}
      >
        <div className="p-4">
          <div className="text-center mb-4">
            <h2 className="text-lg font-semibold">创建角色</h2>
            <p className="text-sm text-gray-500 mt-1">选择你想创建的角色类型</p>
          </div>
          <List>
            <List.Item
              prefix={<span className="text-2xl">🤖</span>}
              description="创建一个通用AI助手,可自定义名称和头像"
              onClick={() => handleCreateCharacter('assistant')}
              arrow
            >
              普通助手
            </List.Item>
            <List.Item
              prefix={<span className="text-2xl">🎭</span>}
              description="创建有背景故事和性格的角色扮演对象"
              onClick={() => handleCreateCharacter('rpg')}
              arrow
            >
              RPG角色
            </List.Item>
            <List.Item
              prefix={<span className="text-2xl">💝</span>}
              description="创建温暖贴心的情感陪伴角色"
              onClick={() => handleCreateCharacter('companion')}
              arrow
            >
              陪伴角色
            </List.Item>
          </List>
          <button
            className="w-full mt-4 py-3 text-gray-500"
            onClick={() => setShowCreateModal(false)}
          >
            取消
          </button>
        </div>
      </Popup>
    </div>
  )
}
