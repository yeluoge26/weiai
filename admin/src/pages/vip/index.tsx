import { useState } from 'react'
import { Card, Row, Col, Table, Button, Modal, Form, InputNumber, Switch, message } from 'antd'
import { ReloadOutlined, UserOutlined, CrownOutlined, StarOutlined, RocketOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'

interface VipLevel {
  level: number
  name: string
  icon: React.ReactNode
  color: string
  dailyMessages: number | string
  ttsVoice: boolean
  advancedCharacters: boolean
  sendGifts: boolean
  dedicatedSupport: boolean
}

const vipLevels: VipLevel[] = [
  {
    level: 0,
    name: '普通用户',
    icon: <UserOutlined />,
    color: '#8c8c8c',
    dailyMessages: 20,
    ttsVoice: false,
    advancedCharacters: false,
    sendGifts: false,
    dedicatedSupport: false,
  },
  {
    level: 1,
    name: 'VIP会员',
    icon: <CrownOutlined />,
    color: '#faad14',
    dailyMessages: 100,
    ttsVoice: true,
    advancedCharacters: true,
    sendGifts: true,
    dedicatedSupport: false,
  },
  {
    level: 2,
    name: 'SVIP会员',
    icon: <StarOutlined />,
    color: '#722ed1',
    dailyMessages: 500,
    ttsVoice: true,
    advancedCharacters: true,
    sendGifts: true,
    dedicatedSupport: true,
  },
  {
    level: 3,
    name: 'SSVIP会员',
    icon: <RocketOutlined />,
    color: '#eb2f96',
    dailyMessages: '无限',
    ttsVoice: true,
    advancedCharacters: true,
    sendGifts: true,
    dedicatedSupport: true,
  },
]

const benefitComparisonData = [
  { key: 'dailyMessages', benefit: '每日消息', normal: '20条', vip1: '100条', vip2: '500条', vip3: '无限' },
  { key: 'ttsVoice', benefit: 'TTS语音', normal: false, vip1: true, vip2: true, vip3: true },
  { key: 'rpgCharacters', benefit: 'RPG角色', normal: true, vip1: true, vip2: true, vip3: true },
  { key: 'sendGifts', benefit: '送礼物', normal: true, vip1: true, vip2: true, vip3: true },
  { key: 'dedicatedSupport', benefit: '专属客服', normal: false, vip1: false, vip2: true, vip3: true },
]

export default function VipManagement() {
  const [loading, setLoading] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [currentLevel, setCurrentLevel] = useState<VipLevel | null>(null)
  const [form] = Form.useForm()

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 500)
  }

  const handleEdit = (level: VipLevel) => {
    setCurrentLevel(level)
    form.setFieldsValue({
      dailyMessages: typeof level.dailyMessages === 'number' ? level.dailyMessages : -1,
      ttsVoice: level.ttsVoice,
      advancedCharacters: level.advancedCharacters,
      sendGifts: level.sendGifts,
      dedicatedSupport: level.dedicatedSupport,
    })
    setEditModalVisible(true)
  }

  const handleSave = async () => {
    try {
      await form.validateFields()
      message.success('保存成功')
      setEditModalVisible(false)
    } catch (error) {
      // Validation failed
    }
  }

  const comparisonColumns = [
    { title: '权益', dataIndex: 'benefit', key: 'benefit', width: 150 },
    {
      title: '普通用户',
      dataIndex: 'normal',
      key: 'normal',
      render: (value: boolean | string) => renderBenefitValue(value),
    },
    {
      title: 'VIP1',
      dataIndex: 'vip1',
      key: 'vip1',
      render: (value: boolean | string) => renderBenefitValue(value),
    },
    {
      title: 'VIP2',
      dataIndex: 'vip2',
      key: 'vip2',
      render: (value: boolean | string) => renderBenefitValue(value),
    },
    {
      title: 'VIP3',
      dataIndex: 'vip3',
      key: 'vip3',
      render: (value: boolean | string) => renderBenefitValue(value),
    },
  ]

  const renderBenefitValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 18 }} />
      ) : (
        <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 18 }} />
      )
    }
    return <span style={{ fontWeight: 500 }}>{value}</span>
  }

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ marginBottom: 8 }}>VIP权益管理</h2>
          <p style={{ color: '#666', margin: 0 }}>配置VIP等级和权益</p>
        </div>
        <Button icon={<ReloadOutlined />} onClick={handleRefresh}>刷新</Button>
      </div>

      {/* VIP Level Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {vipLevels.map((level) => (
          <Col span={6} key={level.level}>
            <Card
              hoverable
              style={{ borderTop: `3px solid ${level.color}` }}
              onClick={() => handleEdit(level)}
            >
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 32, color: level.color, marginBottom: 8 }}>
                  {level.icon}
                </div>
                <h3 style={{ margin: 0, color: level.color }}>{level.name}</h3>
                <p style={{ color: '#999', fontSize: 12, margin: '4px 0 0' }}>
                  VIP {level.level} 级会员
                </p>
              </div>
              <div style={{ fontSize: 13 }}>
                <div style={{ marginBottom: 8 }}>
                  <span style={{ color: '#666' }}>每日消息</span>
                </div>
                <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#666' }}>TTS语音</span>
                  {level.ttsVoice ? (
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  ) : (
                    <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                  )}
                </div>
                <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#666' }}>高级角色</span>
                  {level.advancedCharacters ? (
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  ) : (
                    <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#666' }}>专属客服</span>
                  {level.dedicatedSupport ? (
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  ) : (
                    <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                  )}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Benefit Comparison Table */}
      <Card title="权益对比" loading={loading}>
        <Table
          columns={comparisonColumns}
          dataSource={benefitComparisonData}
          pagination={false}
          bordered
          size="middle"
        />
      </Card>

      {/* Edit Modal */}
      <Modal
        title={`编辑 ${currentLevel?.name} 权益`}
        open={editModalVisible}
        onOk={handleSave}
        onCancel={() => setEditModalVisible(false)}
        width={500}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item label="每日消息数" name="dailyMessages" extra="-1 表示无限">
            <InputNumber style={{ width: '100%' }} min={-1} />
          </Form.Item>
          <Form.Item label="TTS语音" name="ttsVoice" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="高级角色" name="advancedCharacters" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="送礼物" name="sendGifts" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="专属客服" name="dedicatedSupport" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
