import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ProLayout, PageContainer } from '@ant-design/pro-components'
import {
  DashboardOutlined,
  UserOutlined,
  RobotOutlined,
  GiftOutlined,
  FileTextOutlined,
  CameraOutlined,
  SettingOutlined,
  LogoutOutlined,
  CrownOutlined,
  BarChartOutlined,
  ThunderboltOutlined,
  MonitorOutlined,
  SafetyOutlined,
} from '@ant-design/icons'
import { Dropdown, message } from 'antd'
import type { MenuProps } from 'antd'
import { useAuthStore } from '@/stores/auth'

const menuItems = [
  {
    path: '/dashboard',
    name: '数据概览',
    icon: <DashboardOutlined />,
  },
  {
    path: '/users',
    name: '用户管理',
    icon: <UserOutlined />,
  },
  {
    path: '/characters',
    name: '角色管理',
    icon: <RobotOutlined />,
  },
  {
    path: '/gifts',
    name: '礼物管理',
    icon: <GiftOutlined />,
  },
  {
    path: '/scripts',
    name: '剧情脚本',
    icon: <FileTextOutlined />,
  },
  {
    path: '/moments',
    name: '朋友圈管理',
    icon: <CameraOutlined />,
  },
  {
    path: '/vip',
    name: 'VIP权益管理',
    icon: <CrownOutlined />,
  },
  {
    path: '/analytics',
    name: '数据分析',
    icon: <BarChartOutlined />,
  },
  {
    path: '/ai-config',
    name: 'AI配置',
    icon: <ThunderboltOutlined />,
  },
  {
    path: '/monitor',
    name: '系统监控',
    icon: <MonitorOutlined />,
  },
  {
    path: '/security',
    name: '安全设置',
    icon: <SafetyOutlined />,
  },
  {
    path: '/settings',
    name: '系统设置',
    icon: <SettingOutlined />,
  },
]

interface Props {
  children: React.ReactNode
}

export default function BasicLayout({ children }: Props) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => {
    logout()
    message.success('已退出登录')
    navigate('/login')
  }

  const dropdownItems: MenuProps['items'] = [
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
      onClick: () => navigate('/settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ]

  return (
    <ProLayout
      title="微爱管理后台"
      logo="/vite.svg"
      layout="mix"
      collapsed={collapsed}
      onCollapse={setCollapsed}
      location={{ pathname: location.pathname }}
      route={{
        path: '/',
        routes: menuItems,
      }}
      menuItemRender={(item, dom) => (
        <div onClick={() => item.path && navigate(item.path)}>{dom}</div>
      )}
      avatarProps={{
        src: user?.avatar || undefined,
        title: user?.username || 'Admin',
        render: (_, dom) => (
          <Dropdown menu={{ items: dropdownItems }} placement="bottomRight">
            {dom}
          </Dropdown>
        ),
      }}
      token={{
        header: {
          colorBgHeader: '#fff',
        },
        sider: {
          colorMenuBackground: '#fff',
          colorTextMenuSelected: '#ec4899',
          colorBgMenuItemSelected: '#fce7f3',
        },
      }}
    >
      <PageContainer>{children}</PageContainer>
    </ProLayout>
  )
}
