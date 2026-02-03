import { useState } from 'react'
import { Card, Row, Col, Statistic, Table, DatePicker, Tabs, Button } from 'antd'
import { UserOutlined, MessageOutlined, RobotOutlined, CommentOutlined, ArrowDownOutlined, ReloadOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

interface DailyData {
  date: string
  dau: number
  messages: number
  newUsers: number
  newSessions: number
  revenue: number
}

const mockDailyData: DailyData[] = [
  { date: '2026-01-27', dau: 0, messages: 0, newUsers: 0, newSessions: 0, revenue: 0 },
  { date: '2026-01-30', dau: 0, messages: 0, newUsers: 0, newSessions: 0, revenue: 0 },
  { date: '2026-01-31', dau: 0, messages: 0, newUsers: 0, newSessions: 0, revenue: 0 },
  { date: '2026-02-03', dau: 0, messages: 0, newUsers: 0, newSessions: 0, revenue: 0 },
]

export default function Analytics() {
  const [loading, setLoading] = useState(false)
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(7, 'day'),
    dayjs()
  ])

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 500)
  }

  // Mock stats
  const stats = {
    totalUsers: 24,
    totalMessages: 25,
    totalCharacters: 42,
    totalSessions: 19,
    todayActiveUsers: 0,
    todayMessages: 0,
    todayNewUsers: 0,
  }

  const columns = [
    { title: '日期', dataIndex: 'date', key: 'date', width: 120 },
    { title: 'DAU', dataIndex: 'dau', key: 'dau', width: 100 },
    { title: '消息数', dataIndex: 'messages', key: 'messages', width: 100 },
    { title: '新用户', dataIndex: 'newUsers', key: 'newUsers', width: 100 },
    { title: '新会话', dataIndex: 'newSessions', key: 'newSessions', width: 100 },
    {
      title: '充值金额',
      dataIndex: 'revenue',
      key: 'revenue',
      width: 120,
      render: (v: number) => `¥${v.toFixed(2)}`,
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ marginBottom: 8 }}>数据分析</h2>
          <p style={{ color: '#666', margin: 0 }}>查看用户行为分析和运营数据</p>
        </div>
        <Button icon={<ReloadOutlined />} onClick={handleRefresh}>刷新数据</Button>
      </div>

      {/* Overview Stats */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={stats.totalUsers}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总消息数"
              value={stats.totalMessages}
              prefix={<MessageOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="角色总数"
              value={stats.totalCharacters}
              prefix={<RobotOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="会话总数"
              value={stats.totalSessions}
              prefix={<CommentOutlined style={{ color: '#eb2f96' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Today Stats */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="今日活跃用户"
              value={stats.todayActiveUsers}
              suffix={
                <span style={{ fontSize: 14, color: '#ff4d4f' }}>
                  <ArrowDownOutlined /> 100% 较昨日
                </span>
              }
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="今日消息数"
              value={stats.todayMessages}
              suffix={
                <span style={{ fontSize: 14, color: '#ff4d4f' }}>
                  <ArrowDownOutlined /> 100% 较昨日
                </span>
              }
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="今日新用户"
              value={stats.todayNewUsers}
              suffix={
                <span style={{ fontSize: 14, color: '#ff4d4f' }}>
                  <ArrowDownOutlined /> 100% 较昨日
                </span>
              }
            />
          </Card>
        </Col>
      </Row>

      {/* Trend Analysis */}
      <Card
        title="趋势分析"
        extra={
          <RangePicker
            value={dateRange}
            onChange={(dates) => dates && setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
          />
        }
        style={{ marginBottom: 24 }}
        loading={loading}
      >
        <p style={{ color: '#666', marginBottom: 16 }}>选择日期范围查看数据趋势</p>
        <Tabs
          items={[
            { key: 'dau', label: '日活跃用户' },
            { key: 'messages', label: '消息数量' },
            { key: 'newUsers', label: '新增用户' },
          ]}
        />
        <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', borderRadius: 8 }}>
          <div style={{ textAlign: 'center', color: '#999' }}>
            <p>趋势图表</p>
            <p style={{ fontSize: 12 }}>（图表组件可接入 @ant-design/charts）</p>
          </div>
        </div>
      </Card>

      {/* Daily Data Table */}
      <Card title="详细数据" loading={loading}>
        <Table
          columns={columns}
          dataSource={mockDailyData}
          rowKey="date"
          pagination={false}
          size="middle"
        />
      </Card>
    </div>
  )
}
