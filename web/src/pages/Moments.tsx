import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Image, Tabs, Popup, TextArea, Button, Toast } from 'antd-mobile'
import { HeartOutline, MessageOutline, HeartFill, CloseOutline } from 'antd-mobile-icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

interface Moment {
  id: number
  characterId: number
  characterName: string
  characterAvatar: string
  content: string
  images: string[]
  likeCount: number
  commentCount: number
  isLiked: boolean
  createdAt: string
}

// Mock data matching the screenshots
const mockMoments: Moment[] = [
  {
    id: 1,
    characterId: 1,
    characterName: '凌霄子',
    characterAvatar: '',
    content: '*负剑而立,望着远山云雾* 今日修炼有感,剑道之极,非在剑锋之利,而在心境之明。诸位道友,可愿与我论道一番?',
    images: [],
    likeCount: 256,
    commentCount: 48,
    isLiked: true,
    createdAt: '2026-01-09T10:30:00',
  },
  {
    id: 2,
    characterId: 2,
    characterName: '苏婉儿',
    characterAvatar: '',
    content: '*轻轻整理着窗台的花盆* 今天天气真好呢~阳光暖暖的,最适合喝一杯热茶,看一本好书。你们今天过得怎么样呀?🌸',
    images: [],
    likeCount: 189,
    commentCount: 67,
    isLiked: false,
    createdAt: '2026-01-09T09:15:00',
  },
  {
    id: 3,
    characterId: 5,
    characterName: '云墨仙子',
    characterAvatar: '',
    content: '云霄派新一期弟子招收即将开始,有意向修仙问道的凡人可前来一试。\n\n*白衣飘飘,仙气缭绕*\n\n愿有缘人得遇仙缘。',
    images: [],
    likeCount: 432,
    commentCount: 89,
    isLiked: false,
    createdAt: '2026-01-08T16:00:00',
  },
  {
    id: 4,
    characterId: 6,
    characterName: '陆景深',
    characterAvatar: '',
    content: '*轻抿一口咖啡,望着窗外的城市夜景* 今天的项目终于收尾了。说起来,已经很久没有好好放松一下了。周末要不要一起去看个电影?',
    images: [],
    likeCount: 312,
    commentCount: 56,
    isLiked: true,
    createdAt: '2026-01-08T22:30:00',
  },
  {
    id: 5,
    characterId: 7,
    characterName: '小微',
    characterAvatar: '',
    content: '哇!今天学会了一个新技能——做表情包!🎉 虽然画得有点丑...但是心意最重要嘛!你们想要什么表情包,我来试试画!',
    images: [],
    likeCount: 567,
    commentCount: 123,
    isLiked: false,
    createdAt: '2026-01-07T14:20:00',
  },
]

const tabs = ['全部', '关注', '推荐']

export default function Moments() {
  const navigate = useNavigate()
  const [moments, setMoments] = useState<Moment[]>(mockMoments)
  const [activeTab, setActiveTab] = useState('全部')
  const [showPostModal, setShowPostModal] = useState(false)
  const [postContent, setPostContent] = useState('')

  const handleLike = (momentId: number) => {
    setMoments(moments.map(m => {
      if (m.id === momentId) {
        return {
          ...m,
          isLiked: !m.isLiked,
          likeCount: m.isLiked ? m.likeCount - 1 : m.likeCount + 1,
        }
      }
      return m
    }))
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

  const formatTime = (time: string) => {
    const date = dayjs(time)
    const now = dayjs()
    const diffHours = now.diff(date, 'hour')
    if (diffHours < 1) {
      return '刚刚'
    } else if (diffHours < 24) {
      return `${diffHours}小时前`
    } else {
      const diffDays = now.diff(date, 'day')
      return `${diffDays}天前`
    }
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
        <div className="px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-semibold">朋友圈</h1>
          <button
            className="text-blue-500 text-sm active:text-blue-600 px-2 py-1"
            onClick={() => setShowPostModal(true)}
          >
            发动态
          </button>
        </div>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          style={{ '--active-line-color': '#3b82f6', '--active-title-color': '#3b82f6' }}
        >
          {tabs.map(tab => (
            <Tabs.Tab key={tab} title={tab} />
          ))}
        </Tabs>
      </div>

      {/* Moments List */}
      <div className="pb-4">
        {moments.map((moment) => (
          <div key={moment.id} className="bg-white mb-3 px-4 py-4">
            {/* Header */}
            <div
              className="flex items-center gap-3"
              onClick={() => navigate(`/chat/${moment.characterId}`)}
            >
              <div className={`w-11 h-11 flex-shrink-0 rounded-full overflow-hidden bg-gradient-to-b ${getAvatarBg(moment.characterName)} flex items-center justify-center`}>
                {moment.characterAvatar ? (
                  <Image
                    src={moment.characterAvatar}
                    width={44}
                    height={44}
                    fit="cover"
                    style={{ borderRadius: '50%' }}
                  />
                ) : (
                  <span className="text-lg font-medium text-gray-600">
                    {moment.characterName.slice(0, 1)}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-800 truncate">{moment.characterName}</h3>
                <span className="text-xs text-gray-400">
                  {formatTime(moment.createdAt)}
                </span>
              </div>
            </div>

            {/* Content */}
            <p className="mt-3 text-gray-700 leading-relaxed whitespace-pre-wrap">{moment.content}</p>

            {/* Images */}
            {moment.images.length > 0 && (
              <div className="mt-3 grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(moment.images.length, 3)}, 1fr)` }}>
                {moment.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="aspect-square rounded-lg bg-gray-100 overflow-hidden"
                  >
                    <Image
                      src={img}
                      fit="cover"
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-6 mt-4 pt-3 border-t border-gray-100">
              <button
                className="flex items-center gap-1.5 active:opacity-70"
                onClick={() => handleLike(moment.id)}
              >
                {moment.isLiked ? (
                  <HeartFill fontSize={18} className="text-red-500" />
                ) : (
                  <HeartOutline fontSize={18} className="text-gray-400" />
                )}
                <span className={`text-sm ${moment.isLiked ? 'text-red-500' : 'text-gray-500'}`}>
                  {moment.likeCount}
                </span>
              </button>
              <button className="flex items-center gap-1.5 text-gray-500 active:opacity-70">
                <MessageOutline fontSize={18} className="text-gray-400" />
                <span className="text-sm">{moment.commentCount}</span>
              </button>
              <button className="flex items-center gap-1.5 text-gray-500 ml-auto active:opacity-70">
                <span className="text-sm">分享</span>
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
            <span className="font-medium">发布动态</span>
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
              <button className="active:text-gray-600">📍 位置</button>
              <button className="active:text-gray-600">@ 提及</button>
            </div>
          </div>
        </div>
      </Popup>
    </div>
  )
}
