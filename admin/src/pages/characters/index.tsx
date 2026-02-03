import { useState } from 'react'
import { Table, Card, Input, Button, Space, Tag, Modal, Form, Select, message, Avatar, Switch, Row, Col, Statistic, Rate, Progress } from 'antd'
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, RobotOutlined, HeartOutlined, MessageOutlined, StarOutlined, ExportOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

interface Character {
  id: number
  name: string
  avatar: string
  category: 'system' | 'rpg' | 'companion'
  subCategory?: string
  personality: string
  gender: 'male' | 'female'
  isRPG: boolean
  isNSFW: boolean
  hasTTS: boolean
  chatCount: number
  likeCount: number
  rating: number
  unlockPrice: number
  status: 'active' | 'inactive' | 'review'
  createdAt: string
}

const mockCharacters: Character[] = [
  { id: 1, name: '小微', avatar: '', category: 'system', personality: '活泼', gender: 'female', isRPG: false, isNSFW: false, hasTTS: true, chatCount: 15680, likeCount: 8520, rating: 4.8, unlockPrice: 0, status: 'active', createdAt: '2026-01-01' },
  { id: 2, name: '云墨仙子', avatar: '', category: 'rpg', subCategory: '仙侠', personality: '温柔', gender: 'female', isRPG: true, isNSFW: true, hasTTS: true, chatCount: 12350, likeCount: 6890, rating: 4.9, unlockPrice: 100, status: 'active', createdAt: '2026-01-05' },
  { id: 3, name: '陆景深', avatar: '', category: 'rpg', subCategory: '都市', personality: '霸道', gender: 'male', isRPG: true, isNSFW: true, hasTTS: true, chatCount: 9870, likeCount: 5640, rating: 4.7, unlockPrice: 100, status: 'active', createdAt: '2026-01-08' },
  { id: 4, name: '凌霄子', avatar: '', category: 'rpg', subCategory: '仙侠', personality: '高冷', gender: 'male', isRPG: true, isNSFW: false, hasTTS: false, chatCount: 7650, likeCount: 4320, rating: 4.5, unlockPrice: 50, status: 'active', createdAt: '2026-01-10' },
  { id: 5, name: '前男友·林昊', avatar: '', category: 'companion', personality: '温柔欺骗型', gender: 'male', isRPG: false, isNSFW: false, hasTTS: false, chatCount: 4520, likeCount: 2180, rating: 4.2, unlockPrice: 0, status: 'active', createdAt: '2026-01-15' },
  { id: 6, name: '星际指挥官', avatar: '', category: 'rpg', subCategory: '科幻', personality: '冷静', gender: 'male', isRPG: true, isNSFW: false, hasTTS: true, chatCount: 3280, likeCount: 1560, rating: 4.4, unlockPrice: 80, status: 'review', createdAt: '2026-01-18' },
  { id: 7, name: '暗夜精灵', avatar: '', category: 'rpg', subCategory: '奇幻', personality: '神秘', gender: 'female', isRPG: true, isNSFW: true, hasTTS: true, chatCount: 2890, likeCount: 1320, rating: 4.6, unlockPrice: 120, status: 'inactive', createdAt: '2026-01-20' },
]

const categoryOptions = [
  { value: 'system', label: '系统内置' },
  { value: 'rpg', label: 'RPG角色' },
  { value: 'companion', label: '陪伴类' },
]

const subCategoryOptions = [
  { value: '仙侠', label: '仙侠' },
  { value: '都市', label: '都市' },
  { value: '科幻', label: '科幻' },
  { value: '奇幻', label: '奇幻' },
  { value: '星际', label: '星际' },
  { value: '修真', label: '修真' },
  { value: '乙游', label: '乙游' },
  { value: '古风', label: '古风' },
]

const personalityOptions = [
  { value: '高冷', label: '高冷' },
  { value: '温柔', label: '温柔' },
  { value: '活泼', label: '活泼' },
  { value: '霸道', label: '霸道' },
  { value: '御姐', label: '御姐' },
  { value: '冷静', label: '冷静' },
  { value: '神秘', label: '神秘' },
  { value: '温柔欺骗型', label: '温柔欺骗型' },
]

export default function CharacterList() {
  const [characters] = useState<Character[]>(mockCharacters)
  const [loading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>()
  const [statusFilter, setStatusFilter] = useState<string | undefined>()
  const [modalVisible, setModalVisible] = useState(false)
  const [currentCharacter, setCurrentCharacter] = useState<Character | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [form] = Form.useForm()

  const handleAdd = () => {
    setCurrentCharacter(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (record: Character) => {
    setCurrentCharacter(record)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  const handleDelete = (record: Character) => {
    Modal.confirm({
      title: '确认删除角色？',
      content: `角色: ${record.name}`,
      onOk: () => {
        message.success('删除成功')
      },
    })
  }

  const handleBatchDelete = () => {
    Modal.confirm({
      title: `确认删除选中的 ${selectedRowKeys.length} 个角色？`,
      onOk: () => {
        message.success('批量删除成功')
        setSelectedRowKeys([])
      },
    })
  }

  const handleBatchStatus = (status: string) => {
    Modal.confirm({
      title: `确认${status === 'active' ? '上架' : '下架'}选中的 ${selectedRowKeys.length} 个角色？`,
      onOk: () => {
        message.success(`批量${status === 'active' ? '上架' : '下架'}成功`)
        setSelectedRowKeys([])
      },
    })
  }

  const handleSave = async () => {
    try {
      await form.validateFields()
      message.success(currentCharacter ? '保存成功' : '创建成功')
      setModalVisible(false)
    } catch (error) {
      // Validation failed
    }
  }

  const columns: ColumnsType<Character> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    {
      title: '角色',
      key: 'character',
      width: 200,
      render: (_, record) => (
        <Space>
          <Avatar src={record.avatar} style={{ backgroundColor: record.gender === 'female' ? '#eb2f96' : '#1890ff' }} size={48}>
            {record.name[0]}
          </Avatar>
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <div style={{ fontSize: 12, color: '#999' }}>{record.personality}</div>
            <Rate disabled defaultValue={record.rating} style={{ fontSize: 12 }} />
          </div>
        </Space>
      ),
    },
    {
      title: '类别',
      key: 'category',
      width: 120,
      render: (_, record) => {
        const config: Record<string, { color: string; text: string }> = {
          system: { color: 'blue', text: '系统内置' },
          rpg: { color: 'purple', text: 'RPG' },
          companion: { color: 'orange', text: '陪伴类' },
        }
        return (
          <Space direction="vertical" size={0}>
            <Tag color={config[record.category].color}>{config[record.category].text}</Tag>
            {record.subCategory && <Tag>{record.subCategory}</Tag>}
          </Space>
        )
      },
      filters: categoryOptions.map(o => ({ text: o.label, value: o.value })),
      onFilter: (value, record) => record.category === value,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      width: 80,
      render: (gender: string) => (
        <Tag color={gender === 'female' ? 'pink' : 'blue'}>
          {gender === 'male' ? '男' : '女'}
        </Tag>
      ),
      filters: [
        { text: '男', value: 'male' },
        { text: '女', value: 'female' },
      ],
      onFilter: (value, record) => record.gender === value,
    },
    {
      title: '功能标签',
      key: 'features',
      width: 150,
      render: (_, record) => (
        <Space wrap>
          {record.isRPG && <Tag color="geekblue">RPG</Tag>}
          {record.isNSFW && <Tag color="red">NSFW</Tag>}
          {record.hasTTS && <Tag color="green">TTS</Tag>}
          {record.unlockPrice === 0 && <Tag color="cyan">免费</Tag>}
        </Space>
      ),
    },
    {
      title: '解锁价格',
      dataIndex: 'unlockPrice',
      key: 'unlockPrice',
      width: 100,
      render: (price: number) => price === 0 ? <Tag color="green">免费</Tag> : `${price} 金币`,
      sorter: (a, b) => a.unlockPrice - b.unlockPrice,
    },
    {
      title: '数据统计',
      key: 'stats',
      width: 150,
      render: (_, record) => (
        <Space direction="vertical" size={0} style={{ fontSize: 12 }}>
          <span><MessageOutlined /> 对话: {record.chatCount.toLocaleString()}</span>
          <span><HeartOutlined /> 收藏: {record.likeCount.toLocaleString()}</span>
          <span><StarOutlined /> 评分: {record.rating}</span>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const config: Record<string, { color: string; text: string }> = {
          active: { color: 'green', text: '已上架' },
          inactive: { color: 'default', text: '已下架' },
          review: { color: 'orange', text: '审核中' },
        }
        return <Tag color={config[status].color}>{config[status].text}</Tag>
      },
      filters: [
        { text: '已上架', value: 'active' },
        { text: '已下架', value: 'inactive' },
        { text: '审核中', value: 'review' },
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

  const filteredCharacters = characters.filter((c) => {
    const matchSearch = c.name.includes(searchText) || c.personality.includes(searchText)
    const matchCategory = !categoryFilter || c.category === categoryFilter
    const matchStatus = !statusFilter || c.status === statusFilter
    return matchSearch && matchCategory && matchStatus
  })

  const stats = {
    total: characters.length,
    active: characters.filter(c => c.status === 'active').length,
    rpg: characters.filter(c => c.category === 'rpg').length,
    avgRating: (characters.reduce((sum, c) => sum + c.rating, 0) / characters.length).toFixed(1),
  }

  return (
    <div>
      {/* Stats Cards */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="角色总数"
              value={stats.total}
              prefix={<RobotOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已上架"
              value={stats.active}
              prefix={<RobotOutlined style={{ color: '#52c41a' }} />}
              suffix={<span style={{ fontSize: 14, color: '#999' }}>/ {stats.total}</span>}
            />
            <Progress percent={Math.round(stats.active / stats.total * 100)} size="small" showInfo={false} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="RPG角色"
              value={stats.rpg}
              prefix={<StarOutlined style={{ color: '#722ed1' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均评分"
              value={stats.avgRating}
              prefix={<StarOutlined style={{ color: '#faad14' }} />}
              suffix="/ 5"
            />
          </Card>
        </Col>
      </Row>

      {/* Main Table Card */}
      <Card>
        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            placeholder="搜索角色名/性格"
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
          <Select
            placeholder="状态筛选"
            allowClear
            style={{ width: 120 }}
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: 'active', label: '已上架' },
              { value: 'inactive', label: '已下架' },
              { value: 'review', label: '审核中' },
            ]}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加角色
          </Button>
          <Button icon={<ExportOutlined />}>导出</Button>
          {selectedRowKeys.length > 0 && (
            <>
              <Button onClick={() => handleBatchStatus('active')}>批量上架</Button>
              <Button onClick={() => handleBatchStatus('inactive')}>批量下架</Button>
              <Button danger onClick={handleBatchDelete}>批量删除</Button>
            </>
          )}
        </Space>

        <Table
          columns={columns}
          dataSource={filteredCharacters}
          rowKey="id"
          loading={loading}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 条`, showSizeChanger: true }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Edit/Add Modal */}
      <Modal
        title={currentCharacter ? '编辑角色' : '添加角色'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="角色名称" name="name" rules={[{ required: true }]}>
                <Input placeholder="请输入角色名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="性别" name="gender" rules={[{ required: true }]}>
                <Select placeholder="请选择性别">
                  <Select.Option value="male">男</Select.Option>
                  <Select.Option value="female">女</Select.Option>
                </Select>
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
              <Form.Item label="子分类（RPG专用）" name="subCategory">
                <Select options={subCategoryOptions} allowClear placeholder="请选择子分类" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="性格" name="personality" rules={[{ required: true }]}>
                <Select options={personalityOptions} placeholder="请选择性格" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="解锁价格（金币）" name="unlockPrice" initialValue={0}>
                <Input type="number" min={0} placeholder="0表示免费" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="角色简介" name="description">
            <Input.TextArea rows={3} placeholder="请输入角色简介" />
          </Form.Item>
          <Form.Item label="系统提示词" name="systemPrompt">
            <Input.TextArea rows={4} placeholder="请输入AI角色的系统提示词" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item label="RPG模式" name="isRPG" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="NSFW内容" name="isNSFW" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="TTS语音" name="hasTTS" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="状态" name="status" initialValue="active">
                <Select>
                  <Select.Option value="active">上架</Select.Option>
                  <Select.Option value="inactive">下架</Select.Option>
                  <Select.Option value="review">审核中</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  )
}
