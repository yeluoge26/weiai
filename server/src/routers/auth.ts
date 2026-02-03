import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { router, publicProcedure, protectedProcedure } from '../trpc.js'
import { db } from '../db/schema.js'
import { signToken } from '../utils/jwt.js'

export const authRouter = router({
  // User login with phone
  login: publicProcedure
    .input(z.object({
      phone: z.string().length(11),
      code: z.string().length(6).optional()
    }))
    .mutation(async ({ input }) => {
      // For demo, accept any 6-digit code or skip verification
      let user = db.prepare('SELECT * FROM users WHERE phone = ?').get(input.phone) as any

      if (!user) {
        // Auto register
        const result = db.prepare(`
          INSERT INTO users (phone, nickname, avatar, coins)
          VALUES (?, ?, ?, ?)
        `).run(input.phone, `用户${input.phone.slice(-4)}`, '/avatars/default.png', 100)

        user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid)
      }

      if (user.status === 'banned') {
        throw new Error('账号已被封禁')
      }

      const token = signToken({ id: user.id, type: 'user' })

      return {
        token,
        user: {
          id: user.id,
          phone: user.phone,
          nickname: user.nickname,
          avatar: user.avatar,
          gender: user.gender,
          coins: user.coins,
          vipLevel: user.vip_level
        }
      }
    }),

  // Get current user profile
  profile: protectedProcedure.query(async ({ ctx }) => {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(ctx.user.id) as any
    if (!user) {
      throw new Error('用户不存在')
    }
    return {
      id: user.id,
      phone: user.phone,
      nickname: user.nickname,
      avatar: user.avatar,
      gender: user.gender,
      birthday: user.birthday,
      bio: user.bio,
      coins: user.coins,
      vipLevel: user.vip_level,
      vipExpireAt: user.vip_expire_at
    }
  }),

  // Update profile
  updateProfile: protectedProcedure
    .input(z.object({
      nickname: z.string().min(1).max(20).optional(),
      avatar: z.string().optional(),
      gender: z.enum(['male', 'female', 'unknown']).optional(),
      birthday: z.string().optional(),
      bio: z.string().max(200).optional()
    }))
    .mutation(async ({ ctx, input }) => {
      const updates: string[] = []
      const values: any[] = []

      if (input.nickname) {
        updates.push('nickname = ?')
        values.push(input.nickname)
      }
      if (input.avatar) {
        updates.push('avatar = ?')
        values.push(input.avatar)
      }
      if (input.gender) {
        updates.push('gender = ?')
        values.push(input.gender)
      }
      if (input.birthday) {
        updates.push('birthday = ?')
        values.push(input.birthday)
      }
      if (input.bio !== undefined) {
        updates.push('bio = ?')
        values.push(input.bio)
      }

      if (updates.length > 0) {
        updates.push('updated_at = datetime("now")')
        values.push(ctx.user.id)
        db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...values)
      }

      return { success: true }
    })
})
