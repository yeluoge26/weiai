import { useNavigate } from 'react-router-dom'
import { List, Dialog, Toast, ProgressBar } from 'antd-mobile'
import { useAuthStore } from '@/stores/auth'
import {
  RightOutline,
  SetOutline,
  PayCircleOutline,
  HeartOutline,
  MessageOutline,
  QuestionCircleOutline,
  UserOutline,
  BellOutline,
  LockOutline,
  InformationCircleOutline,
} from 'antd-mobile-icons'

export default function Profile() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  // Mock user data
  const mockUser = {
    nickname: user?.nickname || '用户12345',
    avatar: '',
    vipLevel: 2,
    vipExpireDate: '2026-03-15',
    coins: 1280,
    diamonds: 50,
    dailyQuota: 100,
    usedQuota: 35,
    totalChats: 156,
    totalGifts: 28,
  }

  const quotaPercent = (mockUser.usedQuota / mockUser.dailyQuota) * 100

  const handleLogout = async () => {
    const result = await Dialog.confirm({
      content: '确定要退出登录吗？',
    })
    if (result) {
      logout()
      navigate('/login', { replace: true })
      Toast.show({ icon: 'success', content: '已退出登录' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header with User Info */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 pt-8 pb-16 px-4 safe-area-top">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
            {mockUser.avatar ? (
              <img src={mockUser.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <UserOutline fontSize={32} className="text-white" />
            )}
          </div>
          <div className="text-white flex-1">
            <h2 className="text-xl font-semibold">{mockUser.nickname}</h2>
            <div className="flex items-center gap-2 mt-1">
              {mockUser.vipLevel > 0 && (
                <span className="bg-yellow-400 text-yellow-900 text-xs px-2 py-0.5 rounded-full font-medium">
                  VIP{mockUser.vipLevel}
                </span>
              )}
              <span className="text-sm text-white/80">
                {mockUser.vipLevel > 0 ? `${mockUser.vipExpireDate} 到期` : '升级享更多特权'}
              </span>
            </div>
          </div>
          <button className="text-white/80">
            <RightOutline fontSize={20} />
          </button>
        </div>
      </div>

      {/* Stats Card */}
      <div className="bg-white mx-4 -mt-10 rounded-xl shadow-sm">
        <div className="grid grid-cols-4 py-4">
          <div className="text-center" onClick={() => navigate('/wallet')}>
            <div className="text-xl font-semibold text-yellow-500">{mockUser.coins}</div>
            <div className="text-xs text-gray-500 mt-1">金币</div>
          </div>
          <div className="text-center border-x border-gray-100">
            <div className="text-xl font-semibold text-purple-500">{mockUser.diamonds}</div>
            <div className="text-xs text-gray-500 mt-1">钻石</div>
          </div>
          <div className="text-center border-r border-gray-100">
            <div className="text-xl font-semibold text-blue-500">{mockUser.totalChats}</div>
            <div className="text-xs text-gray-500 mt-1">聊天</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold text-pink-500">{mockUser.totalGifts}</div>
            <div className="text-xs text-gray-500 mt-1">礼物</div>
          </div>
        </div>
      </div>

      {/* Daily Quota Card */}
      <div className="mx-4 mt-4 bg-white rounded-xl p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-800">今日配额</span>
          <span className="text-sm text-gray-500">
            {mockUser.usedQuota}/{mockUser.dailyQuota}
          </span>
        </div>
        <ProgressBar
          percent={quotaPercent}
          style={{
            '--track-width': '8px',
            '--fill-color': quotaPercent > 80 ? '#ef4444' : '#3b82f6',
          }}
        />
        <p className="text-xs text-gray-400 mt-2">
          {quotaPercent > 80 ? '配额即将用完,升级VIP获得更多配额' : '每日0点重置配额'}
        </p>
      </div>

      {/* VIP Card */}
      <div className="mx-4 mt-4 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-600 font-semibold">👑 VIP会员</span>
              {mockUser.vipLevel > 0 && (
                <span className="text-xs text-yellow-600">Lv.{mockUser.vipLevel}</span>
              )}
            </div>
            <p className="text-xs text-yellow-700 mt-1">
              {mockUser.vipLevel > 0
                ? '享受无限对话、专属角色等特权'
                : '开通VIP,解锁全部特权'}
            </p>
          </div>
          <button className="bg-yellow-500 text-white px-4 py-1.5 rounded-full text-sm">
            {mockUser.vipLevel > 0 ? '续费' : '开通'}
          </button>
        </div>
      </div>

      {/* Menu */}
      <div className="mt-4">
        <List>
          <List.Item
            prefix={<PayCircleOutline className="text-xl text-yellow-500" />}
            onClick={() => navigate('/wallet')}
            arrow={<RightOutline />}
          >
            我的钱包
          </List.Item>
          <List.Item
            prefix={<HeartOutline className="text-xl text-red-500" />}
            onClick={() => Toast.show('功能开发中')}
            arrow={<RightOutline />}
          >
            我的收藏
          </List.Item>
          <List.Item
            prefix={<MessageOutline className="text-xl text-blue-500" />}
            onClick={() => navigate('/chat')}
            arrow={<RightOutline />}
          >
            聊天记录
          </List.Item>
        </List>

        <List className="mt-4">
          <List.Item
            prefix={<BellOutline className="text-xl text-orange-500" />}
            onClick={() => Toast.show('功能开发中')}
            arrow={<RightOutline />}
          >
            消息通知
          </List.Item>
          <List.Item
            prefix={<LockOutline className="text-xl text-green-500" />}
            onClick={() => Toast.show('功能开发中')}
            arrow={<RightOutline />}
          >
            隐私设置
          </List.Item>
          <List.Item
            prefix={<SetOutline className="text-xl text-gray-500" />}
            onClick={() => Toast.show('功能开发中')}
            arrow={<RightOutline />}
          >
            通用设置
          </List.Item>
        </List>

        <List className="mt-4">
          <List.Item
            prefix={<QuestionCircleOutline className="text-xl text-blue-400" />}
            onClick={() => Toast.show('功能开发中')}
            arrow={<RightOutline />}
          >
            帮助与反馈
          </List.Item>
          <List.Item
            prefix={<InformationCircleOutline className="text-xl text-gray-400" />}
            onClick={() => Toast.show('功能开发中')}
            arrow={<RightOutline />}
          >
            关于我们
          </List.Item>
        </List>

        <List className="mt-4">
          <List.Item onClick={handleLogout}>
            <span className="text-red-500">退出登录</span>
          </List.Item>
        </List>
      </div>

      {/* Version */}
      <div className="text-center text-xs text-gray-400 mt-8">
        WeLove v1.0.0
      </div>
    </div>
  )
}
