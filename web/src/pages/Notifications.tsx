import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavBar, List, Switch, Badge, Empty, SwipeAction, Dialog, Toast } from 'antd-mobile'
import { BellOutline, MessageOutline, HeartOutline, GiftOutline, SoundOutline } from 'antd-mobile-icons'

interface Notification {
  id: number
  type: 'message' | 'like' | 'gift' | 'system'
  title: string
  content: string
  isRead: boolean
  createdAt: string
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'message',
    title: '凌霄子',
    content: '给你发来了新消息',
    isRead: false,
    createdAt: '10分钟前',
  },
  {
    id: 2,
    type: 'like',
    title: '苏婉儿',
    content: '赞了你的评论',
    isRead: false,
    createdAt: '1小时前',
  },
  {
    id: 3,
    type: 'gift',
    title: '系统通知',
    content: '你收到了一份神秘礼物',
    isRead: true,
    createdAt: '昨天',
  },
  {
    id: 4,
    type: 'system',
    title: '系统公告',
    content: 'VIP会员专属活动开始啦！',
    isRead: true,
    createdAt: '2天前',
  },
]

const notificationIcons = {
  message: <MessageOutline fontSize={20} className="text-blue-500" />,
  like: <HeartOutline fontSize={20} className="text-red-500" />,
  gift: <GiftOutline fontSize={20} className="text-yellow-500" />,
  system: <BellOutline fontSize={20} className="text-gray-500" />,
}

export default function Notifications() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [settings, setSettings] = useState({
    pushEnabled: true,
    messageSound: true,
    likeNotify: true,
    systemNotify: true,
  })

  const unreadCount = notifications.filter(n => !n.isRead).length

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, isRead: true } : n
    ))
  }

  const handleDelete = async (id: number) => {
    const result = await Dialog.confirm({ content: '确定删除该通知？' })
    if (result) {
      setNotifications(notifications.filter(n => n.id !== id))
      Toast.show({ icon: 'success', content: '已删除' })
    }
  }

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })))
    Toast.show({ icon: 'success', content: '全部已读' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar
        onBack={() => navigate(-1)}
        right={
          unreadCount > 0 && (
            <span className="text-blue-500 text-sm" onClick={handleMarkAllAsRead}>
              全部已读
            </span>
          )
        }
      >
        消息通知
      </NavBar>

      {/* Notification Settings */}
      <div className="bg-white mb-3">
        <List header="通知设置">
          <List.Item
            prefix={<SoundOutline fontSize={20} className="text-gray-500" />}
            extra={<Switch checked={settings.pushEnabled} onChange={v => setSettings({ ...settings, pushEnabled: v })} />}
          >
            推送通知
          </List.Item>
          <List.Item
            extra={<Switch checked={settings.messageSound} onChange={v => setSettings({ ...settings, messageSound: v })} />}
          >
            消息提示音
          </List.Item>
          <List.Item
            extra={<Switch checked={settings.likeNotify} onChange={v => setSettings({ ...settings, likeNotify: v })} />}
          >
            点赞通知
          </List.Item>
          <List.Item
            extra={<Switch checked={settings.systemNotify} onChange={v => setSettings({ ...settings, systemNotify: v })} />}
          >
            系统通知
          </List.Item>
        </List>
      </div>

      {/* Notification List */}
      <div className="bg-white">
        <List header={
          <div className="flex items-center justify-between">
            <span>消息列表</span>
            {unreadCount > 0 && <Badge content={unreadCount} />}
          </div>
        }>
          {notifications.length === 0 ? (
            <div className="py-8">
              <Empty description="暂无通知" />
            </div>
          ) : (
            notifications.map(notification => (
              <SwipeAction
                key={notification.id}
                rightActions={[
                  {
                    key: 'delete',
                    text: '删除',
                    color: 'danger',
                    onClick: () => handleDelete(notification.id),
                  },
                ]}
              >
                <List.Item
                  prefix={notificationIcons[notification.type]}
                  description={
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">{notification.content}</span>
                      <span className="text-xs text-gray-400">{notification.createdAt}</span>
                    </div>
                  }
                  onClick={() => handleMarkAsRead(notification.id)}
                  style={{ backgroundColor: notification.isRead ? 'transparent' : '#f0f9ff' }}
                >
                  <div className="flex items-center gap-2">
                    <span className={notification.isRead ? 'text-gray-600' : 'font-medium'}>{notification.title}</span>
                    {!notification.isRead && <Badge content={Badge.dot} />}
                  </div>
                </List.Item>
              </SwipeAction>
            ))
          )}
        </List>
      </div>
    </div>
  )
}
