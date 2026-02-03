import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavBar, List, Switch, Dialog, Toast } from 'antd-mobile'
import { LockOutline, EyeInvisibleOutline, DeleteOutline, FileOutline } from 'antd-mobile-icons'

export default function PrivacySettings() {
  const navigate = useNavigate()
  const [settings, setSettings] = useState({
    showOnlineStatus: true,
    allowStranger: false,
    showMoments: true,
    encryptChat: true,
    allowDataCollection: true,
  })

  const handleClearHistory = async () => {
    const result = await Dialog.confirm({
      content: '确定清除所有聊天记录？此操作不可恢复。',
    })
    if (result) {
      Toast.show({ icon: 'success', content: '聊天记录已清除' })
    }
  }

  const handleDeleteAccount = async () => {
    const result = await Dialog.confirm({
      title: '注销账号',
      content: '注销后，您的所有数据将被永久删除，包括角色、聊天记录、充值记录等。此操作不可恢复！',
    })
    if (result) {
      const confirmResult = await Dialog.confirm({
        content: '再次确认：您真的要注销账号吗？',
      })
      if (confirmResult) {
        Toast.show({ icon: 'loading', content: '处理中...' })
      }
    }
  }

  const handleExportData = async () => {
    Toast.show({ icon: 'loading', content: '正在导出...' })
    await new Promise(resolve => setTimeout(resolve, 1500))
    Toast.show({ icon: 'success', content: '数据已发送到您的邮箱' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar onBack={() => navigate(-1)}>隐私设置</NavBar>

      {/* Privacy Options */}
      <List header="隐私选项" className="mb-3">
        <List.Item
          prefix={<EyeInvisibleOutline fontSize={20} className="text-gray-500" />}
          extra={
            <Switch
              checked={settings.showOnlineStatus}
              onChange={v => setSettings({ ...settings, showOnlineStatus: v })}
            />
          }
          description="其他用户可以看到你的在线状态"
        >
          显示在线状态
        </List.Item>
        <List.Item
          extra={
            <Switch
              checked={settings.allowStranger}
              onChange={v => setSettings({ ...settings, allowStranger: v })}
            />
          }
          description="允许非好友查看你的个人资料"
        >
          允许陌生人访问
        </List.Item>
        <List.Item
          extra={
            <Switch
              checked={settings.showMoments}
              onChange={v => setSettings({ ...settings, showMoments: v })}
            />
          }
          description="在朋友圈中显示你的动态"
        >
          公开朋友圈
        </List.Item>
      </List>

      {/* Security Options */}
      <List header="安全设置" className="mb-3">
        <List.Item
          prefix={<LockOutline fontSize={20} className="text-gray-500" />}
          extra={
            <Switch
              checked={settings.encryptChat}
              onChange={v => setSettings({ ...settings, encryptChat: v })}
            />
          }
          description="端到端加密保护你的聊天内容"
        >
          聊天加密
        </List.Item>
        <List.Item
          extra={
            <Switch
              checked={settings.allowDataCollection}
              onChange={v => setSettings({ ...settings, allowDataCollection: v })}
            />
          }
          description="帮助我们改进产品体验"
        >
          允许数据收集
        </List.Item>
      </List>

      {/* Data Management */}
      <List header="数据管理" className="mb-3">
        <List.Item
          prefix={<FileOutline fontSize={20} className="text-blue-500" />}
          onClick={handleExportData}
          arrow
        >
          导出我的数据
        </List.Item>
        <List.Item
          prefix={<DeleteOutline fontSize={20} className="text-orange-500" />}
          onClick={handleClearHistory}
          arrow
        >
          清除聊天记录
        </List.Item>
      </List>

      {/* Danger Zone */}
      <List header="危险操作">
        <List.Item
          prefix={<DeleteOutline fontSize={20} className="text-red-500" />}
          onClick={handleDeleteAccount}
        >
          <span className="text-red-500">注销账号</span>
        </List.Item>
      </List>

      {/* Privacy Policy */}
      <div className="p-4 text-center">
        <button
          className="text-sm text-blue-500"
          onClick={() => Toast.show('隐私政策页面')}
        >
          查看隐私政策
        </button>
      </div>
    </div>
  )
}
