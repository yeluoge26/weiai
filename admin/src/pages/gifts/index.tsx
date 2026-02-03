import { useState } from 'react'
import { Table, Card, Input, Button, Space, Tag, Modal, Form, InputNumber, message, Row, Col, Statistic, Select, Tabs } from 'antd'
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, GiftOutlined, DollarOutlined, HeartOutlined, FireOutlined, ExportOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

interface Gift {
  id: number
  name: string
  icon: string
  category: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  price: number
  affinityPoints: number
  sendCount: number
  totalRevenue: number
  vipRequired: number
  status: 'active' | 'inactive'
  createdAt: string
}

const mockGifts: Gift[] = [
  { id: 1, name: '咖啡', icon: '☕', category: '日常', rarity: 'common', price: 10, affinityPoints: 1, sendCount: 15680, totalRevenue: 156800, vipRequired: 0, status: 'active', createdAt: '2026-01-01' },
  { id: 2, name: '玫瑰', icon: '🌹', category: '浪漫', rarity: 'common', price: 50, affinityPoints: 5, sendCount: 8920, totalRevenue: 446000, vipRequired: 0, status: 'active', createdAt: '2026-01-02' },
  { id: 3, name: '巧克力', icon: '🍫', category: '甜蜜', rarity: 'common', price: 30, affinityPoints: 3, sendCount: 6750, totalRevenue: 202500, vipRequired: 0, status: 'active', createdAt: '2026-01-03' },
  { id: 4, name: '钻石', icon: '💎', category: '奢华', rarity: 'rare', price: 200, affinityPoints: 20, sendCount: 3560, totalRevenue: 712000, vipRequired: 1, status: 'active', createdAt: '2026-01-04' },
  { id: 5, name: '钻戒', icon: '💍', category: '珍贵', rarity: 'epic', price: 500, affinityPoints: 50, sendCount: 1280, totalRevenue: 640000, vipRequired: 1, status: 'active', createdAt: '2026-01-05' },
  { id: 6, name: '皇冠', icon: '👑', category: '珍贵', rarity: 'epic', price: 1000, affinityPoints: 100, sendCount: 560, totalRevenue: 560000, vipRequired: 2, status: 'active', createdAt: '2026-01-06' },
  { id: 7, name: '城堡', icon: '🏰', category: '传奇', rarity: 'legendary', price: 5000, affinityPoints: 500, sendCount: 89, totalRevenue: 445000, vipRequired: 2, status: 'active', createdAt: '2026-01-07' },
  { id: 8, name: '火箭', icon: '🚀', category: '传奇', rarity: 'legendary', price: 8888, affinityPoints: 888, sendCount: 32, totalRevenue: 284416, vipRequired: 3, status: 'active', createdAt: '2026-01-08' },
  { id: 9, name: '爱心气球', icon: '🎈', category: '浪漫', rarity: 'common', price: 20, affinityPoints: 2, sendCount: 4520, totalRevenue: 90400, vipRequired: 0, status: 'active', createdAt: '2026-01-09' },
  { id: 10, name: '星星', icon: '⭐', category: '奇幻', rarity: 'rare', price: 150, affinityPoints: 15, sendCount: 2180, totalRevenue: 327000, vipRequired: 1, status: 'inactive', createdAt: '2026-01-10' },
]

const categoryOptions = [
  { value: '日常', label: '日常' },
  { value: '浪漫', label: '浪漫' },
  { value: '甜蜜', label: '甜蜜' },
  { value: '奢华', label: '奢华' },
  { value: '珍贵', label: '珍贵' },
  { value: '传奇', label: '传奇' },
  { value: '奇幻', label: '奇幻' },
]

const rarityConfig: Record<string, { color: string; text: string; bgColor: string }> = {
  common: { color: '#8c8c8c', text: '普通', bgColor: '#f5f5f5' },
  rare: { color: '#1890ff', text: '稀有', bgColor: '#e6f7ff' },
  epic: { color: '#722ed1', text: '史诗', bgColor: '#f9f0ff' },
  legendary: { color: '#faad14', text: '传说', bgColor: '#fffbe6' },
}

const categoryColors: Record<string, string> = {
  日常: 'default',
  浪漫: 'pink',
  甜蜜: 'orange',
  奢华: 'purple',
  珍贵: 'gold',
  传奇: 'red',
  奇幻: 'cyan',
}

export default function GiftList() {
  const [gifts] = useState<Gift[]>(mockGifts)
  const [loading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>()
  const [rarityFilter, setRarityFilter] = useState<string | undefined>()
  const [modalVisible, setModalVisible] = useState(false)
  const [currentGift, setCurrentGift] = useState<Gift | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [form] = Form.useForm()

  const handleAdd = () => {
    setCurrentGift(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (record: Gift) => {
    setCurrentGift(record)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  const handleDelete = (record: Gift) => {
    Modal.confirm({
      title: '确认删除礼物？',
      content: `礼物: ${record.name}`,
      onOk: () => message.success('删除成功'),
    })
  }

  const handleBatchDelete = () => {
    Modal.confirm({
      title: `确认删除选中的 ${selectedRowKeys.length} 个礼物？`,
      onOk: () => {
        message.success('批量删除成功')
        setSelectedRowKeys([])
      },
    })
  }

  const handleSave = async () => {
    try {
      await form.validateFields()
      message.success(currentGift ? '保存成功' : '创建成功')
      setModalVisible(false)
    } catch (error) {
      // Validation failed
    }
  }

  const columns: ColumnsType<Gift> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    {
      title: '礼物',
      key: 'gift',
      width: 180,
      render: (_, record) => (
        <Space>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 8,
              background: rarityConfig[record.rarity].bgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              border: `2px solid ${rarityConfig[record.rarity].color}`,
            }}
          >
            {record.icon}
          </div>
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <Tag color={rarityConfig[record.rarity].color} style={{ marginTop: 4 }}>
              {rarityConfig[record.rarity].text}
            </Tag>
          </div>
        </Space>
      ),
    },
    {
      title: '类别',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (category: string) => <Tag color={categoryColors[category]}>{category}</Tag>,
      filters: categoryOptions.map(o => ({ text: o.label, value: o.value })),
      onFilter: (value, record) => record.category === value,
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: (price: number) => (
        <span style={{ color: '#faad14', fontWeight: 500 }}>
          {price.toLocaleString()} 金币
        </span>
      ),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: '好感度',
      dataIndex: 'affinityPoints',
      key: 'affinityPoints',
      width: 80,
      render: (points: number) => (
        <span style={{ color: '#eb2f96' }}>+{points}</span>
      ),
    },
    {
      title: 'VIP等级要求',
      dataIndex: 'vipRequired',
      key: 'vipRequired',
      width: 110,
      render: (level: number) => level === 0 ? <Tag>无限制</Tag> : <Tag color="gold">VIP{level}+</Tag>,
    },
    {
      title: '赠送次数',
      dataIndex: 'sendCount',
      key: 'sendCount',
      width: 100,
      render: (v: number) => v.toLocaleString(),
      sorter: (a, b) => a.sendCount - b.sendCount,
    },
    {
      title: '总收入',
      dataIndex: 'totalRevenue',
      key: 'totalRevenue',
      width: 120,
      render: (v: number) => (
        <span style={{ color: '#52c41a', fontWeight: 500 }}>
          ¥{(v / 100).toLocaleString()}
        </span>
      ),
      sorter: (a, b) => a.totalRevenue - b.totalRevenue,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>
          {status === 'active' ? '已上架' : '已下架'}
        </Tag>
      ),
      filters: [
        { text: '已上架', value: 'active' },
        { text: '已下架', value: 'inactive' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ]

  const filteredGifts = gifts.filter((g) => {
    const matchSearch = g.name.includes(searchText)
    const matchCategory = !categoryFilter || g.category === categoryFilter
    const matchRarity = !rarityFilter || g.rarity === rarityFilter
    return matchSearch && matchCategory && matchRarity
  })

  const stats = {
    total: gifts.length,
    active: gifts.filter(g => g.status === 'active').length,
    totalSends: gifts.reduce((sum, g) => sum + g.sendCount, 0),
    totalRevenue: gifts.reduce((sum, g) => sum + g.totalRevenue, 0),
    legendary: gifts.filter(g => g.rarity === 'legendary').length,
  }

  const tabItems = [
    {
      key: 'all',
      label: `全部 (${gifts.length})`,
    },
    {
      key: 'common',
      label: `普通 (${gifts.filter(g => g.rarity === 'common').length})`,
    },
    {
      key: 'rare',
      label: `稀有 (${gifts.filter(g => g.rarity === 'rare').length})`,
    },
    {
      key: 'epic',
      label: `史诗 (${gifts.filter(g => g.rarity === 'epic').length})`,
    },
    {
      key: 'legendary',
      label: `传说 (${gifts.filter(g => g.rarity === 'legendary').length})`,
    },
  ]

  return (
    <div>
      {/* Stats Cards */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="礼物总数"
              value={stats.total}
              prefix={<GiftOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总赠送次数"
              value={stats.totalSends}
              prefix={<HeartOutlined style={{ color: '#eb2f96' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总收入"
              value={stats.totalRevenue / 100}
              prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
              suffix="元"
              precision={2}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="传说级礼物"
              value={stats.legendary}
              prefix={<FireOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Table Card */}
      <Card>
        <Tabs
          items={tabItems}
          onChange={(key) => setRarityFilter(key === 'all' ? undefined : key)}
          style={{ marginBottom: 16 }}
        />

        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            placeholder="搜索礼物名称"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
            allowClear
          />
          <Select
            placeholder="类别筛选"
            allowClear
            style={{ width: 120 }}
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={categoryOptions}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加礼物
          </Button>
          <Button icon={<ExportOutlined />}>导出</Button>
          {selectedRowKeys.length > 0 && (
            <Button danger onClick={handleBatchDelete}>
              批量删除 ({selectedRowKeys.length})
            </Button>
          )}
        </Space>

        <Table
          columns={columns}
          dataSource={filteredGifts}
          rowKey="id"
          loading={loading}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 条`, showSizeChanger: true }}
          scroll={{ x: 1100 }}
        />
      </Card>

      {/* Edit/Add Modal */}
      <Modal
        title={currentGift ? '编辑礼物' : '添加礼物'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="礼物名称" name="name" rules={[{ required: true }]}>
                <Input placeholder="请输入礼物名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="图标（emoji）" name="icon" rules={[{ required: true }]}>
                <Input maxLength={4} placeholder="请输入emoji" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="类别" name="category" rules={[{ required: true }]}>
                <Select options={categoryOptions} placeholder="请选择类别" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="稀有度" name="rarity" rules={[{ required: true }]}>
                <Select placeholder="请选择稀有度">
                  <Select.Option value="common">
                    <Tag color={rarityConfig.common.color}>普通</Tag>
                  </Select.Option>
                  <Select.Option value="rare">
                    <Tag color={rarityConfig.rare.color}>稀有</Tag>
                  </Select.Option>
                  <Select.Option value="epic">
                    <Tag color={rarityConfig.epic.color}>史诗</Tag>
                  </Select.Option>
                  <Select.Option value="legendary">
                    <Tag color={rarityConfig.legendary.color}>传说</Tag>
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="价格（金币）" name="price" rules={[{ required: true }]}>
                <InputNumber min={1} style={{ width: '100%' }} placeholder="请输入价格" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="好感度增加" name="affinityPoints" rules={[{ required: true }]}>
                <InputNumber min={1} style={{ width: '100%' }} placeholder="请输入好感度" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="VIP等级要求" name="vipRequired" initialValue={0}>
                <Select placeholder="请选择VIP等级要求">
                  <Select.Option value={0}>无限制</Select.Option>
                  <Select.Option value={1}>VIP1+</Select.Option>
                  <Select.Option value={2}>VIP2+</Select.Option>
                  <Select.Option value={3}>VIP3+</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="状态" name="status" initialValue="active">
                <Select>
                  <Select.Option value="active">上架</Select.Option>
                  <Select.Option value="inactive">下架</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="礼物描述" name="description">
            <Input.TextArea rows={3} placeholder="请输入礼物描述（可选）" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
