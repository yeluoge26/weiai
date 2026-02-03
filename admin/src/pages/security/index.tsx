import { useState } from 'react'
import { Card, Tabs, Table, Button, Modal, Form, Input, InputNumber, Switch, message, Tag, Space, Empty } from 'antd'
import { ReloadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'

interface LoginLog {
  id: number
  userId: number
  username: string
  ip: string
  userAgent: string
  status: 'success' | 'failed'
  timestamp: string
}

interface IPBlacklist {
  id: number
  ip: string
  reason: string
  createdAt: string
}

const mockLoginLogs: LoginLog[] = []
const mockIPBlacklist: IPBlacklist[] = []

export default function SecuritySettings() {
  const [loading, setLoading] = useState(false)
  const [ipModalVisible, setIpModalVisible] = useState(false)
  const [ipBlacklist, setIpBlacklist] = useState<IPBlacklist[]>(mockIPBlacklist)
  const [ipForm] = Form.useForm()

  // Password policy settings
  const [passwordPolicy] = useState({
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecial: false,
    maxAttempts: 5,
    lockoutDuration: 30,
    sessionTimeout: 1440,
  })

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 500)
  }

  const handleAddIP = () => {
    ipForm.resetFields()
    setIpModalVisible(true)
  }

  const handleSaveIP = async () => {
    try {
      const values = await ipForm.validateFields()
      setIpBlacklist([...ipBlacklist, { id: Date.now(), ...values, createdAt: new Date().toISOString() }])
      message.success('IP已添加到黑名单')
      setIpModalVisible(false)
    } catch (error) {
      // Validation failed
    }
  }

  const handleRemoveIP = (ip: IPBlacklist) => {
    Modal.confirm({
      title: '确认移除',
      content: `确定要将 ${ip.ip} 从黑名单中移除吗？`,
      onOk: () => {
        setIpBlacklist(ipBlacklist.filter(i => i.id !== ip.id))
        message.success('已从黑名单移除')
      },
    })
  }

  const handleSavePasswordPolicy = () => {
    message.success('密码策略已保存')
  }

  const loginLogColumns = [
    { title: '用户ID', dataIndex: 'userId', key: 'userId', width: 100 },
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: 'IP地址', dataIndex: 'ip', key: 'ip' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'success' ? 'success' : 'error'}>
          {status === 'success' ? '成功' : '失败'}
        </Tag>
      ),
    },
    { title: '时间', dataIndex: 'timestamp', key: 'timestamp' },
  ]

  const ipBlacklistColumns = [
    { title: 'IP地址', dataIndex: 'ip', key: 'ip' },
    { title: '原因', dataIndex: 'reason', key: 'reason' },
    { title: '添加时间', dataIndex: 'createdAt', key: 'createdAt' },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: IPBlacklist) => (
        <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleRemoveIP(record)}>
          移除
        </Button>
      ),
    },
  ]

  const tabItems = [
    {
      key: 'loginLogs',
      label: '登录日志',
      children: (
        <Card
          title="登录日志"
          extra={<Button icon={<ReloadOutlined />} onClick={handleRefresh}>刷新</Button>}
          loading={loading}
        >
          <p style={{ color: '#666', marginBottom: 16 }}>查看用户登录历史记录</p>
          {mockLoginLogs.length === 0 ? (
            <Empty description="暂无登录记录" />
          ) : (
            <Table columns={loginLogColumns} dataSource={mockLoginLogs} rowKey="id" />
          )}
        </Card>
      ),
    },
    {
      key: 'ipBlacklist',
      label: 'IP黑名单',
      children: (
        <Card
          title="IP黑名单"
          extra={
            <Space>
              <Button icon={<ReloadOutlined />} onClick={handleRefresh}>刷新</Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddIP}>添加IP</Button>
            </Space>
          }
          loading={loading}
        >
          <p style={{ color: '#666', marginBottom: 16 }}>管理被封禁的IP地址</p>
          {ipBlacklist.length === 0 ? (
            <Empty description="黑名单为空" />
          ) : (
            <Table columns={ipBlacklistColumns} dataSource={ipBlacklist} rowKey="id" />
          )}
        </Card>
      ),
    },
    {
      key: 'passwordPolicy',
      label: '密码策略',
      children: (
        <Card title="密码策略配置" loading={loading}>
          <p style={{ color: '#666', marginBottom: 24 }}>设置用户密码的安全要求</p>
          <Form
            layout="horizontal"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={passwordPolicy}
            onFinish={handleSavePasswordPolicy}
          >
            <Form.Item label="密码最小长度" name="minLength" extra="password_min_length">
              <InputNumber min={6} max={32} style={{ width: 200 }} />
            </Form.Item>
            <Form.Item label="密码是否需要大写字母" name="requireUppercase" valuePropName="checked" extra="password_require_uppercase">
              <Switch />
            </Form.Item>
            <Form.Item label="密码是否需要小写字母" name="requireLowercase" valuePropName="checked" extra="password_require_lowercase">
              <Switch />
            </Form.Item>
            <Form.Item label="密码是否需要数字" name="requireNumber" valuePropName="checked" extra="password_require_number">
              <Switch />
            </Form.Item>
            <Form.Item label="密码是否需要特殊字符" name="requireSpecial" valuePropName="checked" extra="password_require_special">
              <Switch />
            </Form.Item>
            <Form.Item label="登录最大尝试次数" name="maxAttempts" extra="login_max_attempts">
              <InputNumber min={1} max={20} style={{ width: 200 }} />
            </Form.Item>
            <Form.Item label="登录锁定时长(分钟)" name="lockoutDuration" extra="login_lockout_duration">
              <InputNumber min={1} max={1440} style={{ width: 200 }} />
            </Form.Item>
            <Form.Item label="会话超时时间(分钟)" name="sessionTimeout" extra="session_timeout">
              <InputNumber min={1} max={10080} style={{ width: 200 }} />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8 }}>
              <Button type="primary" htmlType="submit">保存设置</Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>安全设置</h2>
      </div>

      <Tabs items={tabItems} />

      {/* Add IP Modal */}
      <Modal
        title="添加IP到黑名单"
        open={ipModalVisible}
        onOk={handleSaveIP}
        onCancel={() => setIpModalVisible(false)}
      >
        <Form form={ipForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item label="IP地址" name="ip" rules={[{ required: true, message: '请输入IP地址' }]}>
            <Input placeholder="例如：192.168.1.1" />
          </Form.Item>
          <Form.Item label="封禁原因" name="reason" rules={[{ required: true, message: '请输入封禁原因' }]}>
            <Input.TextArea placeholder="请输入封禁原因" rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
