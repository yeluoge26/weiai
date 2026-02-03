import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Toast } from 'antd-mobile'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/services/api'

export default function Login() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [codeSent, setCodeSent] = useState(false)

  const sendCode = () => {
    if (phone.length !== 11) {
      Toast.show({ icon: 'fail', content: '请输入正确的手机号' })
      return
    }
    // Mock send code
    setCodeSent(true)
    Toast.show({ icon: 'success', content: '验证码已发送（测试模式：任意6位数字）' })
  }

  const handleLogin = async () => {
    if (phone.length !== 11) {
      Toast.show({ icon: 'fail', content: '请输入正确的手机号' })
      return
    }

    setLoading(true)
    try {
      const res = await authApi.login(phone, code || '123456')
      setAuth(res.token, res.user)
      Toast.show({ icon: 'success', content: '登录成功' })
      navigate('/', { replace: true })
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-400 to-primary-600 flex flex-col">
      {/* Header */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg">
          <span className="text-4xl">💕</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">WeLove</h1>
        <p className="text-white/80 text-center">AI虚拟伴侣，温暖陪伴每一天</p>
      </div>

      {/* Login Form */}
      <div className="bg-white rounded-t-3xl px-6 py-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">手机号登录</h2>

        <div className="space-y-4">
          <div>
            <Input
              placeholder="请输入手机号"
              value={phone}
              onChange={setPhone}
              maxLength={11}
              type="tel"
              className="border border-gray-200 rounded-lg px-4 py-3"
            />
          </div>

          <div className="flex gap-3">
            <Input
              placeholder="请输入验证码"
              value={code}
              onChange={setCode}
              maxLength={6}
              type="number"
              className="flex-1 border border-gray-200 rounded-lg px-4 py-3"
            />
            <Button
              color="primary"
              fill="outline"
              onClick={sendCode}
              disabled={codeSent}
              className="whitespace-nowrap"
            >
              {codeSent ? '已发送' : '获取验证码'}
            </Button>
          </div>

          <Button
            block
            color="primary"
            size="large"
            loading={loading}
            onClick={handleLogin}
            className="mt-6 rounded-lg"
            style={{ '--background-color': '#ff6b9d', '--border-color': '#ff6b9d' } as any}
          >
            登录 / 注册
          </Button>

          <p className="text-xs text-gray-400 text-center mt-4">
            登录即表示同意《用户协议》和《隐私政策》
          </p>
        </div>
      </div>
    </div>
  )
}
