import { Row, Col, Card, Statistic, Table, Tag } from 'antd'
import {
  UserOutlined,
  RobotOutlined,
  MessageOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons'

// Mock data
const stats = [
  {
    title: '总用户数',
    value: 12580,
    prefix: <UserOutlined />,
    trend: 12.5,
    color: '#ec4899',
  },
  {
    title: '活跃角色',
    value: 30,
    prefix: <RobotOutlined />,
    trend: 5,
    color: '#a855f7',
  },
  {
    title: '今日消息',
    value: 45890,
    prefix: <MessageOutlined />,
    trend: -2.3,
    color: '#3b82f6',
  },
  {
    title: '今日收入',
    value: 8960,
    prefix: <DollarOutlined />,
    trend: 18.7,
    color: '#10b981',
    isMoney: true,
  },
]

const recentUsers = [
  { id: 1, name: '用户A', email: 'user_a@example.com', vip: 'SVIP', createdAt: '2026-02-03 10:30' },
  { id: 2, name: '用户B', email: 'user_b@example.com', vip: 'VIP', createdAt: '2026-02-03 09:15' },
  { id: 3, name: '用户C', email: 'user_c@example.com', vip: '普通', createdAt: '2026-02-03 08:45' },
  { id: 4, name: '用户D', email: 'user_d@example.com', vip: 'VIP', createdAt: '2026-02-02 22:30' },
  { id: 5, name: '用户E', email: 'user_e@example.com', vip: '普通', createdAt: '2026-02-02 21:00' },
]

const hotCharacters = [
  { id: 1, name: '云墨仙子', category: 'RPG-仙侠', chats: 5680, gifts: 12300 },
  { id: 2, name: '陆景深', category: 'RPG-都市', chats: 4520, gifts: 9800 },
  { id: 3, name: '小微', category: '系统内置', chats: 3890, gifts: 5600 },
  { id: 4, name: '艾拉·星辰', category: 'RPG-星际', chats: 3210, gifts: 7200 },
  { id: 5, name: '凌霄子', category: 'RPG-仙侠', chats: 2980, gifts: 6100 },
]

const userColumns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
  { title: '用户名', dataIndex: 'name', key: 'name' },
  { title: '邮箱', dataIndex: 'email', key: 'email' },
  {
    title: 'VIP等级',
    dataIndex: 'vip',
    key: 'vip',
    render: (vip: string) => {
      const color = vip === 'SVIP' ? 'gold' : vip === 'VIP' ? 'purple' : 'default'
      return <Tag color={color}>{vip}</Tag>
    },
  },
  { title: '注册时间', dataIndex: 'createdAt', key: 'createdAt' },
]

const characterColumns = [
  { title: '排名', key: 'rank', render: (_: unknown, __: unknown, index: number) => index + 1, width: 60 },
  { title: '角色名', dataIndex: 'name', key: 'name' },
  { title: '分类', dataIndex: 'category', key: 'category' },
  { title: '对话数', dataIndex: 'chats', key: 'chats', render: (v: number) => v.toLocaleString() },
  { title: '礼物金额', dataIndex: 'gifts', key: 'gifts', render: (v: number) => `¥${v.toLocaleString()}` },
]

export default function Dashboard() {
  return (
    <div>
      {/* Statistics Cards */}
      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.prefix}
                valueStyle={{ color: stat.color }}
                suffix={
                  stat.trend > 0 ? (
                    <span style={{ fontSize: 14, color: '#10b981' }}>
                      <ArrowUpOutlined /> {stat.trend}%
                    </span>
                  ) : (
                    <span style={{ fontSize: 14, color: '#ef4444' }}>
                      <ArrowDownOutlined /> {Math.abs(stat.trend)}%
                    </span>
                  )
                }
                formatter={(value) =>
                  stat.isMoney ? `¥${Number(value).toLocaleString()}` : Number(value).toLocaleString()
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Tables */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="最近注册用户" extra={<a href="/users">查看全部</a>}>
            <Table
              columns={userColumns}
              dataSource={recentUsers}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="热门角色排行" extra={<a href="/characters">查看全部</a>}>
            <Table
              columns={characterColumns}
              dataSource={hotCharacters}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
