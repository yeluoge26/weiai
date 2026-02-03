import { useState } from 'react'
import { Card, Row, Col, Button, Table, Tag, Modal, Form, Input, Select, Switch, message, Space } from 'antd'
import { PlusOutlined, ReloadOutlined, EditOutlined, DeleteOutlined, MessageOutlined, SoundOutlined, PictureOutlined } from '@ant-design/icons'

interface AIProvider {
  id: string
  name: string
  description: string
  models: string[]
}

interface AIConfig {
  id: number
  name: string
  provider: string
  model: string
  apiKey: string
  baseUrl: string
  isDefault: boolean
  status: 'active' | 'inactive'
}

const aiProviders: AIProvider[] = [
  { id: 'openai', name: 'OpenAI', description: 'OpenAI官方API,支持GPT系列模型、TTS语音合成和DALL-E图像生成', models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'] },
  { id: 'grok', name: 'Grok (xAI)', description: 'xAI的Grok模型,支持对话和图像生成', models: ['grok-2', 'grok-2-vision', 'grok-beta'] },
  { id: 'xai', name: 'xAI', description: 'xAI官方API,与Grok相同', models: ['grok-2', 'grok-2-vision', 'grok-beta'] },
  { id: 'claude', name: 'Claude (Anthropic)', description: 'Anthropic的Claude模型,专注于安全和有帮助的AI对话', models: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022', 'claude-3-opus-20240229'] },
  { id: 'deepseek', name: 'DeepSeek', description: 'DeepSeek深度求索,高性价比的国产大模型', models: ['deepseek-chat', 'deepseek-coder', 'deepseek-reasoner'] },
  { id: 'qwen', name: '通义千问 (Qwen)', description: '阿里云通义千问,支持对话、CosyVoice语音合成和寓意图像生成', models: ['qwen-turbo', 'qwen-plus', 'qwen-max'] },
  { id: 'gemini', name: 'Gemini (Google)', description: 'Google的Gemini模型,支持多模态对话和Imagen图像生成', models: ['gemini-2.0-flash-exp', 'gemini-1.5-pro', 'gemini-1.5-flash'] },
  { id: 'glm', name: '智谱AI (GLM)', description: '智谱AI的GLM系列模型,支持对话和CogView图像生成', models: ['glm-4-plus', 'glm-4', 'glm-4-flash'] },
  { id: 'ernie', name: '百度文心', description: '百度文心一言,支持对话、语音合成和图像生成', models: ['ernie-4.0-8k', 'ernie-3.5-8k', 'ernie-speed-128k'] },
]

const mockConfigs: AIConfig[] = []

export default function AIConfigManagement() {
  const [loading, setLoading] = useState(false)
  const [configs, setConfigs] = useState<AIConfig[]>(mockConfigs)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingConfig, setEditingConfig] = useState<AIConfig | null>(null)
  const [activeTab, setActiveTab] = useState('chat')
  const [form] = Form.useForm()

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 500)
  }

  const handleAdd = () => {
    setEditingConfig(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (config: AIConfig) => {
    setEditingConfig(config)
    form.setFieldsValue(config)
    setModalVisible(true)
  }

  const handleDelete = (config: AIConfig) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除配置 "${config.name}" 吗？`,
      onOk: () => {
        setConfigs(configs.filter(c => c.id !== config.id))
        message.success('删除成功')
      },
    })
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      if (editingConfig) {
        setConfigs(configs.map(c => c.id === editingConfig.id ? { ...c, ...values } : c))
        message.success('更新成功')
      } else {
        setConfigs([...configs, { id: Date.now(), ...values, status: 'active' }])
        message.success('添加成功')
      }
      setModalVisible(false)
    } catch (error) {
      // Validation failed
    }
  }

  const columns = [
    { title: '配置名称', dataIndex: 'name', key: 'name' },
    { title: '服务商', dataIndex: 'provider', key: 'provider' },
    { title: '模型', dataIndex: 'model', key: 'model' },
    {
      title: '默认',
      dataIndex: 'isDefault',
      key: 'isDefault',
      render: (v: boolean) => v ? <Tag color="green">是</Tag> : <Tag>否</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: AIConfig) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>删除</Button>
        </Space>
      ),
    },
  ]

  const tabItems = [
    {
      key: 'chat',
      label: (
        <span>
          <MessageOutlined /> AI对话模型
        </span>
      ),
      children: (
        <Card style={{ border: '2px solid #1890ff', borderRadius: 8 }}>
          <p style={{ color: '#666' }}>支持OpenAI、Claude、Gemini、Qwen、DeepSeek等对话模型</p>
          <Tag>{configs.length} 个配置</Tag>
        </Card>
      ),
    },
    {
      key: 'tts',
      label: (
        <span>
          <SoundOutlined /> TTS语音合成
        </span>
      ),
      children: (
        <Card>
          <p style={{ color: '#666' }}>支持OpenAI TTS、CosyVoice、百度语音等语音合成服务</p>
          <Tag>0 个配置</Tag>
        </Card>
      ),
    },
    {
      key: 'image',
      label: (
        <span>
          <PictureOutlined /> AI绘图模型
        </span>
      ),
      children: (
        <Card>
          <p style={{ color: '#666' }}>支持DALL-E、Stable Diffusion、寓意、CogView等图像生成</p>
          <Tag>0 个配置</Tag>
        </Card>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ marginBottom: 8 }}>AI配置管理</h2>
      </div>

      {/* Config Type Tabs */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {tabItems.map(item => (
          <Col span={8} key={item.key}>
            <div
              onClick={() => setActiveTab(item.key)}
              style={{
                cursor: 'pointer',
                border: activeTab === item.key ? '2px solid #1890ff' : '1px solid #d9d9d9',
                borderRadius: 8,
                padding: 16,
                background: activeTab === item.key ? '#e6f7ff' : '#fff',
              }}
            >
              <h4>{item.label}</h4>
              {item.children}
            </div>
          </Col>
        ))}
      </Row>

      {/* Configuration Table */}
      <Card
        title="对话模型配置"
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={handleRefresh}>刷新</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>添加配置</Button>
          </Space>
        }
        style={{ marginBottom: 24 }}
        loading={loading}
      >
        <p style={{ color: '#666', marginBottom: 16 }}>管理对话服务的API密钥和配置</p>
        {configs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
            暂无配置，点击"添加配置"创建新的AI服务配置
          </div>
        ) : (
          <Table columns={columns} dataSource={configs} rowKey="id" />
        )}
      </Card>

      {/* Provider Cards */}
      <Card title="支持的对话服务提供商">
        <Row gutter={[16, 16]}>
          {aiProviders.map(provider => (
            <Col span={8} key={provider.id}>
              <Card size="small" hoverable>
                <h4 style={{ marginBottom: 8 }}>{provider.name}</h4>
                <p style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>{provider.description}</p>
                <div>
                  {provider.models.slice(0, 3).map(model => (
                    <Tag key={model} style={{ marginBottom: 4 }}>{model}</Tag>
                  ))}
                  {provider.models.length > 3 && (
                    <Tag>+{provider.models.length - 3}</Tag>
                  )}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={editingConfig ? '编辑配置' : '添加配置'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item label="配置名称" name="name" rules={[{ required: true }]}>
            <Input placeholder="例如：主力模型" />
          </Form.Item>
          <Form.Item label="服务商" name="provider" rules={[{ required: true }]}>
            <Select placeholder="选择AI服务商">
              {aiProviders.map(p => (
                <Select.Option key={p.id} value={p.id}>{p.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="模型" name="model" rules={[{ required: true }]}>
            <Input placeholder="例如：gpt-4o" />
          </Form.Item>
          <Form.Item label="API Key" name="apiKey" rules={[{ required: true }]}>
            <Input.Password placeholder="输入API密钥" />
          </Form.Item>
          <Form.Item label="Base URL" name="baseUrl">
            <Input placeholder="可选，自定义API地址" />
          </Form.Item>
          <Form.Item label="设为默认" name="isDefault" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
