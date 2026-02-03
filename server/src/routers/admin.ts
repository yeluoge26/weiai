import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { router, publicProcedure, adminProcedure } from '../trpc.js'
import { db } from '../db/schema.js'
import { signToken } from '../utils/jwt.js'

export const adminRouter = router({
  // Admin login
  login: publicProcedure
    .input(z.object({
      username: z.string(),
      password: z.string()
    }))
    .mutation(async ({ input }) => {
      const admin = db.prepare('SELECT * FROM admins WHERE username = ?').get(input.username) as any
      if (!admin) {
        throw new Error('用户名或密码错误')
      }

      const valid = bcrypt.compareSync(input.password, admin.password)
      if (!valid) {
        throw new Error('用户名或密码错误')
      }

      if (admin.status !== 'active') {
        throw new Error('账号已被禁用')
      }

      const token = signToken({ id: admin.id, type: 'admin' })

      return {
        token,
        user: {
          id: admin.id,
          username: admin.username,
          nickname: admin.nickname,
          role: admin.role
        }
      }
    }),

  // Dashboard stats
  dashboard: router({
    stats: adminProcedure.query(async () => {
      const userCount = (db.prepare('SELECT COUNT(*) as count FROM users').get() as any).count
      const characterCount = (db.prepare('SELECT COUNT(*) as count FROM characters').get() as any).count
      const todayUsers = (db.prepare(`SELECT COUNT(*) as count FROM users WHERE date(created_at) = date('now')`).get() as any).count
      const totalRevenue = (db.prepare(`SELECT COALESCE(SUM(amount), 0) as total FROM coin_transactions WHERE type = 'recharge'`).get() as any).total

      return {
        userCount,
        characterCount,
        todayUsers,
        totalRevenue
      }
    }),

    recentUsers: adminProcedure.query(async () => {
      return db.prepare(`
        SELECT id, nickname, avatar, phone, created_at
        FROM users
        ORDER BY created_at DESC
        LIMIT 10
      `).all()
    }),

    hotCharacters: adminProcedure.query(async () => {
      return db.prepare(`
        SELECT c.id, c.name, c.avatar, c.chat_count,
          COALESCE(SUM(gr.total_price), 0) as gifts
        FROM characters c
        LEFT JOIN gift_records gr ON c.id = gr.character_id
        GROUP BY c.id
        ORDER BY c.chat_count DESC
        LIMIT 10
      `).all()
    })
  }),

  // User management
  user: router({
    list: adminProcedure
      .input(z.object({
        page: z.number().default(1),
        pageSize: z.number().default(20),
        search: z.string().optional(),
        status: z.string().optional()
      }))
      .query(async ({ input }) => {
        const { page, pageSize, search, status } = input
        const offset = (page - 1) * pageSize

        let where = 'WHERE 1=1'
        const params: any[] = []

        if (search) {
          where += ' AND (nickname LIKE ? OR phone LIKE ?)'
          params.push(`%${search}%`, `%${search}%`)
        }
        if (status) {
          where += ' AND status = ?'
          params.push(status)
        }

        const total = (db.prepare(`SELECT COUNT(*) as count FROM users ${where}`).get(...params) as any).count
        const items = db.prepare(`
          SELECT * FROM users ${where}
          ORDER BY created_at DESC
          LIMIT ? OFFSET ?
        `).all(...params, pageSize, offset)

        return { items, total, page, pageSize }
      }),

    detail: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.prepare('SELECT * FROM users WHERE id = ?').get(input.id)
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        nickname: z.string().optional(),
        coins: z.number().optional(),
        vipLevel: z.number().optional(),
        status: z.string().optional()
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input
        const updates: string[] = []
        const values: any[] = []

        if (data.nickname) { updates.push('nickname = ?'); values.push(data.nickname) }
        if (data.coins !== undefined) { updates.push('coins = ?'); values.push(data.coins) }
        if (data.vipLevel !== undefined) { updates.push('vip_level = ?'); values.push(data.vipLevel) }
        if (data.status) { updates.push('status = ?'); values.push(data.status) }

        if (updates.length > 0) {
          values.push(id)
          db.prepare(`UPDATE users SET ${updates.join(', ')}, updated_at = datetime('now') WHERE id = ?`).run(...values)
        }

        return { success: true }
      }),

    ban: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        db.prepare("UPDATE users SET status = 'banned' WHERE id = ?").run(input.id)
        return { success: true }
      }),

    unban: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        db.prepare("UPDATE users SET status = 'active' WHERE id = ?").run(input.id)
        return { success: true }
      })
  }),

  // Character management
  character: router({
    list: adminProcedure
      .input(z.object({
        page: z.number().default(1),
        pageSize: z.number().default(20),
        category: z.string().optional(),
        search: z.string().optional()
      }))
      .query(async ({ input }) => {
        const { page, pageSize, category, search } = input
        const offset = (page - 1) * pageSize

        let where = 'WHERE 1=1'
        const params: any[] = []

        if (category) { where += ' AND category = ?'; params.push(category) }
        if (search) { where += ' AND name LIKE ?'; params.push(`%${search}%`) }

        const total = (db.prepare(`SELECT COUNT(*) as count FROM characters ${where}`).get(...params) as any).count
        const items = db.prepare(`SELECT * FROM characters ${where} ORDER BY id DESC LIMIT ? OFFSET ?`).all(...params, pageSize, offset)

        return { items, total, page, pageSize }
      }),

    detail: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.prepare('SELECT * FROM characters WHERE id = ?').get(input.id)
      }),

    create: adminProcedure
      .input(z.object({
        name: z.string(),
        avatar: z.string(),
        cover: z.string().optional(),
        description: z.string().optional(),
        personality: z.string().optional(),
        category: z.string().default('girlfriend'),
        tags: z.string().optional(),
        greeting: z.string().optional(),
        isPremium: z.boolean().default(false),
        price: z.number().default(0)
      }))
      .mutation(async ({ input }) => {
        const result = db.prepare(`
          INSERT INTO characters (name, avatar, cover, description, personality, category, tags, greeting, is_premium, price)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(input.name, input.avatar, input.cover, input.description, input.personality, input.category, input.tags, input.greeting, input.isPremium ? 1 : 0, input.price)
        return { id: result.lastInsertRowid }
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        avatar: z.string().optional(),
        cover: z.string().optional(),
        description: z.string().optional(),
        personality: z.string().optional(),
        category: z.string().optional(),
        tags: z.string().optional(),
        greeting: z.string().optional(),
        isPremium: z.boolean().optional(),
        price: z.number().optional(),
        status: z.string().optional()
      }))
      .mutation(async ({ input }) => {
        const { id, isPremium, ...data } = input
        const updates: string[] = []
        const values: any[] = []

        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined) {
            updates.push(`${key} = ?`)
            values.push(value)
          }
        })
        if (isPremium !== undefined) {
          updates.push('is_premium = ?')
          values.push(isPremium ? 1 : 0)
        }

        if (updates.length > 0) {
          values.push(id)
          db.prepare(`UPDATE characters SET ${updates.join(', ')}, updated_at = datetime('now') WHERE id = ?`).run(...values)
        }
        return { success: true }
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        db.prepare("UPDATE characters SET status = 'deleted' WHERE id = ?").run(input.id)
        return { success: true }
      })
  }),

  // Gift management
  gift: router({
    list: adminProcedure.query(async () => {
      return db.prepare('SELECT * FROM gifts ORDER BY sort_order ASC').all()
    }),

    create: adminProcedure
      .input(z.object({
        name: z.string(),
        icon: z.string(),
        price: z.number(),
        description: z.string().optional(),
        animation: z.string().optional(),
        sortOrder: z.number().default(0)
      }))
      .mutation(async ({ input }) => {
        const result = db.prepare(`
          INSERT INTO gifts (name, icon, price, description, animation, sort_order)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(input.name, input.icon, input.price, input.description, input.animation, input.sortOrder)
        return { id: result.lastInsertRowid }
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        icon: z.string().optional(),
        price: z.number().optional(),
        description: z.string().optional(),
        sortOrder: z.number().optional(),
        status: z.string().optional()
      }))
      .mutation(async ({ input }) => {
        const { id, sortOrder, ...data } = input
        const updates: string[] = []
        const values: any[] = []

        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined) { updates.push(`${key} = ?`); values.push(value) }
        })
        if (sortOrder !== undefined) { updates.push('sort_order = ?'); values.push(sortOrder) }

        if (updates.length > 0) {
          values.push(id)
          db.prepare(`UPDATE gifts SET ${updates.join(', ')} WHERE id = ?`).run(...values)
        }
        return { success: true }
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        db.prepare("UPDATE gifts SET status = 'deleted' WHERE id = ?").run(input.id)
        return { success: true }
      })
  }),

  // Moment management
  moment: router({
    list: adminProcedure
      .input(z.object({
        page: z.number().default(1),
        pageSize: z.number().default(20)
      }))
      .query(async ({ input }) => {
        const { page, pageSize } = input
        const offset = (page - 1) * pageSize

        const total = (db.prepare('SELECT COUNT(*) as count FROM moments').get() as any).count
        const items = db.prepare(`
          SELECT m.*, c.name as character_name
          FROM moments m
          JOIN characters c ON m.character_id = c.id
          ORDER BY m.created_at DESC
          LIMIT ? OFFSET ?
        `).all(pageSize, offset)

        return { items, total, page, pageSize }
      }),

    hide: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        db.prepare("UPDATE moments SET status = 'hidden' WHERE id = ?").run(input.id)
        return { success: true }
      }),

    show: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        db.prepare("UPDATE moments SET status = 'active' WHERE id = ?").run(input.id)
        return { success: true }
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        db.prepare('DELETE FROM moment_comments WHERE moment_id = ?').run(input.id)
        db.prepare('DELETE FROM moment_likes WHERE moment_id = ?').run(input.id)
        db.prepare('DELETE FROM moments WHERE id = ?').run(input.id)
        return { success: true }
      })
  }),

  // Settings
  settings: router({
    get: adminProcedure.query(async () => {
      // Return mock settings
      return {
        siteName: 'WeLove',
        siteDescription: 'AI虚拟伴侣平台',
        enableRegister: true,
        enableChat: true,
        dailyFreeMessages: 20,
        vipDailyMessages: 100
      }
    }),

    update: adminProcedure
      .input(z.record(z.unknown()))
      .mutation(async ({ input }) => {
        // In production, save to database
        console.log('Settings updated:', input)
        return { success: true }
      })
  })
})
