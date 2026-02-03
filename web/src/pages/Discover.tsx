import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchBar, Tabs, Image, Tag } from 'antd-mobile'
import { StarFill, FireFill } from 'antd-mobile-icons'

interface MarketCharacter {
  id: number
  name: string
  avatar: string
  description: string
  tags: string[]
  rating: number
  downloads: number
  price: number // 0 means free
  isHot: boolean
  isNew: boolean
  author: string
}

const mockMarketCharacters: MarketCharacter[] = [
  {
    id: 1,
    name: '凌霄子',
    avatar: '',
    description: '天璇门掌门大弟子,剑道修为已臻化境,性格高冷但内心温柔',
    tags: ['修真', '高冷', '剑修'],
    rating: 4.9,
    downloads: 12580,
    price: 0,
    isHot: true,
    isNew: false,
    author: '官方',
  },
  {
    id: 2,
    name: '苏婉儿',
    avatar: '',
    description: '温婉如水的邻家女孩,善解人意,是你最好的倾听者',
    tags: ['温柔', '邻家', '治愈'],
    rating: 4.8,
    downloads: 9876,
    price: 0,
    isHot: true,
    isNew: false,
    author: '官方',
  },
  {
    id: 3,
    name: '暗夜公爵',
    avatar: '',
    description: '神秘的暗夜贵族,拥有不老不死的永恒生命',
    tags: ['吸血鬼', '神秘', '贵族'],
    rating: 4.7,
    downloads: 5432,
    price: 9.9,
    isHot: false,
    isNew: true,
    author: '创意达人',
  },
  {
    id: 4,
    name: '机械少女',
    avatar: '',
    description: '来自未来的AI少女,对人类世界充满好奇',
    tags: ['科幻', '可爱', '未来'],
    rating: 4.6,
    downloads: 3210,
    price: 0,
    isHot: false,
    isNew: true,
    author: '科幻迷',
  },
  {
    id: 5,
    name: '古风才女',
    avatar: '',
    description: '精通琴棋书画的古代才女,谈吐优雅',
    tags: ['古风', '才艺', '优雅'],
    rating: 4.8,
    downloads: 7654,
    price: 4.9,
    isHot: true,
    isNew: false,
    author: '古风爱好者',
  },
  {
    id: 6,
    name: '热血教练',
    avatar: '',
    description: '永不放弃的体育教练,激励你突破自我',
    tags: ['励志', '热血', '运动'],
    rating: 4.5,
    downloads: 2345,
    price: 0,
    isHot: false,
    isNew: false,
    author: '运动达人',
  },
]

const categories = ['推荐', '热门', '最新', '免费', '付费']

export default function Discover() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('推荐')
  const [searchText, setSearchText] = useState('')

  const getFilteredCharacters = () => {
    let filtered = mockMarketCharacters

    if (searchText) {
      filtered = filtered.filter(c =>
        c.name.includes(searchText) ||
        c.description.includes(searchText) ||
        c.tags.some(t => t.includes(searchText))
      )
    }

    switch (activeCategory) {
      case '热门':
        return filtered.filter(c => c.isHot).sort((a, b) => b.downloads - a.downloads)
      case '最新':
        return filtered.filter(c => c.isNew)
      case '免费':
        return filtered.filter(c => c.price === 0)
      case '付费':
        return filtered.filter(c => c.price > 0)
      default:
        return filtered
    }
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

  const handleCharacterClick = (character: MarketCharacter) => {
    navigate(`/character/${character.id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-safe">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b z-10 safe-area-top">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-xl font-semibold">发现</h1>
          </div>
          <SearchBar
            placeholder="搜索角色市场"
            value={searchText}
            onChange={setSearchText}
            style={{ '--background': '#f5f5f5' }}
          />
        </div>
        <Tabs
          activeKey={activeCategory}
          onChange={setActiveCategory}
          style={{ '--active-line-color': '#3b82f6', '--active-title-color': '#3b82f6' }}
        >
          {categories.map(cat => (
            <Tabs.Tab key={cat} title={cat} />
          ))}
        </Tabs>
      </div>

      {/* Banner */}
      <div className="p-4">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-4 text-white">
          <h2 className="text-lg font-semibold mb-1">角色市场</h2>
          <p className="text-sm opacity-90">发现更多有趣的AI角色,或分享你的创作</p>
        </div>
      </div>

      {/* Character Grid */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-3">
          {getFilteredCharacters().map(character => (
            <div
              key={character.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm active:opacity-90"
              onClick={() => handleCharacterClick(character)}
            >
              {/* Avatar */}
              <div className={`h-28 sm:h-32 bg-gradient-to-b ${getAvatarBg(character.name)} flex items-center justify-center relative`}>
                {character.avatar ? (
                  <Image
                    src={character.avatar}
                    fit="cover"
                    style={{ width: '100%', height: '100%' }}
                  />
                ) : (
                  <span className="text-3xl sm:text-4xl font-medium text-gray-600">
                    {character.name.slice(0, 1)}
                  </span>
                )}
                {/* Badges */}
                <div className="absolute top-2 left-2 flex gap-1">
                  {character.isHot && (
                    <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <FireFill fontSize={10} /> 热门
                    </span>
                  )}
                  {character.isNew && (
                    <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded">
                      新品
                    </span>
                  )}
                </div>
                {/* Price */}
                <div className="absolute top-2 right-2">
                  {character.price > 0 ? (
                    <span className="bg-yellow-500 text-white text-xs px-1.5 py-0.5 rounded">
                      ¥{character.price}
                    </span>
                  ) : (
                    <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded">
                      免费
                    </span>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <div className="font-medium text-gray-800 mb-1 truncate">{character.name}</div>
                <div className="text-xs text-gray-500 line-clamp-2 mb-2 h-8">{character.description}</div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {character.tags.slice(0, 2).map(tag => (
                    <Tag key={tag} color="default" fill="outline" style={{ '--border-radius': '4px', fontSize: '10px' }}>
                      {tag}
                    </Tag>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center gap-0.5">
                    <StarFill fontSize={12} className="text-yellow-400" />
                    {character.rating}
                  </span>
                  <span>{character.downloads > 1000 ? `${(character.downloads / 1000).toFixed(1)}k` : character.downloads} 下载</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
