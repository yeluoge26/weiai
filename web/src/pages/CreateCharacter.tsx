import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { NavBar, Form, Input, TextArea, ImageUploader, Selector, Button, Toast, Radio, Space } from 'antd-mobile'
import type { ImageUploadItem } from 'antd-mobile/es/components/image-uploader'

type CharacterType = 'assistant' | 'rpg' | 'companion'

const typeLabels: Record<CharacterType, { name: string; desc: string; icon: string }> = {
  assistant: { name: '普通助手', desc: '通用AI助手，可自定义名称和头像', icon: '🤖' },
  rpg: { name: 'RPG角色', desc: '有背景故事和性格的角色扮演对象', icon: '🎭' },
  companion: { name: '陪伴角色', desc: '温暖贴心的情感陪伴角色', icon: '💝' },
}

const personalityOptions = [
  { label: '温柔', value: 'gentle' },
  { label: '活泼', value: 'lively' },
  { label: '高冷', value: 'cold' },
  { label: '幽默', value: 'humorous' },
  { label: '成熟', value: 'mature' },
  { label: '可爱', value: 'cute' },
]

const tagOptions = [
  { label: '修真', value: '修真' },
  { label: '仙侠', value: '仙侠' },
  { label: '都市', value: '都市' },
  { label: '职场', value: '职场' },
  { label: '校园', value: '校园' },
  { label: '古风', value: '古风' },
  { label: '科幻', value: '科幻' },
  { label: '治愈', value: '治愈' },
]

export default function CreateCharacter() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialType = (searchParams.get('type') as CharacterType) || 'assistant'

  const [characterType, setCharacterType] = useState<CharacterType>(initialType)
  const [avatar, setAvatar] = useState<ImageUploadItem[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [personality, setPersonality] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [greeting, setGreeting] = useState('')
  const [backgroundStory, setBackgroundStory] = useState('')
  const [voiceStyle, setVoiceStyle] = useState('default')
  const [loading, setLoading] = useState(false)

  const mockUpload = async (file: File): Promise<ImageUploadItem> => {
    // Mock upload - in production, this would upload to a server
    return {
      url: URL.createObjectURL(file),
    }
  }

  const handleSubmit = async () => {
    if (!name.trim()) {
      Toast.show({ icon: 'fail', content: '请输入角色名称' })
      return
    }
    if (!description.trim()) {
      Toast.show({ icon: 'fail', content: '请输入角色简介' })
      return
    }

    setLoading(true)
    try {
      // Mock API call - in production, this would save to backend
      await new Promise(resolve => setTimeout(resolve, 1000))

      Toast.show({ icon: 'success', content: '创建成功' })
      navigate('/contacts')
    } catch {
      Toast.show({ icon: 'fail', content: '创建失败，请重试' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar onBack={() => navigate(-1)}>创建角色</NavBar>

      {/* Character Type Selection */}
      <div className="bg-white p-4 mb-3">
        <div className="text-sm font-medium text-gray-700 mb-3">角色类型</div>
        <Radio.Group
          value={characterType}
          onChange={(val) => setCharacterType(val as CharacterType)}
        >
          <Space direction="vertical" block>
            {(Object.keys(typeLabels) as CharacterType[]).map((type) => (
              <Radio
                key={type}
                value={type}
                style={{ '--icon-size': '22px', '--font-size': '16px', '--gap': '12px' }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{typeLabels[type].icon}</span>
                  <div>
                    <div className="font-medium">{typeLabels[type].name}</div>
                    <div className="text-xs text-gray-500">{typeLabels[type].desc}</div>
                  </div>
                </div>
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </div>

      {/* Basic Info */}
      <div className="bg-white p-4 mb-3">
        <div className="text-sm font-medium text-gray-700 mb-3">基本信息</div>

        <Form layout="vertical">
          <Form.Item label="头像">
            <ImageUploader
              value={avatar}
              onChange={setAvatar}
              upload={mockUpload}
              maxCount={1}
              style={{ '--cell-size': '80px' }}
            />
          </Form.Item>

          <Form.Item label="名称" required>
            <Input
              placeholder="给角色起个名字"
              value={name}
              onChange={setName}
              maxLength={20}
            />
          </Form.Item>

          <Form.Item label="简介" required>
            <TextArea
              placeholder="简单介绍一下这个角色"
              value={description}
              onChange={setDescription}
              maxLength={200}
              showCount
              rows={3}
            />
          </Form.Item>
        </Form>
      </div>

      {/* Personality */}
      <div className="bg-white p-4 mb-3">
        <div className="text-sm font-medium text-gray-700 mb-3">性格特点</div>
        <Selector
          options={personalityOptions}
          value={personality}
          onChange={setPersonality}
          multiple
          columns={3}
        />
      </div>

      {/* Tags - Only for RPG type */}
      {characterType === 'rpg' && (
        <div className="bg-white p-4 mb-3">
          <div className="text-sm font-medium text-gray-700 mb-3">角色标签</div>
          <Selector
            options={tagOptions}
            value={tags}
            onChange={setTags}
            multiple
            columns={4}
          />
        </div>
      )}

      {/* Greeting */}
      <div className="bg-white p-4 mb-3">
        <div className="text-sm font-medium text-gray-700 mb-3">开场白</div>
        <TextArea
          placeholder="角色第一次见面时会说的话"
          value={greeting}
          onChange={setGreeting}
          maxLength={500}
          showCount
          rows={4}
        />
      </div>

      {/* Background Story - Only for RPG type */}
      {characterType === 'rpg' && (
        <div className="bg-white p-4 mb-3">
          <div className="text-sm font-medium text-gray-700 mb-3">背景故事</div>
          <TextArea
            placeholder="描述角色的背景故事，这会影响角色的行为和对话风格"
            value={backgroundStory}
            onChange={setBackgroundStory}
            maxLength={1000}
            showCount
            rows={6}
          />
        </div>
      )}

      {/* Voice Style */}
      <div className="bg-white p-4 mb-3">
        <div className="text-sm font-medium text-gray-700 mb-3">语音风格</div>
        <Radio.Group
          value={voiceStyle}
          onChange={(val) => setVoiceStyle(val as string)}
        >
          <Space direction="horizontal" wrap>
            <Radio value="default">默认</Radio>
            <Radio value="gentle">温柔</Radio>
            <Radio value="cute">可爱</Radio>
            <Radio value="mature">成熟</Radio>
            <Radio value="cold">冷酷</Radio>
          </Space>
        </Radio.Group>
      </div>

      {/* Submit Button */}
      <div className="p-4 pb-8">
        <Button
          block
          color="primary"
          size="large"
          loading={loading}
          onClick={handleSubmit}
        >
          创建角色
        </Button>
      </div>
    </div>
  )
}
