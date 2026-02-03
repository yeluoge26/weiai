import { useState } from 'react'
import { Card, Form, Input, InputNumber, Button, Tabs, message, Divider, Switch, Select, Row, Col, Upload, Alert, Tag, Table } from 'antd'
import { SaveOutlined, UploadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

interface CoinPackage {
  id: number
  coins: number
  bonus: number
  price: number
  tag?: string
}

const defaultCoinPackages: CoinPackage[] = [
  { id: 1, coins: 60, bonus: 0, price: 6, tag: '' },
  { id: 2, coins: 300, bonus: 30, price: 30, tag: '热门' },
  { id: 3, coins: 680, bonus: 80, price: 68, tag: '' },
  { id: 4, coins: 1280, bonus: 200, price: 128, tag: '超值' },
  { id: 5, coins: 3280, bonus: 600, price: 328, tag: '' },
  { id: 6, coins: 6480, bonus: 1500, price: 648, tag: '豪华' },
]

export default function Settings() {
  const [basicForm] = Form.useForm()
  const [quotaForm] = Form.useForm()
  const [paymentForm] = Form.useForm()
  const [notificationForm] = Form.useForm()
  const [contentForm] = Form.useForm()
  const [storageForm] = Form.useForm()
  const [coinPackages, setCoinPackages] = useState<CoinPackage[]>(defaultCoinPackages)

  const handleSave = (formName: string) => async () => {
    message.success(`${formName}已保存`)
  }

  const coinPackageColumns: ColumnsType<CoinPackage> = [
    { title: '金币数量', dataIndex: 'coins', key: 'coins' },
    { title: '赠送金币', dataIndex: 'bonus', key: 'bonus' },
    { title: '价格(元)', dataIndex: 'price', key: 'price', render: (v) => `¥${v}` },
    {
      title: '标签',
      dataIndex: 'tag',
      key: 'tag',
      render: (v) => v ? <Tag color="orange">{v}</Tag> : '-'
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button type="link" danger size="small" icon={<DeleteOutlined />} onClick={() => {
          setCoinPackages(coinPackages.filter(p => p.id !== record.id))
        }}>
          删除
        </Button>
      )
    }
  ]

  return (
    <Tabs
      tabPosition="left"
      items={[
        {
          key: 'basic',
          label: '基础设置',
          children: (
            <Card title="基础设置">
              <Form
                form={basicForm}
                layout="vertical"
                initialValues={{
                  siteName: '微爱',
                  siteDescription: '新一代AI社交平台',
                  siteLogo: '',
                  contactEmail: 'support@welove.com',
                  contactPhone: '400-888-8888',
                  icp: '京ICP备xxxxxxxx号',
                  enableRegistration: true,
                  enableInvite: true,
                  maintenanceMode: false,
                }}
                style={{ maxWidth: 700 }}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="站点名称" name="siteName" rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="站点Logo" name="siteLogo">
                      <Upload maxCount={1} listType="picture">
                        <Button icon={<UploadOutlined />}>上传Logo</Button>
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item label="站点描述" name="siteDescription">
                  <Input.TextArea rows={2} />
                </Form.Item>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="联系邮箱" name="contactEmail">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="联系电话" name="contactPhone">
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item label="ICP备案号" name="icp">
                  <Input />
                </Form.Item>

                <Divider />

                <h4>功能开关</h4>
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item label="开放注册" name="enableRegistration" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="邀请系统" name="enableInvite" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="维护模式" name="maintenanceMode" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item>
                  <Button type="primary" icon={<SaveOutlined />} onClick={handleSave('基础设置')}>
                    保存设置
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          ),
        },
        {
          key: 'quota',
          label: '配额设置',
          children: (
            <Card title="用户配额设置">
              <Form
                form={quotaForm}
                layout="vertical"
                initialValues={{
                  normalDailyMessages: 20,
                  vip1DailyMessages: 100,
                  vip2DailyMessages: 500,
                  vip3DailyMessages: -1,
                  maxSessionsPerCharacter: 10,
                  maxMessagesPerSession: 100,
                  checkinCoins: 5,
                  checkinStreakBonus: 2,
                  inviteRewardCoins: 50,
                  shareRewardCoins: 10,
                }}
                style={{ maxWidth: 700 }}
              >
                <h4>每日消息配额</h4>
                <Alert
                  message="-1 表示无限制"
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item label="普通用户" name="normalDailyMessages">
                      <InputNumber min={-1} style={{ width: '100%' }} addonAfter="条" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="VIP1" name="vip1DailyMessages">
                      <InputNumber min={-1} style={{ width: '100%' }} addonAfter="条" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="VIP2" name="vip2DailyMessages">
                      <InputNumber min={-1} style={{ width: '100%' }} addonAfter="条" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="VIP3" name="vip3DailyMessages">
                      <InputNumber min={-1} style={{ width: '100%' }} addonAfter="条" />
                    </Form.Item>
                  </Col>
                </Row>

                <Divider />

                <h4>会话限制</h4>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="每角色最大会话数" name="maxSessionsPerCharacter">
                      <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="每会话最大消息数" name="maxMessagesPerSession">
                      <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>

                <Divider />

                <h4>签到奖励</h4>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="每日签到金币" name="checkinCoins">
                      <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="连续签到额外奖励" name="checkinStreakBonus">
                      <InputNumber min={0} style={{ width: '100%' }} addonAfter="金币/天" />
                    </Form.Item>
                  </Col>
                </Row>

                <Divider />

                <h4>其他奖励</h4>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="邀请好友奖励" name="inviteRewardCoins">
                      <InputNumber min={0} style={{ width: '100%' }} addonAfter="金币" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="分享奖励" name="shareRewardCoins">
                      <InputNumber min={0} style={{ width: '100%' }} addonAfter="金币" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item>
                  <Button type="primary" icon={<SaveOutlined />} onClick={handleSave('配额设置')}>
                    保存设置
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          ),
        },
        {
          key: 'payment',
          label: '支付设置',
          children: (
            <Card title="支付与定价设置">
              <Form
                form={paymentForm}
                layout="vertical"
                style={{ maxWidth: 800 }}
              >
                <h4>VIP 会员定价</h4>
                <Row gutter={16}>
                  <Col span={8}>
                    <Card size="small" title="VIP1 会员" style={{ background: '#fffbe6' }}>
                      <Form.Item label="月卡价格">
                        <InputNumber min={0} defaultValue={30} addonBefore="¥" style={{ width: '100%' }} />
                      </Form.Item>
                      <Form.Item label="季卡价格">
                        <InputNumber min={0} defaultValue={78} addonBefore="¥" style={{ width: '100%' }} />
                      </Form.Item>
                      <Form.Item label="年卡价格">
                        <InputNumber min={0} defaultValue={268} addonBefore="¥" style={{ width: '100%' }} />
                      </Form.Item>
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size="small" title="VIP2 会员" style={{ background: '#f9f0ff' }}>
                      <Form.Item label="月卡价格">
                        <InputNumber min={0} defaultValue={68} addonBefore="¥" style={{ width: '100%' }} />
                      </Form.Item>
                      <Form.Item label="季卡价格">
                        <InputNumber min={0} defaultValue={168} addonBefore="¥" style={{ width: '100%' }} />
                      </Form.Item>
                      <Form.Item label="年卡价格">
                        <InputNumber min={0} defaultValue={588} addonBefore="¥" style={{ width: '100%' }} />
                      </Form.Item>
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size="small" title="VIP3 会员" style={{ background: '#fff0f6' }}>
                      <Form.Item label="月卡价格">
                        <InputNumber min={0} defaultValue={128} addonBefore="¥" style={{ width: '100%' }} />
                      </Form.Item>
                      <Form.Item label="季卡价格">
                        <InputNumber min={0} defaultValue={328} addonBefore="¥" style={{ width: '100%' }} />
                      </Form.Item>
                      <Form.Item label="年卡价格">
                        <InputNumber min={0} defaultValue={998} addonBefore="¥" style={{ width: '100%' }} />
                      </Form.Item>
                    </Card>
                  </Col>
                </Row>

                <Divider />

                <h4>金币充值套餐</h4>
                <Table
                  columns={coinPackageColumns}
                  dataSource={coinPackages}
                  rowKey="id"
                  pagination={false}
                  size="small"
                />
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  style={{ marginTop: 16 }}
                  onClick={() => {
                    setCoinPackages([...coinPackages, {
                      id: Date.now(),
                      coins: 100,
                      bonus: 0,
                      price: 10,
                      tag: ''
                    }])
                  }}
                >
                  添加套餐
                </Button>

                <Divider />

                <h4>支付渠道</h4>
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item label="微信支付" valuePropName="checked">
                      <Switch defaultChecked />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="支付宝" valuePropName="checked">
                      <Switch defaultChecked />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Apple Pay" valuePropName="checked">
                      <Switch defaultChecked />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item>
                  <Button type="primary" icon={<SaveOutlined />} onClick={handleSave('支付设置')}>
                    保存设置
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          ),
        },
        {
          key: 'notification',
          label: '通知设置',
          children: (
            <Card title="通知设置">
              <Form
                form={notificationForm}
                layout="vertical"
                initialValues={{
                  enablePush: true,
                  enableSms: true,
                  enableEmail: false,
                  pushNewMessage: true,
                  pushNewMoment: true,
                  pushSystemNotice: true,
                  smsVerification: true,
                  smsMarketing: false,
                }}
                style={{ maxWidth: 600 }}
              >
                <h4>通知渠道</h4>
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item label="推送通知" name="enablePush" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="短信通知" name="enableSms" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="邮件通知" name="enableEmail" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                  </Col>
                </Row>

                <Divider />

                <h4>推送通知类型</h4>
                <Form.Item label="新消息通知" name="pushNewMessage" valuePropName="checked">
                  <Switch />
                </Form.Item>
                <Form.Item label="新动态通知" name="pushNewMoment" valuePropName="checked">
                  <Switch />
                </Form.Item>
                <Form.Item label="系统公告" name="pushSystemNotice" valuePropName="checked">
                  <Switch />
                </Form.Item>

                <Divider />

                <h4>短信设置</h4>
                <Form.Item label="短信服务商">
                  <Select defaultValue="aliyun">
                    <Select.Option value="aliyun">阿里云短信</Select.Option>
                    <Select.Option value="tencent">腾讯云短信</Select.Option>
                    <Select.Option value="yunpian">云片</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="API Key">
                  <Input.Password placeholder="请输入短信服务API Key" />
                </Form.Item>
                <Form.Item label="验证码短信" name="smsVerification" valuePropName="checked">
                  <Switch />
                </Form.Item>
                <Form.Item label="营销短信" name="smsMarketing" valuePropName="checked">
                  <Switch />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" icon={<SaveOutlined />} onClick={handleSave('通知设置')}>
                    保存设置
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          ),
        },
        {
          key: 'content',
          label: '内容审核',
          children: (
            <Card title="内容审核设置">
              <Form
                form={contentForm}
                layout="vertical"
                initialValues={{
                  enableAutoReview: true,
                  reviewProvider: 'aliyun',
                  sensitiveWordsCheck: true,
                  imageReview: true,
                  nsfwThreshold: 0.8,
                  autoBlockUser: true,
                  blockThreshold: 3,
                }}
                style={{ maxWidth: 600 }}
              >
                <Alert
                  message="内容审核可以帮助过滤不良内容，保护平台安全"
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                />

                <Form.Item label="启用自动审核" name="enableAutoReview" valuePropName="checked">
                  <Switch />
                </Form.Item>

                <Form.Item label="审核服务商" name="reviewProvider">
                  <Select>
                    <Select.Option value="aliyun">阿里云内容安全</Select.Option>
                    <Select.Option value="tencent">腾讯云内容安全</Select.Option>
                    <Select.Option value="baidu">百度内容审核</Select.Option>
                    <Select.Option value="custom">自定义服务</Select.Option>
                  </Select>
                </Form.Item>

                <Divider />

                <h4>审核类型</h4>
                <Form.Item label="敏感词检测" name="sensitiveWordsCheck" valuePropName="checked">
                  <Switch />
                </Form.Item>
                <Form.Item label="图片审核" name="imageReview" valuePropName="checked">
                  <Switch />
                </Form.Item>
                <Form.Item label="NSFW检测阈值" name="nsfwThreshold" extra="0-1之间，值越高越严格">
                  <InputNumber min={0} max={1} step={0.1} style={{ width: 200 }} />
                </Form.Item>

                <Divider />

                <h4>违规处理</h4>
                <Form.Item label="自动封禁违规用户" name="autoBlockUser" valuePropName="checked">
                  <Switch />
                </Form.Item>
                <Form.Item label="违规次数阈值" name="blockThreshold" extra="达到该次数后自动封禁">
                  <InputNumber min={1} style={{ width: 200 }} />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" icon={<SaveOutlined />} onClick={handleSave('内容审核设置')}>
                    保存设置
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          ),
        },
        {
          key: 'storage',
          label: '存储设置',
          children: (
            <Card title="存储设置">
              <Form
                form={storageForm}
                layout="vertical"
                initialValues={{
                  storageProvider: 'oss',
                  cdnEnabled: true,
                  imageCompress: true,
                  imageMaxSize: 5,
                  audioMaxSize: 20,
                  videoMaxSize: 100,
                }}
                style={{ maxWidth: 600 }}
              >
                <Form.Item label="存储服务商" name="storageProvider">
                  <Select>
                    <Select.Option value="oss">阿里云OSS</Select.Option>
                    <Select.Option value="cos">腾讯云COS</Select.Option>
                    <Select.Option value="s3">AWS S3</Select.Option>
                    <Select.Option value="qiniu">七牛云</Select.Option>
                    <Select.Option value="local">本地存储</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item label="Access Key">
                  <Input.Password placeholder="请输入Access Key" />
                </Form.Item>
                <Form.Item label="Secret Key">
                  <Input.Password placeholder="请输入Secret Key" />
                </Form.Item>
                <Form.Item label="Bucket名称">
                  <Input placeholder="请输入Bucket名称" />
                </Form.Item>
                <Form.Item label="存储区域">
                  <Select placeholder="请选择存储区域">
                    <Select.Option value="cn-hangzhou">华东1(杭州)</Select.Option>
                    <Select.Option value="cn-shanghai">华东2(上海)</Select.Option>
                    <Select.Option value="cn-beijing">华北2(北京)</Select.Option>
                    <Select.Option value="cn-shenzhen">华南1(深圳)</Select.Option>
                  </Select>
                </Form.Item>

                <Divider />

                <h4>CDN配置</h4>
                <Form.Item label="启用CDN加速" name="cdnEnabled" valuePropName="checked">
                  <Switch />
                </Form.Item>
                <Form.Item label="CDN域名">
                  <Input placeholder="例如: cdn.example.com" />
                </Form.Item>

                <Divider />

                <h4>文件限制</h4>
                <Form.Item label="图片自动压缩" name="imageCompress" valuePropName="checked">
                  <Switch />
                </Form.Item>
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item label="图片最大尺寸" name="imageMaxSize">
                      <InputNumber min={1} addonAfter="MB" style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="音频最大尺寸" name="audioMaxSize">
                      <InputNumber min={1} addonAfter="MB" style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="视频最大尺寸" name="videoMaxSize">
                      <InputNumber min={1} addonAfter="MB" style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item>
                  <Button type="primary" icon={<SaveOutlined />} onClick={handleSave('存储设置')}>
                    保存设置
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          ),
        },
      ]}
    />
  )
}
