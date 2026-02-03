import { useNavigate } from 'react-router-dom'
import { NavBar, List, Toast } from 'antd-mobile'
import { RightOutline, InformationCircleOutline, FileOutline, LockOutline, StarOutline } from 'antd-mobile-icons'

export default function About() {
  const navigate = useNavigate()

  const handleCheckUpdate = async () => {
    Toast.show({ icon: 'loading', content: '检查更新中...' })
    await new Promise(resolve => setTimeout(resolve, 1500))
    Toast.show({ icon: 'success', content: '已是最新版本' })
  }

  const handleRate = () => {
    Toast.show({ content: '感谢您的支持！' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar onBack={() => navigate(-1)}>关于我们</NavBar>

      {/* App Logo and Info */}
      <div className="bg-white flex flex-col items-center py-8 mb-3">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4">
          <span className="text-4xl text-white">💝</span>
        </div>
        <h1 className="text-xl font-semibold text-gray-800">WeLove</h1>
        <p className="text-sm text-gray-500 mt-1">AI情感陪伴助手</p>
        <p className="text-xs text-gray-400 mt-2">版本 1.0.0</p>
      </div>

      {/* App Description */}
      <div className="bg-white p-4 mb-3">
        <p className="text-gray-600 text-sm leading-relaxed">
          WeLove 是一款基于先进AI技术的情感陪伴应用。我们致力于为用户提供温暖、贴心的AI聊天体验，
          让每一次对话都充满意义。无论是寻求心灵慰藉，还是探索角色扮演的乐趣，WeLove 都能满足您的需求。
        </p>
      </div>

      {/* Links */}
      <List className="mb-3">
        <List.Item
          prefix={<InformationCircleOutline fontSize={20} className="text-blue-500" />}
          arrow={<RightOutline />}
          onClick={handleCheckUpdate}
        >
          检查更新
        </List.Item>
        <List.Item
          prefix={<StarOutline fontSize={20} className="text-yellow-500" />}
          arrow={<RightOutline />}
          onClick={handleRate}
        >
          给我们评分
        </List.Item>
      </List>

      <List className="mb-3">
        <List.Item
          prefix={<FileOutline fontSize={20} className="text-gray-500" />}
          arrow={<RightOutline />}
          onClick={() => Toast.show('用户协议')}
        >
          用户协议
        </List.Item>
        <List.Item
          prefix={<LockOutline fontSize={20} className="text-gray-500" />}
          arrow={<RightOutline />}
          onClick={() => Toast.show('隐私政策')}
        >
          隐私政策
        </List.Item>
        <List.Item
          arrow={<RightOutline />}
          onClick={() => Toast.show('开源许可')}
        >
          开源许可
        </List.Item>
      </List>

      {/* Team Info */}
      <div className="bg-white p-4 mb-3">
        <div className="font-medium text-gray-700 mb-2">开发团队</div>
        <p className="text-gray-500 text-sm">WeLove Team</p>
        <p className="text-gray-400 text-xs mt-1">Made with ❤️ in China</p>
      </div>

      {/* Contact */}
      <div className="bg-white p-4 mb-3">
        <div className="font-medium text-gray-700 mb-2">联系我们</div>
        <div className="text-sm text-gray-500 space-y-1">
          <p>客服邮箱: support@welove.com</p>
          <p>商务合作: business@welove.com</p>
          <p>官方网站: www.welove.com</p>
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-white p-4">
        <div className="font-medium text-gray-700 mb-3">关注我们</div>
        <div className="flex gap-4">
          <button
            className="flex-1 py-3 bg-green-50 text-green-600 rounded-lg text-sm"
            onClick={() => Toast.show('微信公众号: WeLove官方')}
          >
            微信公众号
          </button>
          <button
            className="flex-1 py-3 bg-red-50 text-red-600 rounded-lg text-sm"
            onClick={() => Toast.show('微博: @WeLove官方')}
          >
            微博
          </button>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center py-6 text-xs text-gray-400">
        <p>© 2026 WeLove. All rights reserved.</p>
        <p className="mt-1">ICP备案号: 京ICP备2026000000号</p>
      </div>
    </div>
  )
}
