import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from '../trpc.js'
import { db } from '../db/schema.js'

export const characterRouter = router({
  // List characters
  list: publicProcedure
    .input(z.object({
      page: z.number().default(1),
      pageSize: z.number().default(20),
      category: z.string().optional(),
      search: z.string().optional()
    }))
    .query(async ({ input }) => {
      const { page, pageSize, category, search } = input
      const offset = (page - 1) * pageSize

      let where = "WHERE status = 'active'"
      const params: any[] = []

      if (category) {
        where += ' AND category = ?'
        params.push(category)
      }
      if (search) {
        where += ' AND (name LIKE ? OR description LIKE ?)'
        params.push(`%${search}%`, `%${search}%`)
      }

      const total = db.prepare(`SELECT COUNT(*) as count FROM characters ${where}`).get(...params) as any
      const items = db.prepare(`
        SELECT * FROM characters ${where}
        ORDER BY is_premium ASC, chat_count DESC
        LIMIT ? OFFSET ?
      `).all(...params, pageSize, offset) as any[]

      return {
        items: items.map(c => ({
          id: c.id,
          name: c.name,
          avatar: c.avatar,
          cover: c.cover,
          description: c.description,
          personality: c.personality,
          category: c.category,
          tags: c.tags ? c.tags.split(',') : [],
          greeting: c.greeting,
          isPremium: !!c.is_premium,
          price: c.price,
          chatCount: c.chat_count,
          likeCount: c.like_count
        })),
        total: total.count,
        page,
        pageSize
      }
    }),

  // Get character detail
  detail: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const character = db.prepare('SELECT * FROM characters WHERE id = ?').get(input.id) as any
      if (!character) {
        throw new Error('角色不存在')
      }
      return {
        id: character.id,
        name: character.name,
        avatar: character.avatar,
        cover: character.cover,
        description: character.description,
        personality: character.personality,
        category: character.category,
        tags: character.tags ? character.tags.split(',') : [],
        greeting: character.greeting,
        isPremium: !!character.is_premium,
        price: character.price,
        chatCount: character.chat_count,
        likeCount: character.like_count
      }
    }),

  // Check if user unlocked character
  checkUnlock: protectedProcedure
    .input(z.object({ characterId: z.number() }))
    .query(async ({ ctx, input }) => {
      const character = db.prepare('SELECT * FROM characters WHERE id = ?').get(input.characterId) as any
      if (!character) {
        throw new Error('角色不存在')
      }

      if (!character.is_premium) {
        return { unlocked: true }
      }

      const unlock = db.prepare(
        'SELECT * FROM user_characters WHERE user_id = ? AND character_id = ?'
      ).get(ctx.user.id, input.characterId)

      return { unlocked: !!unlock, price: character.price }
    }),

  // Unlock character
  unlock: protectedProcedure
    .input(z.object({ characterId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const character = db.prepare('SELECT * FROM characters WHERE id = ?').get(input.characterId) as any
      if (!character) {
        throw new Error('角色不存在')
      }

      if (!character.is_premium) {
        return { success: true, message: '该角色无需解锁' }
      }

      // Check if already unlocked
      const existing = db.prepare(
        'SELECT * FROM user_characters WHERE user_id = ? AND character_id = ?'
      ).get(ctx.user.id, input.characterId)

      if (existing) {
        return { success: true, message: '已解锁该角色' }
      }

      // Check coins
      const user = db.prepare('SELECT coins FROM users WHERE id = ?').get(ctx.user.id) as any
      if (user.coins < character.price) {
        throw new Error('金币不足')
      }

      // Deduct coins and unlock
      db.prepare('UPDATE users SET coins = coins - ? WHERE id = ?').run(character.price, ctx.user.id)
      db.prepare('INSERT INTO user_characters (user_id, character_id) VALUES (?, ?)').run(ctx.user.id, input.characterId)
      db.prepare(`
        INSERT INTO coin_transactions (user_id, amount, type, description, ref_id)
        VALUES (?, ?, 'unlock', ?, ?)
      `).run(ctx.user.id, -character.price, `解锁角色: ${character.name}`, character.id)

      return { success: true }
    }),

  // Get categories
  categories: publicProcedure.query(async () => {
    const categories = db.prepare(`
      SELECT category, COUNT(*) as count FROM characters
      WHERE status = 'active'
      GROUP BY category
    `).all() as any[]

    return categories.map(c => ({
      key: c.category,
      name: getCategoryName(c.category),
      count: c.count
    }))
  })
})

function getCategoryName(category: string): string {
  const names: Record<string, string> = {
    girlfriend: '女友',
    boyfriend: '男友',
    fantasy: '奇幻',
    celebrity: '明星',
    anime: '动漫',
    game: '游戏'
  }
  return names[category] || category
}
