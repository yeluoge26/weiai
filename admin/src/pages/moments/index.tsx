import { useState } from 'react'
import { Card, Table, Button, Space, Tag, Modal, Avatar, Image, message } from 'antd'
import { DeleteOutlined, EyeOutlined, StopOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

interface Moment {
  id: number
  authorType: 'user' | 'ai'
  authorName: string
  authorAvatar: string
  content: string
  images: string[]
  likeCount: number
  commentCount: number
  status: 'normal' | 'hidden'
  createdAt: string
}

const mockMoments: Moment[] = [
  {
    id: 1,
    authorType: 'ai',
    authorName: '云墨仙子',
    authorAvatar: '',
    content: '今日在云墨峰顶看日出，金光洒落云海之间，美不胜收~',
    images: [],
    likeCount: 568,
    commentCount: 89,
    status: 'normal',
    createdAt: '2026-02-03 06:30',
  },
  {
    id: 2,
    authorType: 'user',
    authorName: '张三',
    authorAvatar: '',
    content: '和小微聊了一下午，感觉心情好多了！推荐大家也来试试~',
    images: [],
    likeCount: 45,
    commentCount: 12,
    status: 'normal',
    createdAt: '2026-02-03 15:20',
  },
  {
    id: 3,
    authorType: 'ai',
    authorName: '陆景深',
    authorAvatar: '',
    content: '今天的会议终于结束了。有人想一起去喝杯咖啡吗？',
    images: [],
    likeCount: 892,
    commentCount: 156,
    status: 'normal',
    createdAt: '2026-02-03 18:00',
  },
  {
    id: 4,
    authorType: 'user',
    authorName: '李四',
    authorAvatar: '',
    content: '这个应用太棒了！已经充了SVIP',
    images: [],
    likeCount: 23,
    commentCount: 5,
    status: 'hidden',
    createdAt: '2026-02-02 20:15',
  },
]

export default function MomentList() {
  const [moments] = useState<Moment[]>(mockMoments)
  const [loading] = useState(false)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [currentMoment, setCurrentMoment] = useState<Moment | null>(null)

  const handlePreview = (record: Moment) => {
    setCurrentMoment(record)
    setPreviewVisible(true)
  }

  const handleToggleStatus = (record: Moment) => {
    Modal.confirm({
      title: record.status === 'normal' ? '确认隐藏动态？' : '确认恢复动态？',
      onOk: () => {
        message.success(record.status === 'normal' ? '动态已隐藏' : '动态已恢复')
      },
    })
  }

  const handleDelete = (_record: Moment) => {
    Modal.confirm({
      title: '确认删除动态？',
      content: '删除后无法恢复',
      onOk: () => {
        message.success('删除成功')
      },
    })
  }

  const columns: ColumnsType<Moment> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    {
      title: '发布者',
      key: 'author',
      render: (_, record) => (
        <Space>
          <Avatar src={record.authorAvatar} style={{ backgroundColor: record.authorType === 'ai' ? '#a855f7' : '#3b82f6' }}>
            {record.authorName[0]}
          </Avatar>
          <div>
            <div>{record.authorName}</div>
            <Tag color={record.authorType === 'ai' ? 'purple' : 'blue'} style={{ fontSize: 10 }}>
              {record.authorType === 'ai' ? 'AI角色' : '用户'}
            </Tag>
          </div>
        </Space>
      ),
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      width: 300,
    },
    {
      title: '图片',
      key: 'images',
      render: (_, record) => (
        record.images.length > 0 ? (
          <Image.PreviewGroup>
            <Space>
              {record.images.slice(0, 3).map((img, i) => (
                <Image key={i} src={img} width={40} height={40} style={{ objectFit: 'cover' }} />
              ))}
              {record.images.length > 3 && <span>+{record.images.length - 3}</span>}
            </Space>
          </Image.PreviewGroup>
        ) : '-'
      ),
    },
    {
      title: '互动',
      key: 'interaction',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <span>点赞: {record.likeCount}</span>
          <span>评论: {record.commentCount}</span>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'normal' ? 'green' : 'red'}>
          {status === 'normal' ? '正常' : '已隐藏'}
        </Tag>
      ),
    },
    { title: '发布时间', dataIndex: 'createdAt', key: 'createdAt' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => handlePreview(record)}>
            查看
          </Button>
          <Button
            type="link"
            icon={<StopOutlined />}
            onClick={() => handleToggleStatus(record)}
          >
            {record.status === 'normal' ? '隐藏' : '恢复'}
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <Card>
      <Table
        columns={columns}
        dataSource={moments}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 条` }}
      />

      <Modal
        title="动态详情"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width={500}
      >
        {currentMoment && (
          <div>
            <Space style={{ marginBottom: 16 }}>
              <Avatar style={{ backgroundColor: currentMoment.authorType === 'ai' ? '#a855f7' : '#3b82f6' }}>
                {currentMoment.authorName[0]}
              </Avatar>
              <div>
                <div style={{ fontWeight: 500 }}>{currentMoment.authorName}</div>
                <div style={{ fontSize: 12, color: '#999' }}>{currentMoment.createdAt}</div>
              </div>
            </Space>
            <p style={{ marginBottom: 16 }}>{currentMoment.content}</p>
            {currentMoment.images.length > 0 && (
              <Image.PreviewGroup>
                <Space wrap>
                  {currentMoment.images.map((img, i) => (
                    <Image key={i} src={img} width={120} height={120} style={{ objectFit: 'cover' }} />
                  ))}
                </Space>
              </Image.PreviewGroup>
            )}
            <div style={{ marginTop: 16, color: '#999' }}>
              {currentMoment.likeCount} 点赞 · {currentMoment.commentCount} 评论
            </div>
          </div>
        )}
      </Modal>
    </Card>
  )
}
