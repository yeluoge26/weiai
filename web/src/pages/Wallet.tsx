import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavBar, Button, Grid, List, Toast, Dialog } from 'antd-mobile'
import { walletApi } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

interface RechargeOption {
  amount: number
  coins: number
  bonus: number
  label: string
  tag?: string
}

interface Transaction {
  id: number
  amount: number
  type: string
  description: string
  createdAt: string
}

export default function Wallet() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const updateUser = useAuthStore((state) => state.updateUser)
  const [options, setOptions] = useState<RechargeOption[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [selectedOption, setSelectedOption] = useState<RechargeOption | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [optionsRes, txRes] = await Promise.all([
        walletApi.rechargeOptions(),
        walletApi.transactions({ page: 1, pageSize: 20 }),
      ])
      setOptions(optionsRes)
      setTransactions(txRes.items)
      if (optionsRes.length > 0) {
        setSelectedOption(optionsRes.find((o: RechargeOption) => o.tag === '热门') || optionsRes[0])
      }
    } catch (error) {
      // handled by interceptor
    }
  }

  const handleRecharge = async () => {
    if (!selectedOption) return

    const result = await Dialog.confirm({
      content: `确定充值 ${selectedOption.label}，获得 ${selectedOption.coins} 金币？`,
    })

    if (!result) return

    setLoading(true)
    try {
      const res = await walletApi.recharge(selectedOption.amount, 'mock')
      updateUser({ coins: res.newBalance })
      Toast.show({ icon: 'success', content: `充值成功，获得 ${res.coinsAdded} 金币` })
      loadData()
    } catch (error) {
      // handled by interceptor
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar onBack={() => navigate(-1)} className="bg-white">
        我的钱包
      </NavBar>

      {/* Balance */}
      <div className="bg-gradient-to-r from-primary-400 to-primary-500 mx-4 mt-4 rounded-xl p-6 text-white">
        <p className="text-sm text-white/80">金币余额</p>
        <p className="text-4xl font-bold mt-2">{user?.coins || 0}</p>
      </div>

      {/* Recharge Options */}
      <div className="bg-white mx-4 mt-4 rounded-xl p-4">
        <h3 className="text-lg font-semibold mb-4">充值金币</h3>
        <Grid columns={3} gap={12}>
          {options.map((option) => (
            <Grid.Item key={option.amount}>
              <div
                className={`relative border-2 rounded-xl p-3 text-center cursor-pointer transition-all ${
                  selectedOption?.amount === option.amount
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200'
                }`}
                onClick={() => setSelectedOption(option)}
              >
                {option.tag && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-white text-xs px-2 py-0.5 rounded-full">
                    {option.tag}
                  </span>
                )}
                <p className="text-xl font-bold text-primary-500">{option.coins}</p>
                <p className="text-xs text-gray-500">金币</p>
                {option.bonus > 0 && (
                  <p className="text-xs text-red-500 mt-1">+{option.bonus}赠送</p>
                )}
                <p className="text-sm font-medium mt-2">{option.label}</p>
              </div>
            </Grid.Item>
          ))}
        </Grid>

        <Button
          block
          color="primary"
          size="large"
          className="mt-6"
          loading={loading}
          onClick={handleRecharge}
          disabled={!selectedOption}
          style={{ '--background-color': '#ff6b9d', '--border-color': '#ff6b9d' } as any}
        >
          立即充值 {selectedOption?.label}
        </Button>

        <p className="text-xs text-gray-400 text-center mt-4">
          * 测试模式，无需真实支付
        </p>
      </div>

      {/* Transaction History */}
      <div className="mt-4 bg-white">
        <div className="px-4 py-3 border-b">
          <h3 className="text-lg font-semibold">交易记录</h3>
        </div>
        {transactions.length === 0 ? (
          <div className="py-12 text-center text-gray-400">暂无交易记录</div>
        ) : (
          <List>
            {transactions.map((tx) => (
              <List.Item
                key={tx.id}
                description={tx.description}
                extra={
                  <span className={tx.amount > 0 ? 'text-green-500' : 'text-red-500'}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount}
                  </span>
                }
              >
                {getTypeLabel(tx.type)}
              </List.Item>
            ))}
          </List>
        )}
      </div>
    </div>
  )
}

function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    recharge: '充值',
    gift: '送礼物',
    unlock: '解锁角色',
    reward: '奖励',
  }
  return labels[type] || type
}
