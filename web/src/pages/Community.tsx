import { useState } from 'react'
import { Tabs, SearchBar, Image, Tag, Popup, TextArea, Button, Toast } from 'antd-mobile'
import { HeartOutline, MessageOutline, HeartFill, CloseOutline } from 'antd-mobile-icons'

interface Post {
  id: number
  author: {
    name: string
    avatar: string
    isVip: boolean
  }
  content: string
  images: string[]
  likes: number
  comments: number
  isLiked: boolean
  category: string
  createdAt: string
}

const mockPosts: Post[] = [
  {
    id: 1,
    author: { name: '星月夜', avatar: '', isVip: true },
    content: '今天和凌霄子聊了好久,他的剑道理念让我受益匪浅。分享一下我们的对话记录~',
    images: [],
    likes: 128,
    comments: 32,
    isLiked: false,
    category: '角色分享',
    createdAt: '2小时前',
  },
  {
    id: 2,
    author: { name: '云淡风轻', avatar: '', isVip: false },
    content: '分享我自己创建的RPG角色——幽兰仙子,融合了修真和现代元素,大家觉得设定怎么样?',
    images: [],
    likes: 256,
    comments: 48,
    isLiked: true,
    category: '角色分享',
    createdAt: '5小时前',
  },
  {
    id: 3,
    author: { name: '技术小白', avatar: '', isVip: false },
    content: '请问如何让角色的对话更有代入感?我创建的角色总是跳出角色设定...',
    images: [],
    likes: 45,
    comments: 67,
    isLiked: false,
    category: '问答求助',
    createdAt: '1天前',
  },
  {
    id: 4,
    author: { name: '创意达人', avatar: '', isVip: true },
    content: '【教程】如何创建一个性格鲜明的RPG角色\n\n1. 确定核心性格特征\n2. 设计背景故事\n3. 定义语言风格\n4. 添加独特习惯...',
    images: [],
    likes: 512,
    comments: 89,
    isLiked: false,
    category: '教程攻略',
    createdAt: '2天前',
  },
]

const categories = ['推荐', '角色分享', '问答求助', '教程攻略', '官方公告']

export default function Community() {
  const [activeCategory, setActiveCategory] = useState('推荐')
  const [searchText, setSearchText] = useState('')
  const [posts, setPosts] = useState<Post[]>(mockPosts)
  const [showPostModal, setShowPostModal] = useState(false)
  const [postContent, setPostContent] = useState('')

  const filteredPosts = activeCategory === '推荐'
    ? posts
    : posts.filter(p => p.category === activeCategory)

  const handleLike = (postId: number) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          isLiked: !p.isLiked,
          likes: p.isLiked ? p.likes - 1 : p.likes + 1,
        }
      }
      return p
    }))
  }

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

  const handlePost = () => {
    if (!postContent.trim()) {
      Toast.show({ icon: 'fail', content: '请输入内容' })
      return
    }
    Toast.show({ icon: 'success', content: '发布成功' })
    setPostContent('')
    setShowPostModal(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-safe">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b z-10 safe-area-top">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-xl font-semibold">社区</h1>
            <button
              className="px-4 py-1.5 bg-blue-500 text-white text-sm rounded-full active:bg-blue-600"
              onClick={() => setShowPostModal(true)}
            >
              发帖
            </button>
          </div>
          <SearchBar
            placeholder="搜索帖子"
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

      {/* Posts List */}
      <div className="p-4 space-y-4">
        {filteredPosts.map(post => (
          <div key={post.id} className="bg-white rounded-lg p-4">
            {/* Author Info */}
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 flex-shrink-0 rounded-full overflow-hidden bg-gradient-to-b ${getAvatarBg(post.author.name)} flex items-center justify-center`}>
                {post.author.avatar ? (
                  <Image
                    src={post.author.avatar}
                    width={40}
                    height={40}
                    fit="cover"
                    style={{ borderRadius: '50%' }}
                  />
                ) : (
                  <span className="text-sm font-medium text-gray-600">
                    {post.author.name.slice(0, 1)}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-800 truncate">{post.author.name}</span>
                  {post.author.isVip && (
                    <span className="text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-600 rounded flex-shrink-0">VIP</span>
                  )}
                </div>
                <span className="text-xs text-gray-400">{post.createdAt}</span>
              </div>
              <Tag color="primary" fill="outline" style={{ '--border-radius': '12px' }} className="flex-shrink-0">
                {post.category}
              </Tag>
            </div>

            {/* Content */}
            <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap mb-3">
              {post.content}
            </div>

            {/* Images */}
            {post.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {post.images.map((img, idx) => (
                  <Image
                    key={idx}
                    src={img}
                    fit="cover"
                    style={{ borderRadius: '8px', aspectRatio: '1' }}
                  />
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-6 pt-3 border-t">
              <button
                className="flex items-center gap-1 text-gray-500 active:opacity-70"
                onClick={() => handleLike(post.id)}
              >
                {post.isLiked ? (
                  <HeartFill fontSize={18} className="text-red-500" />
                ) : (
                  <HeartOutline fontSize={18} />
                )}
                <span className={`text-sm ${post.isLiked ? 'text-red-500' : ''}`}>{post.likes}</span>
              </button>
              <button className="flex items-center gap-1 text-gray-500 active:opacity-70">
                <MessageOutline fontSize={18} />
                <span className="text-sm">{post.comments}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Post Modal */}
      <Popup
        visible={showPostModal}
        onMaskClick={() => setShowPostModal(false)}
        position="bottom"
        bodyStyle={{ height: '60vh', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <button onClick={() => setShowPostModal(false)}>
              <CloseOutline fontSize={24} className="text-gray-500" />
            </button>
            <span className="font-medium">发布帖子</span>
            <Button
              size="small"
              color="primary"
              onClick={handlePost}
            >
              发布
            </Button>
          </div>
          <div className="flex-1 p-4">
            <TextArea
              placeholder="分享你的想法..."
              value={postContent}
              onChange={setPostContent}
              autoFocus
              rows={8}
              style={{ '--font-size': '16px' }}
            />
          </div>
          <div className="p-4 pb-safe border-t">
            <div className="flex gap-4 text-gray-400">
              <button className="active:text-gray-600">📷 图片</button>
              <button className="active:text-gray-600"># 话题</button>
              <button className="active:text-gray-600">@ 提及</button>
            </div>
          </div>
        </div>
      </Popup>
    </div>
  )
}
