import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from '../trpc.js'
import { db } from '../db/schema.js'

export const momentRouter = router({
  // List moments
  list: publicProcedure
    .input(z.object({
      page: z.number().default(1),
      pageSize: z.number().default(20),
      characterId: z.number().optional()
    }))
    .query(async ({ input, ctx }) => {
      const { page, pageSize, characterId } = input
      const offset = (page - 1) * pageSize

      let where = "WHERE m.status = 'active'"
      const params: any[] = []

      if (characterId) {
        where += ' AND m.character_id = ?'
        params.push(characterId)
      }

      const total = db.prepare(`SELECT COUNT(*) as count FROM moments m ${where}`).get(...params) as any

      const moments = db.prepare(`
        SELECT m.*, c.name as character_name, c.avatar as character_avatar
        FROM moments m
        JOIN characters c ON m.character_id = c.id
        ${where}
        ORDER BY m.created_at DESC
        LIMIT ? OFFSET ?
      `).all(...params, pageSize, offset) as any[]

      // Get user's likes if logged in
      const userId = ctx.user?.id
      let likedMomentIds: number[] = []

      if (userId) {
        const likes = db.prepare(
          'SELECT moment_id FROM moment_likes WHERE user_id = ?'
        ).all(userId) as any[]
        likedMomentIds = likes.map(l => l.moment_id)
      }

      return {
        items: moments.map(m => ({
          id: m.id,
          characterId: m.character_id,
          characterName: m.character_name,
          characterAvatar: m.character_avatar,
          content: m.content,
          images: m.images ? m.images.split(',') : [],
          likeCount: m.like_count,
          commentCount: m.comment_count,
          isLiked: likedMomentIds.includes(m.id),
          createdAt: m.created_at
        })),
        total: total.count,
        page,
        pageSize
      }
    }),

  // Get moment detail
  detail: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const moment = db.prepare(`
        SELECT m.*, c.name as character_name, c.avatar as character_avatar
        FROM moments m
        JOIN characters c ON m.character_id = c.id
        WHERE m.id = ?
      `).get(input.id) as any

      if (!moment) {
        throw new Error('动态不存在')
      }

      // Check if liked
      let isLiked = false
      if (ctx.user?.id) {
        const like = db.prepare(
          'SELECT * FROM moment_likes WHERE moment_id = ? AND user_id = ?'
        ).get(input.id, ctx.user.id)
        isLiked = !!like
      }

      // Get comments
      const comments = db.prepare(`
        SELECT mc.*, u.nickname, u.avatar
        FROM moment_comments mc
        JOIN users u ON mc.user_id = u.id
        WHERE mc.moment_id = ?
        ORDER BY mc.created_at DESC
        LIMIT 50
      `).all(input.id) as any[]

      return {
        id: moment.id,
        characterId: moment.character_id,
        characterName: moment.character_name,
        characterAvatar: moment.character_avatar,
        content: moment.content,
        images: moment.images ? moment.images.split(',') : [],
        likeCount: moment.like_count,
        commentCount: moment.comment_count,
        isLiked,
        createdAt: moment.created_at,
        comments: comments.map(c => ({
          id: c.id,
          userId: c.user_id,
          nickname: c.nickname,
          avatar: c.avatar,
          content: c.content,
          createdAt: c.created_at
        }))
      }
    }),

  // Like/unlike moment
  toggleLike: protectedProcedure
    .input(z.object({ momentId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const existing = db.prepare(
        'SELECT * FROM moment_likes WHERE moment_id = ? AND user_id = ?'
      ).get(input.momentId, ctx.user.id)

      if (existing) {
        db.prepare('DELETE FROM moment_likes WHERE moment_id = ? AND user_id = ?')
          .run(input.momentId, ctx.user.id)
        db.prepare('UPDATE moments SET like_count = like_count - 1 WHERE id = ?')
          .run(input.momentId)
        return { liked: false }
      } else {
        db.prepare('INSERT INTO moment_likes (moment_id, user_id) VALUES (?, ?)')
          .run(input.momentId, ctx.user.id)
        db.prepare('UPDATE moments SET like_count = like_count + 1 WHERE id = ?')
          .run(input.momentId)
        return { liked: true }
      }
    }),

  // Add comment
  comment: protectedProcedure
    .input(z.object({
      momentId: z.number(),
      content: z.string().min(1).max(500)
    }))
    .mutation(async ({ ctx, input }) => {
      const result = db.prepare(`
        INSERT INTO moment_comments (moment_id, user_id, content)
        VALUES (?, ?, ?)
      `).run(input.momentId, ctx.user.id, input.content)

      db.prepare('UPDATE moments SET comment_count = comment_count + 1 WHERE id = ?')
        .run(input.momentId)

      const user = db.prepare('SELECT nickname, avatar FROM users WHERE id = ?').get(ctx.user.id) as any

      return {
        id: Number(result.lastInsertRowid),
        userId: ctx.user.id,
        nickname: user.nickname,
        avatar: user.avatar,
        content: input.content,
        createdAt: new Date().toISOString()
      }
    })
})
