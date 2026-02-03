import { useState } from 'react'
import { Table, Card, Input, Button, Space, Tag, Modal, Form, message, Avatar, Row, Col, Statistic, InputNumber, Tooltip } from 'antd'
import { SearchOutlined, ReloadOutlined, EyeOutlined, SettingOutlined, UserOutlined, CrownOutlined, StopFilled } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

interface User {
  id: number
  nickname: string
  email: string
  avatar: string
  vipLevel: number
  todayUsed: number
  dailyLimit: number
  coins: number
  status: 'active' | 'banned'
  createdAt: string
}

// Mock data
const mockUsers: User[] = [
  { id: 690001, nickname: 'j wallas', email: 'wallasj2019@gmail.com', avatar: '', vipLevel: 2, todayUsed: 0, dailyLimit: -1, coins: 5000, status: 'active', createdAt: '2026-01-15' },
  { id: 660002, nickname: 'agfstack', email: 'agfstack@gmail.com', avatar: '', vipLevel: 1, todayUsed: 0, dailyLimit: -1, coins: 5000, status: 'active', createdAt: '2026-01-20' },
  { id: 450073, nickname: 'Test User', email: 'test@example.com', avatar: '', vipLevel: 1, todayUsed: 0, dailyLimit: -1, coins: 5000, status: 'active', createdAt: '2026-01-25' },
  { id: 450067, nickname: 'Test User', email: 'test@example.com', avatar: '', vipLevel: 1, todayUsed: 0, dailyLimit: -1, coins: 5000, status: 'active', createdAt: '2026-02-01' },
  { id: 450046, nickname: 'Test User', email: 'test@example.com', avatar: '', vipLevel: 1, todayUsed: 0, dailyLimit: -1, coins: 5000, status: 'active', createdAt: '2026-02-02' },
  { id: 330785, nickname: 'Test User', email: 'test@example.com', avatar: '', vipLevel: 1, todayUsed: 0, dailyLimit: -1, coins: 5000, status: 'active', createdAt: '2026-02-02' },
  { id: 330769, nickname: 'Test User', email: 'test@example.com', avatar: '', vipLevel: 1, todayUsed: 0, dailyLimit: -1, coins: 5000, status: 'active', createdAt: '2026-02-02' },
  { id: 330703, nickname: 'Test User', email: 'test@example.com', avatar: '', vipLevel: 1, todayUsed: 0, dailyLimit: -1, coins: 5000, status: 'active', createdAt: '2026-02-02' },
  { id: 330640, nickname: 'Test User', email: 'test@example.com', avatar: '', vipLevel: 1, todayUsed: 0, dailyLimit: -1, coins: 5000, status: 'active', createdAt: '2026-02-02' },
  { id: 330624, nickname: 'Test User', email: 'test@example.com', avatar: '', vipLevel: 1, todayUsed: 0, dailyLimit: -1, coins: 5000, status: 'active', createdAt: '2026-02-02' },
  { id: 330616, nickname: '测试用户5', email: 'abcd5@qq.com', avatar: '', vipLevel: 1, todayUsed: 0, dailyLimit: -1, coins: 5000, status: 'active', createdAt: '2026-02-02' },
  { id: 330615, nickname: '测试用户4', email: 'abcd4@qq.com', avatar: '', vipLevel: 1, todayUsed: 0, dailyLimit: -1, coins: 5000, status: 'active', createdAt: '2026-02-02' },
]

export default function UserList() {
  const [users] = useState<User[]>(mockUsers)
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [quotaModalVisible, setQuotaModalVisible] = useState(false)
  const [, setCurrentUser] = useState<User | null>(null)
  const [form] = Form.useForm()

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 500)
  }

  const handleViewDetail = (user: User) => {
    Modal.info({
      title: '用户详情',
      width: 600,
      content: (
        <div style={{ marginTop: 16 }}>
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>昵称:</strong> {user.nickname}</p>
          <p><strong>邮箱:</strong> {user.email}</p>
          <p><strong>VIP等级:</strong> VIP{user.vipLevel}</p>
          <p><strong>金币:</strong> {user.coins}</p>
          <p><strong>今日已用/限制:</strong> {user.todayUsed} / {user.dailyLimit === -1 ? '无限' : user.dailyLimit}</p>
          <p><strong>状态:</strong> {user.status === 'active' ? '正常' : '已封禁'}</p>
          <p><strong>注册时间:</strong> {user.createdAt}</p>
        </div>
      ),
    })
  }

  const handleQuota = (user: User) => {
    setCurrentUser(user)
    form.setFieldsValue({ dailyLimit: user.dailyLimit })
    setQuotaModalVisible(true)
  }

  const handleSaveQuota = async () => {
    try {
      await form.validateFields()
      message.success('配额设置成功')
      setQuotaModalVisible(false)
    } catch (error) {
      // Validation failed
    }
  }

  const handleCancelVip = (user: User) => {
    Modal.confirm({
      title: '确认取消VIP？',
      content: `用户: ${user.nickname}`,
      onOk: () => {
        message.success('VIP已取消')
      },
    })
  }

  const handleBan = (user: User) => {
    Modal.confirm({
      title: user.status === 'active' ? '确认封禁用户？' : '确认解封用户？',
      content: `用户: ${user.nickname}`,
      onOk: () => {
        message.success(user.status === 'active' ? '用户已封禁' : '用户已解封')
      },
    })
  }

  const columns: ColumnsType<User> = [
    {
      title: '用户',
      key: 'user',
      width: 200,
      render: (_, record) => (
        <Space>
          <Avatar src={record.avatar} style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 500 }}>{record.nickname}</div>
            <div style={{ fontSize: 12, color: '#999' }}>ID: {record.id}</div>
          </div>
        </Space>
      ),
    },
    { title: '邮箱', dataIndex: 'email', key: 'email', width: 200 },
    {
      title: 'VIP等级',
      dataIndex: 'vipLevel',
      key: 'vipLevel',
      width: 100,
      render: (level: number) => {
        const colors = ['#52c41a', '#1890ff', '#722ed1', '#eb2f96']
        return (
          <Tag color={colors[level] || colors[0]} style={{ borderRadius: 12 }}>
            VIP{level}
          </Tag>
        )
      },
    },
    {
      title: '今日/限制',
      key: 'quota',
      width: 100,
      render: (_, record) => (
        <span style={{ color: record.dailyLimit === -1 ? '#52c41a' : '#1890ff' }}>
          {record.todayUsed} / {record.dailyLimit === -1 ? '-1' : record.dailyLimit}
        </span>
      ),
    },
    {
      title: '金币',
      dataIndex: 'coins',
      key: 'coins',
      width: 100,
      render: (v: number) => (
        <span style={{ color: '#faad14' }}>💰 {v.toLocaleString()}</span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'error'}>
          {status === 'active' ? '正常' : '已封禁'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button type="text" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)} />
          </Tooltip>
          <Tooltip title="设置配额">
            <Button type="text" icon={<SettingOutlined />} onClick={() => handleQuota(record)} />
          </Tooltip>
          <Button type="link" size="small" onClick={() => handleQuota(record)}>配额</Button>
          <Button type="link" size="small" onClick={() => handleCancelVip(record)}>取消VIP</Button>
          <Button
            type="link"
            size="small"
            danger={record.status === 'active'}
            onClick={() => handleBan(record)}
          >
            {record.status === 'active' ? '封禁' : '解封'}
          </Button>
        </Space>
      ),
    },
  ]

  const filteredUsers = users.filter(
    (user) =>
      user.nickname.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase()) ||
      user.id.toString().includes(searchText)
  )

  const totalUsers = users.length
  const vipUsers = users.filter(u => u.vipLevel > 0).length
  const bannedUsers = users.filter(u => u.status === 'banned').length
  const todayActive = 0 // Mock

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ marginBottom: 8 }}>用户管理</h2>
        <p style={{ color: '#666', margin: 0 }}>管理用户配额、VIP等级和封禁状态</p>
      </div>

      {/* Stats Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={totalUsers}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="VIP用户"
              value={vipUsers}
              prefix={<CrownOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已封禁"
              value={bannedUsers}
              prefix={<StopFilled style={{ color: '#ff4d4f' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日活跃"
              value={todayActive}
              prefix={<UserOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* User List */}
      <Card title="用户列表">
        <Space style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Input
            placeholder="搜索邮箱或用户名..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
          <Button icon={<ReloadOutlined />} onClick={handleRefresh}>刷新</Button>
        </Space>

        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条`,
            showSizeChanger: true,
            showQuickJumper: true
          }}
          size="middle"
        />
      </Card>

      {/* Quota Modal */}
      <Modal
        title="配额设置"
        open={quotaModalVisible}
        onOk={handleSaveQuota}
        onCancel={() => setQuotaModalVisible(false)}
        width={400}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            label="每日消息限制"
            name="dailyLimit"
            extra="设置为 -1 表示无限制"
          >
            <InputNumber style={{ width: '100%' }} min={-1} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
