import { useState } from 'react'
import { Card, Table, Button, Space, Tag, Modal, Form, Input, Select, message, Tabs, Typography } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, PlayCircleOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { TextArea } = Input
const { Text } = Typography

interface Script {
  id: number
  name: string
  characterId: number
  characterName: string
  nodeCount: number
  completionCount: number
  avgAffinity: number
  status: 'draft' | 'published'
  createdAt: string
}

interface ScriptNode {
  id: string
  type: 'dialogue' | 'choice' | 'ending'
  content: string
  choices?: { text: string; nextId: string; affinity: number }[]
  endingType?: 'good' | 'normal' | 'bad'
}

const mockScripts: Script[] = [
  { id: 1, name: '初入仙境', characterId: 2, characterName: '云墨仙子', nodeCount: 12, completionCount: 3560, avgAffinity: 25, status: 'published', createdAt: '2026-01-10' },
  { id: 2, name: '都市邂逅', characterId: 3, characterName: '陆景深', nodeCount: 15, completionCount: 2890, avgAffinity: 30, status: 'published', createdAt: '2026-01-12' },
  { id: 3, name: '星际冒险', characterId: 4, characterName: '艾拉·星辰', nodeCount: 10, completionCount: 1560, avgAffinity: 20, status: 'published', createdAt: '2026-01-15' },
  { id: 4, name: '剑道初心', characterId: 5, characterName: '凌霄子', nodeCount: 8, completionCount: 0, avgAffinity: 0, status: 'draft', createdAt: '2026-02-01' },
]

const mockNodes: ScriptNode[] = [
  { id: '1', type: 'dialogue', content: '*云墨仙子轻抬眸，淡淡开口*\n\n你是何人？为何出现在我云墨仙宗？' },
  { id: '2', type: 'choice', content: '', choices: [
    { text: '抱歉打扰，我是误入此地的凡人', nextId: '3', affinity: 5 },
    { text: '我是来拜师学艺的', nextId: '4', affinity: 10 },
    { text: '你管我是谁？', nextId: '5', affinity: -5 },
  ]},
  { id: '3', type: 'dialogue', content: '*微微颔首*\n\n凡人误入仙境，倒也有趣。你可愿在此停留片刻？' },
]

export default function ScriptEditor() {
  const [scripts] = useState<Script[]>(mockScripts)
  const [nodes] = useState<ScriptNode[]>(mockNodes)
  const [loading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [nodeModalVisible, setNodeModalVisible] = useState(false)
  const [currentScript, setCurrentScript] = useState<Script | null>(null)
  const [, setCurrentNode] = useState<ScriptNode | null>(null)
  const [form] = Form.useForm()
  const [nodeForm] = Form.useForm()

  const handleAdd = () => {
    setCurrentScript(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (record: Script) => {
    setCurrentScript(record)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  const handleAddNode = () => {
    setCurrentNode(null)
    nodeForm.resetFields()
    setNodeModalVisible(true)
  }

  const handleSave = async () => {
    try {
      await form.validateFields()
      message.success(currentScript ? '保存成功' : '创建成功')
      setModalVisible(false)
    } catch (error) {
      // Validation failed
    }
  }

  const columns: ColumnsType<Script> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '剧情名称', dataIndex: 'name', key: 'name' },
    { title: '关联角色', dataIndex: 'characterName', key: 'characterName' },
    { title: '节点数', dataIndex: 'nodeCount', key: 'nodeCount' },
    {
      title: '完成次数',
      dataIndex: 'completionCount',
      key: 'completionCount',
      render: (v: number) => v.toLocaleString(),
    },
    {
      title: '平均好感度',
      dataIndex: 'avgAffinity',
      key: 'avgAffinity',
      render: (v: number) => v > 0 ? `+${v}` : v,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'published' ? 'green' : 'orange'}>
          {status === 'published' ? '已发布' : '草稿'}
        </Tag>
      ),
    },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" icon={<PlayCircleOutlined />}>
            预览
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Space>
      ),
    },
  ]

  const nodeColumns: ColumnsType<ScriptNode> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const config: Record<string, { color: string; text: string }> = {
          dialogue: { color: 'blue', text: '对话' },
          choice: { color: 'purple', text: '选项' },
          ending: { color: 'gold', text: '结局' },
        }
        return <Tag color={config[type].color}>{config[type].text}</Tag>
      },
    },
    {
      title: '内容',
      key: 'content',
      render: (_, record) => {
        if (record.type === 'dialogue') {
          return <Text ellipsis style={{ maxWidth: 300 }}>{record.content}</Text>
        }
        if (record.type === 'choice' && record.choices) {
          return (
            <Space direction="vertical" size={0}>
              {record.choices.map((c, i) => (
                <Text key={i} type="secondary" style={{ fontSize: 12 }}>
                  选项{i + 1}: {c.text} (好感度{c.affinity > 0 ? '+' : ''}{c.affinity})
                </Text>
              ))}
            </Space>
          )
        }
        return record.endingType === 'good' ? '好结局' : record.endingType === 'bad' ? '坏结局' : '普通结局'
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: () => (
        <Space>
          <Button type="link" size="small">编辑</Button>
          <Button type="link" size="small" danger>删除</Button>
        </Space>
      ),
    },
  ]

  return (
    <Tabs
      items={[
        {
          key: 'scripts',
          label: '剧情列表',
          children: (
            <Card>
              <Space style={{ marginBottom: 16 }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                  创建剧情
                </Button>
              </Space>
              <Table
                columns={columns}
                dataSource={scripts}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
              />
            </Card>
          ),
        },
        {
          key: 'editor',
          label: '节点编辑器',
          children: (
            <Card title="剧情节点 - 初入仙境" extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAddNode}>添加节点</Button>}>
              <Table
                columns={nodeColumns}
                dataSource={nodes}
                rowKey="id"
                pagination={false}
              />
            </Card>
          ),
        },
      ]}
    />
  )

  return (
    <>
      <Modal
        title={currentScript ? '编辑剧情' : '创建剧情'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="剧情名称" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="关联角色" name="characterId" rules={[{ required: true }]}>
            <Select>
              <Select.Option value={2}>云墨仙子</Select.Option>
              <Select.Option value={3}>陆景深</Select.Option>
              <Select.Option value={4}>艾拉·星辰</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="剧情简介" name="description">
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="添加节点"
        open={nodeModalVisible}
        onOk={() => setNodeModalVisible(false)}
        onCancel={() => setNodeModalVisible(false)}
        width={600}
      >
        <Form form={nodeForm} layout="vertical">
          <Form.Item label="节点类型" name="type" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="dialogue">对话</Select.Option>
              <Select.Option value="choice">选项</Select.Option>
              <Select.Option value="ending">结局</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="对话内容" name="content">
            <TextArea rows={4} placeholder="支持*动作描述*格式" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
