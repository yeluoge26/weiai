import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Tabs, Card, Grid, SearchBar, InfiniteScroll } from 'antd-mobile'
import { characterApi } from '@/services/api'

interface Character {
  id: number
  name: string
  avatar: string
  description: string
  category: string
  tags: string[]
  isPremium: boolean
  chatCount: number
}

interface Category {
  key: string
  name: string
  count: number
}

export default function Characters() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState<Category[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [characters, setCharacters] = useState<Character[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    setPage(1)
    setCharacters([])
    setHasMore(true)
  }, [activeCategory, search])

  const loadCategories = async () => {
    try {
      const res = await characterApi.categories()
      setCategories([{ key: 'all', name: '全部', count: 0 }, ...res])
    } catch (error) {
      // handled by interceptor
    }
  }

  const loadMore = async () => {
    try {
      const params: any = { page, pageSize: 20 }
      if (activeCategory !== 'all') {
        params.category = activeCategory
      }
      if (search) {
        params.search = search
      }

      const res = await characterApi.list(params)
      if (page === 1) {
        setCharacters(res.items)
      } else {
        setCharacters((prev) => [...prev, ...res.items])
      }
      setPage((p) => p + 1)
      setHasMore(res.items.length === 20)
    } catch (error) {
      setHasMore(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10">
        <div className="px-4 py-3">
          <SearchBar
            placeholder="搜索角色"
            value={search}
            onChange={setSearch}
            style={{
              '--background': '#f5f5f5',
              '--border-radius': '8px',
            } as any}
          />
        </div>
        <Tabs
          activeKey={activeCategory}
          onChange={setActiveCategory}
          style={{
            '--active-line-color': '#ff6b9d',
            '--active-title-color': '#ff6b9d',
          } as any}
        >
          {categories.map((cat) => (
            <Tabs.Tab key={cat.key} title={cat.name} />
          ))}
        </Tabs>
      </div>

      {/* Character Grid */}
      <div className="px-4 py-4">
        <Grid columns={2} gap={12}>
          {characters.map((char) => (
            <Grid.Item key={char.id}>
              <Card
                className="rounded-xl overflow-hidden"
                onClick={() => navigate(`/character/${char.id}`)}
              >
                <div className="relative h-36 bg-gradient-to-b from-primary-100 to-primary-200 flex items-center justify-center">
                  <span className="text-5xl">👩</span>
                  {char.isPremium && (
                    <span className="absolute top-2 right-2 bg-yellow-400 text-xs px-2 py-0.5 rounded-full text-white">
                      VIP
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-800">{char.name}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {char.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {char.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-primary-50 text-primary-500 px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center mt-2 text-xs text-gray-400">
                    <span>💬 {char.chatCount}</span>
                  </div>
                </div>
              </Card>
            </Grid.Item>
          ))}
        </Grid>

        <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
      </div>
    </div>
  )
}
