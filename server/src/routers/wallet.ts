import { z } from 'zod'
import { router, protectedProcedure } from '../trpc.js'
import { db } from '../db/schema.js'

export const walletRouter = router({
  // Get wallet balance
  balance: protectedProcedure.query(async ({ ctx }) => {
    const user = db.prepare('SELECT coins, vip_level, vip_expire_at FROM users WHERE id = ?')
      .get(ctx.user.id) as any
    return {
      coins: user.coins,
      vipLevel: user.vip_level,
      vipExpireAt: user.vip_expire_at
    }
  }),

  // Get transaction history
  transactions: protectedProcedure
    .input(z.object({
      page: z.number().default(1),
      pageSize: z.number().default(20),
      type: z.string().optional()
    }))
    .query(async ({ ctx, input }) => {
      const { page, pageSize, type } = input
      const offset = (page - 1) * pageSize

      let where = 'WHERE user_id = ?'
      const params: any[] = [ctx.user.id]

      if (type) {
        where += ' AND type = ?'
        params.push(type)
      }

      const total = db.prepare(`SELECT COUNT(*) as count FROM coin_transactions ${where}`)
        .get(...params) as any

      const transactions = db.prepare(`
        SELECT * FROM coin_transactions
        ${where}
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `).all(...params, pageSize, offset) as any[]

      return {
        items: transactions.map(t => ({
          id: t.id,
          amount: t.amount,
          type: t.type,
          description: t.description,
          createdAt: t.created_at
        })),
        total: total.count
      }
    }),

  // Recharge coins (mock)
  recharge: protectedProcedure
    .input(z.object({
      amount: z.number().min(1),
      paymentMethod: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      // In production, integrate with real payment gateway
      // For demo, directly add coins
      const bonusRate: Record<number, number> = {
        6: 0,      // ¥6 = 60 coins
        30: 0.1,   // ¥30 = 330 coins (10% bonus)
        68: 0.15,  // ¥68 = 782 coins (15% bonus)
        128: 0.2,  // ¥128 = 1536 coins (20% bonus)
        328: 0.3,  // ¥328 = 4264 coins (30% bonus)
        648: 0.5   // ¥648 = 9720 coins (50% bonus)
      }

      const baseCoins = input.amount * 10
      const bonus = bonusRate[input.amount] || 0
      const totalCoins = Math.floor(baseCoins * (1 + bonus))

      db.prepare('UPDATE users SET coins = coins + ? WHERE id = ?')
        .run(totalCoins, ctx.user.id)

      db.prepare(`
        INSERT INTO coin_transactions (user_id, amount, type, description)
        VALUES (?, ?, 'recharge', ?)
      `).run(ctx.user.id, totalCoins, `充值 ¥${input.amount}`)

      const user = db.prepare('SELECT coins FROM users WHERE id = ?').get(ctx.user.id) as any

      return {
        success: true,
        coinsAdded: totalCoins,
        newBalance: user.coins
      }
    }),

  // Get recharge options
  rechargeOptions: protectedProcedure.query(async () => {
    return [
      { amount: 6, coins: 60, bonus: 0, label: '¥6' },
      { amount: 30, coins: 330, bonus: 30, label: '¥30', tag: '热门' },
      { amount: 68, coins: 782, bonus: 102, label: '¥68' },
      { amount: 128, coins: 1536, bonus: 256, label: '¥128', tag: '超值' },
      { amount: 328, coins: 4264, bonus: 984, label: '¥328' },
      { amount: 648, coins: 9720, bonus: 3240, label: '¥648', tag: '土豪' }
    ]
  })
})
