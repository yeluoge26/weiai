import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavBar, List, Switch, Selector, Slider, Dialog, Toast } from 'antd-mobile'
import { SoundOutline, SetOutline, GlobalOutline, DeleteOutline } from 'antd-mobile-icons'

export default function Settings() {
  const navigate = useNavigate()
  const [settings, setSettings] = useState({
    language: ['zh-CN'],
    theme: ['light'],
    fontSize: 16,
    autoPlay: true,
    saveTraffic: false,
    vibration: true,
    chatBackground: 'default',
  })

  const languageOptions = [
    { label: '简体中文', value: 'zh-CN' },
    { label: '繁體中文', value: 'zh-TW' },
    { label: 'English', value: 'en' },
  ]

  const themeOptions = [
    { label: '浅色', value: 'light' },
    { label: '深色', value: 'dark' },
    { label: '跟随系统', value: 'system' },
  ]

  const backgroundOptions = [
    { label: '默认', value: 'default' },
    { label: '简约白', value: 'white' },
    { label: '护眼绿', value: 'green' },
    { label: '暗夜黑', value: 'dark' },
  ]

  const handleClearCache = async () => {
    const result = await Dialog.confirm({
      content: '确定清除缓存？这将释放存储空间，但不会删除聊天记录。',
    })
    if (result) {
      Toast.show({ icon: 'loading', content: '清理中...' })
      await new Promise(resolve => setTimeout(resolve, 1000))
      Toast.show({ icon: 'success', content: '已清理 128MB 缓存' })
    }
  }

  const handleReset = async () => {
    const result = await Dialog.confirm({
      content: '确定恢复默认设置？',
    })
    if (result) {
      setSettings({
        language: ['zh-CN'],
        theme: ['light'],
        fontSize: 16,
        autoPlay: true,
        saveTraffic: false,
        vibration: true,
        chatBackground: 'default',
      })
      Toast.show({ icon: 'success', content: '已恢复默认设置' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar onBack={() => navigate(-1)}>通用设置</NavBar>

      {/* Language & Theme */}
      <List header="语言和主题" className="mb-3">
        <List.Item
          prefix={<GlobalOutline fontSize={20} className="text-gray-500" />}
          extra={languageOptions.find(o => o.value === settings.language[0])?.label}
          onClick={() => {
            Dialog.show({
              content: (
                <Selector
                  options={languageOptions}
                  value={settings.language}
                  onChange={v => setSettings({ ...settings, language: v })}
                />
              ),
              closeOnAction: true,
              actions: [{ key: 'confirm', text: '确定' }],
            })
          }}
          arrow
        >
          语言
        </List.Item>
        <List.Item
          prefix={<SetOutline fontSize={20} className="text-gray-500" />}
          extra={themeOptions.find(o => o.value === settings.theme[0])?.label}
          onClick={() => {
            Dialog.show({
              content: (
                <Selector
                  options={themeOptions}
                  value={settings.theme}
                  onChange={v => setSettings({ ...settings, theme: v })}
                />
              ),
              closeOnAction: true,
              actions: [{ key: 'confirm', text: '确定' }],
            })
          }}
          arrow
        >
          主题模式
        </List.Item>
      </List>

      {/* Display Settings */}
      <List header="显示设置" className="mb-3">
        <List.Item
          description={
            <div className="mt-2">
              <Slider
                value={settings.fontSize}
                onChange={v => setSettings({ ...settings, fontSize: v as number })}
                min={12}
                max={24}
                step={2}
                marks={{ 12: '小', 16: '标准', 20: '大', 24: '特大' }}
              />
            </div>
          }
        >
          字体大小
        </List.Item>
        <List.Item
          extra={backgroundOptions.find(o => o.value === settings.chatBackground)?.label}
          onClick={() => {
            Dialog.show({
              content: (
                <Selector
                  options={backgroundOptions}
                  value={[settings.chatBackground]}
                  onChange={v => setSettings({ ...settings, chatBackground: v[0] })}
                />
              ),
              closeOnAction: true,
              actions: [{ key: 'confirm', text: '确定' }],
            })
          }}
          arrow
        >
          聊天背景
        </List.Item>
      </List>

      {/* Media Settings */}
      <List header="媒体设置" className="mb-3">
        <List.Item
          prefix={<SoundOutline fontSize={20} className="text-gray-500" />}
          extra={<Switch checked={settings.autoPlay} onChange={v => setSettings({ ...settings, autoPlay: v })} />}
          description="自动播放语音消息"
        >
          自动播放
        </List.Item>
        <List.Item
          extra={<Switch checked={settings.saveTraffic} onChange={v => setSettings({ ...settings, saveTraffic: v })} />}
          description="使用移动网络时压缩图片"
        >
          省流量模式
        </List.Item>
        <List.Item
          extra={<Switch checked={settings.vibration} onChange={v => setSettings({ ...settings, vibration: v })} />}
          description="收到消息时震动提醒"
        >
          震动反馈
        </List.Item>
      </List>

      {/* Storage */}
      <List header="存储" className="mb-3">
        <List.Item
          prefix={<DeleteOutline fontSize={20} className="text-orange-500" />}
          extra="128MB"
          onClick={handleClearCache}
          arrow
        >
          清除缓存
        </List.Item>
      </List>

      {/* Reset */}
      <List>
        <List.Item onClick={handleReset}>
          <span className="text-blue-500">恢复默认设置</span>
        </List.Item>
      </List>

      {/* Version Info */}
      <div className="p-4 text-center text-sm text-gray-400">
        <p>WeLove v1.0.0</p>
        <p className="mt-1">Build 2026.01.09</p>
      </div>
    </div>
  )
}
