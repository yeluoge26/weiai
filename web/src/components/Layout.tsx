import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { TabBar } from 'antd-mobile'
import {
  MessageOutline,
  TeamOutline,
  PictureOutline,
  GlobalOutline,
  CompassOutline,
  UserOutline,
} from 'antd-mobile-icons'

const tabs = [
  { key: '/chat', title: '聊天', icon: <MessageOutline /> },
  { key: '/contacts', title: '通讯录', icon: <TeamOutline /> },
  { key: '/moments', title: '朋友圈', icon: <PictureOutline /> },
  { key: '/community', title: '社区', icon: <GlobalOutline /> },
  { key: '/discover', title: '发现', icon: <CompassOutline /> },
  { key: '/profile', title: '我的', icon: <UserOutline /> },
]

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()

  // Determine active key based on current path
  const activeKey = tabs.find(tab => location.pathname.startsWith(tab.key))?.key || '/chat'

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 overflow-auto pb-14">
        <Outlet />
      </main>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 safe-area-bottom z-50">
        <TabBar
          activeKey={activeKey}
          onChange={(key) => navigate(key)}
        >
          {tabs.map((tab) => (
            <TabBar.Item
              key={tab.key}
              icon={tab.icon}
              title={tab.title}
            />
          ))}
        </TabBar>
      </div>
    </div>
  )
}
