import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavBar, List, Collapse, TextArea, Button, ImageUploader, Toast } from 'antd-mobile'
import { QuestionCircleOutline, MessageOutline, FileOutline, RightOutline } from 'antd-mobile-icons'
import type { ImageUploadItem } from 'antd-mobile/es/components/image-uploader'

const faqList = [
  {
    key: '1',
    title: '如何创建自定义角色？',
    content: '在通讯录页面，点击右上角的"+"按钮，选择角色类型（普通助手、RPG角色或陪伴角色），填写角色信息后即可创建。',
  },
  {
    key: '2',
    title: '如何充值金币？',
    content: '进入"我的"->"我的钱包"，选择充值金额，支持支付宝、微信支付等多种支付方式。',
  },
  {
    key: '3',
    title: 'VIP会员有什么特权？',
    content: 'VIP会员享有：无限对话次数、专属角色、优先客服、去广告等特权。不同等级VIP特权不同。',
  },
  {
    key: '4',
    title: '聊天记录会保存多久？',
    content: '普通用户聊天记录保存30天，VIP用户永久保存。您也可以手动导出聊天记录。',
  },
  {
    key: '5',
    title: '如何删除聊天记录？',
    content: '在聊天页面，左滑对话可删除单个会话；在"隐私设置"中可一键清除所有聊天记录。',
  },
  {
    key: '6',
    title: '遇到角色回复异常怎么办？',
    content: '可以尝试刷新页面或重新开始对话。如问题持续，请通过反馈功能联系我们。',
  },
]

export default function HelpFeedback() {
  const navigate = useNavigate()
  const [feedbackType, setFeedbackType] = useState<'bug' | 'suggestion' | 'other'>('suggestion')
  const [feedbackContent, setFeedbackContent] = useState('')
  const [images, setImages] = useState<ImageUploadItem[]>([])
  const [loading, setLoading] = useState(false)

  const mockUpload = async (file: File): Promise<ImageUploadItem> => {
    return { url: URL.createObjectURL(file) }
  }

  const handleSubmit = async () => {
    if (!feedbackContent.trim()) {
      Toast.show({ icon: 'fail', content: '请输入反馈内容' })
      return
    }

    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      Toast.show({ icon: 'success', content: '反馈提交成功，感谢您的意见！' })
      setFeedbackContent('')
      setImages([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar onBack={() => navigate(-1)}>帮助与反馈</NavBar>

      {/* Quick Actions */}
      <List className="mb-3">
        <List.Item
          prefix={<QuestionCircleOutline fontSize={20} className="text-blue-500" />}
          arrow={<RightOutline />}
          onClick={() => Toast.show('在线客服')}
        >
          在线客服
        </List.Item>
        <List.Item
          prefix={<MessageOutline fontSize={20} className="text-green-500" />}
          arrow={<RightOutline />}
          onClick={() => Toast.show('联系邮箱: support@welove.com')}
        >
          联系我们
        </List.Item>
        <List.Item
          prefix={<FileOutline fontSize={20} className="text-orange-500" />}
          arrow={<RightOutline />}
          onClick={() => Toast.show('用户协议')}
        >
          用户协议
        </List.Item>
      </List>

      {/* FAQ */}
      <div className="bg-white mb-3">
        <div className="px-4 py-3 border-b">
          <span className="font-medium text-gray-700">常见问题</span>
        </div>
        <Collapse accordion>
          {faqList.map(faq => (
            <Collapse.Panel key={faq.key} title={faq.title}>
              <p className="text-gray-600 text-sm leading-relaxed">{faq.content}</p>
            </Collapse.Panel>
          ))}
        </Collapse>
      </div>

      {/* Feedback Form */}
      <div className="bg-white p-4">
        <div className="font-medium text-gray-700 mb-3">意见反馈</div>

        {/* Feedback Type */}
        <div className="flex gap-2 mb-3">
          {[
            { key: 'bug', label: '问题反馈' },
            { key: 'suggestion', label: '功能建议' },
            { key: 'other', label: '其他' },
          ].map(type => (
            <button
              key={type.key}
              className={`px-4 py-2 rounded-full text-sm ${
                feedbackType === type.key
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
              onClick={() => setFeedbackType(type.key as typeof feedbackType)}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Feedback Content */}
        <TextArea
          placeholder="请详细描述您的问题或建议..."
          value={feedbackContent}
          onChange={setFeedbackContent}
          maxLength={500}
          showCount
          rows={5}
          style={{ '--font-size': '14px' }}
        />

        {/* Image Upload */}
        <div className="mt-3">
          <div className="text-sm text-gray-500 mb-2">添加截图（可选）</div>
          <ImageUploader
            value={images}
            onChange={setImages}
            upload={mockUpload}
            maxCount={3}
          />
        </div>

        {/* Submit */}
        <Button
          block
          color="primary"
          className="mt-4"
          loading={loading}
          onClick={handleSubmit}
        >
          提交反馈
        </Button>
      </div>
    </div>
  )
}
