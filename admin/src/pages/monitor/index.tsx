import { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Tag, Button, Table, Tabs } from 'antd'
import { ReloadOutlined, CheckCircleOutlined, UserOutlined, MessageOutlined, ApiOutlined, WarningOutlined } from '@ant-design/icons'

interface ServerStatus {
  status: 'running' | 'stopped' | 'error'
  uptime: string
  memory: string
  nodeVersion: string
  lastUpdated: string
}

interface ApiLog {
  id: number
  endpoint: string
  method: string
  status: number
  duration: number
  timestamp: string
}

interface ErrorLog {
  id: number
  message: string
  stack: string
  level: 'error' | 'warn' | 'info'
  timestamp: string
}

const mockServerStatus: ServerStatus = {
  status: 'running',
  uptime: '5分钟',
  memory: '53.5 MB',
  nodeVersion: 'v22.20.0',
  lastUpdated: '2026/2/3 19:58:35',
}

const mockApiLogs: ApiLog[] = []
const mockErrorLogs: ErrorLog[] = []

export default function SystemMonitor() {
  const [loading, setLoading] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [serverStatus, setServerStatus] = useState<ServerStatus>(mockServerStatus)

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined
    if (autoRefresh) {
      interval = setInterval(() => {
        handleRefresh()
      }, 10000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh])

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => {
      setServerStatus({
        ...mockServerStatus,
        lastUpdated: new Date().toLocaleString('zh-CN'),
      })
      setLoading(false)
    }, 500)
  }

  const apiLogColumns = [
    { title: '端点', dataIndex: 'endpoint', key: 'endpoint' },
    { title: '方法', dataIndex: 'method', key: 'method', render: (v: string) => <Tag>{v}</Tag> },
    { title: '状态', dataIndex: 'status', key: 'status', render: (v: number) => <Tag color={v < 400 ? 'success' : 'error'}>{v}</Tag> },
    { title: '耗时', dataIndex: 'duration', key: 'duration', render: (v: number) => `${v}ms` },
    { title: '时间', dataIndex: 'timestamp', key: 'timestamp' },
  ]

  const errorLogColumns = [
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => {
        const colors = { error: 'red', warn: 'orange', info: 'blue' }
        return <Tag color={colors[level as keyof typeof colors]}>{level.toUpperCase()}</Tag>
      },
    },
    { title: '消息', dataIndex: 'message', key: 'message', ellipsis: true },
    { title: '时间', dataIndex: 'timestamp', key: 'timestamp', width: 180 },
  ]

  const tabItems = [
    {
      key: 'overview',
      label: '系统概览',
      children: (
        <>
          {/* Server Status */}
          <Card style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ margin: 0 }}>服务器状态</h4>
              <p style={{ color: '#999', fontSize: 12, margin: '4px 0 0' }}>最后更新:{serverStatus.lastUpdated}</p>
            </div>
            <Row gutter={16}>
              <Col span={6}>
                <Card size="small" style={{ background: '#f6ffed' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                    <span>运行状态</span>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 'bold', color: '#52c41a', marginTop: 8 }}>
                    正常运行
                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small" style={{ background: '#e6f7ff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>运行时间</span>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 'bold', color: '#1890ff', marginTop: 8 }}>
                    {serverStatus.uptime}
                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small" style={{ background: '#fff7e6' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>内存使用</span>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 'bold', color: '#faad14', marginTop: 8 }}>
                    {serverStatus.memory}
                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small" style={{ background: '#fff1f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>Node版本</span>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 'bold', color: '#ff4d4f', marginTop: 8 }}>
                    {serverStatus.nodeVersion}
                  </div>
                </Card>
              </Col>
            </Row>
          </Card>

          {/* Quick Stats */}
          <Row gutter={16}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="总用户数"
                  value={24}
                  prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="总会话数"
                  value={19}
                  prefix={<MessageOutlined style={{ color: '#52c41a' }} />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="总消息数"
                  value={25}
                  prefix={<MessageOutlined style={{ color: '#faad14' }} />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="今日活跃用户"
                  value={0}
                  prefix={<UserOutlined style={{ color: '#eb2f96' }} />}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="今日API调用"
                  value={0}
                  prefix={<ApiOutlined style={{ color: '#13c2c2' }} />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="今日错误数"
                  value={0}
                  prefix={<WarningOutlined style={{ color: '#ff4d4f' }} />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="错误率"
                  value={0}
                  suffix="%"
                  prefix={<WarningOutlined style={{ color: '#faad14' }} />}
                />
              </Card>
            </Col>
          </Row>
        </>
      ),
    },
    {
      key: 'api',
      label: 'API监控',
      children: (
        <Card title="API调用日志" loading={loading}>
          {mockApiLogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>暂无API调用记录</div>
          ) : (
            <Table columns={apiLogColumns} dataSource={mockApiLogs} rowKey="id" pagination={{ pageSize: 20 }} />
          )}
        </Card>
      ),
    },
    {
      key: 'errors',
      label: '错误日志',
      children: (
        <Card title="错误日志" loading={loading}>
          {mockErrorLogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>暂无错误日志</div>
          ) : (
            <Table columns={errorLogColumns} dataSource={mockErrorLogs} rowKey="id" pagination={{ pageSize: 20 }} />
          )}
        </Card>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>系统监控</h2>
        <div>
          <Button
            style={{ marginRight: 8 }}
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? '停止自动刷新' : '自动刷新'}
          </Button>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh}>刷新</Button>
        </div>
      </div>

      <Tabs items={tabItems} />
    </div>
  )
}
