import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from '../trpc.js'
import { db } from '../db/schema.js'

export const giftRouter = router({
  // List gifts
  list: publicProcedure.query(async () => {
    const gifts = db.prepare(`
      SELECT * FROM gifts
      WHERE status = 'active'
      ORDER BY sort_order ASC, price ASC
    `).all() as any[]

    return gifts.map(g => ({
      id: g.id,
      name: g.name,
      icon: g.icon,
      price: g.price,
      description: g.description,
      animation: g.animation
    }))
  }),

  // Send gift
  send: protectedProcedure
    .input(z.object({
      characterId: z.number(),
      giftId: z.number(),
      quantity: z.number().min(1).max(99).default(1)
    }))
    .mutation(async ({ ctx, input }) => {
      const gift = db.prepare('SELECT * FROM gifts WHERE id = ?').get(input.giftId) as any
      if (!gift) {
        throw new Error('礼物不存在')
      }

      const character = db.prepare('SELECT * FROM characters WHERE id = ?').get(input.characterId) as any
      if (!character) {
        throw new Error('角色不存在')
      }

      const totalPrice = gift.price * input.quantity

      // Check balance
      const user = db.prepare('SELECT coins FROM users WHERE id = ?').get(ctx.user.id) as any
      if (user.coins < totalPrice) {
        throw new Error('金币不足')
      }

      // Deduct coins
      db.prepare('UPDATE users SET coins = coins - ? WHERE id = ?').run(totalPrice, ctx.user.id)

      // Record gift
      db.prepare(`
        INSERT INTO gift_records (user_id, character_id, gift_id, quantity, total_price)
        VALUES (?, ?, ?, ?, ?)
      `).run(ctx.user.id, input.characterId, input.giftId, input.quantity, totalPrice)

      // Record transaction
      db.prepare(`
        INSERT INTO coin_transactions (user_id, amount, type, description, ref_id)
        VALUES (?, ?, 'gift', ?, ?)
      `).run(ctx.user.id, -totalPrice, `送给${character.name} ${gift.name}x${input.quantity}`, input.characterId)

      // Update character like count
      db.prepare('UPDATE characters SET like_count = like_count + ? WHERE id = ?')
        .run(input.quantity, input.characterId)

      const newUser = db.prepare('SELECT coins FROM users WHERE id = ?').get(ctx.user.id) as any

      return {
        success: true,
        giftName: gift.name,
        quantity: input.quantity,
        totalPrice,
        newBalance: newUser.coins,
        // Generate a thank you message from character
        thankMessage: generateThankMessage(character.name, character.personality, gift.name, input.quantity)
      }
    }),

  // Get gift history for a character
  history: protectedProcedure
    .input(z.object({
      characterId: z.number(),
      page: z.number().default(1),
      pageSize: z.number().default(20)
    }))
    .query(async ({ ctx, input }) => {
      const { characterId, page, pageSize } = input
      const offset = (page - 1) * pageSize

      const records = db.prepare(`
        SELECT gr.*, g.name as gift_name, g.icon as gift_icon
        FROM gift_records gr
        JOIN gifts g ON gr.gift_id = g.id
        WHERE gr.user_id = ? AND gr.character_id = ?
        ORDER BY gr.created_at DESC
        LIMIT ? OFFSET ?
      `).all(ctx.user.id, characterId, pageSize, offset) as any[]

      return records.map(r => ({
        id: r.id,
        giftName: r.gift_name,
        giftIcon: r.gift_icon,
        quantity: r.quantity,
        totalPrice: r.total_price,
        createdAt: r.created_at
      }))
    }),

  // Get ranking
  ranking: publicProcedure
    .input(z.object({ characterId: z.number() }))
    .query(async ({ input }) => {
      const ranking = db.prepare(`
        SELECT u.id, u.nickname, u.avatar, SUM(gr.total_price) as total_spent
        FROM gift_records gr
        JOIN users u ON gr.user_id = u.id
        WHERE gr.character_id = ?
        GROUP BY u.id
        ORDER BY total_spent DESC
        LIMIT 100
      `).all(input.characterId) as any[]

      return ranking.map((r, index) => ({
        rank: index + 1,
        userId: r.id,
        nickname: r.nickname,
        avatar: r.avatar,
        totalSpent: r.total_spent
      }))
    })
})

function generateThankMessage(name: string, personality: string, giftName: string, quantity: number): string {
  const messages = [
    `哇！谢谢你送我${giftName}！好开心～`,
    `${giftName}！我好喜欢！谢谢你～`,
    `收到${giftName}啦！你对我真好～`,
    `${quantity > 1 ? `这么多${giftName}！` : ''}太感谢你了！`
  ]

  const message = messages[Math.floor(Math.random() * messages.length)]

  if (personality?.includes('高冷')) {
    return message.replace(/～|！/g, '。').replace('好开心', '还不错')
  }

  return message
}
