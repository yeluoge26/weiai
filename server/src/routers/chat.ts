import { z } from 'zod'
import { router, protectedProcedure } from '../trpc.js'
import { db } from '../db/schema.js'

export const chatRouter = router({
  // Get chat sessions list
  sessions: protectedProcedure
    .input(z.object({
      page: z.number().default(1),
      pageSize: z.number().default(20)
    }))
    .query(async ({ ctx, input }) => {
      const { page, pageSize } = input
      const offset = (page - 1) * pageSize

      const sessions = db.prepare(`
        SELECT s.*, c.name, c.avatar
        FROM chat_sessions s
        JOIN characters c ON s.character_id = c.id
        WHERE s.user_id = ?
        ORDER BY s.is_pinned DESC, s.last_message_at DESC
        LIMIT ? OFFSET ?
      `).all(ctx.user.id, pageSize, offset) as any[]

      const total = db.prepare(
        'SELECT COUNT(*) as count FROM chat_sessions WHERE user_id = ?'
      ).get(ctx.user.id) as any

      return {
        items: sessions.map(s => ({
          id: s.id,
          characterId: s.character_id,
          characterName: s.name,
          characterAvatar: s.avatar,
          lastMessage: s.last_message,
          lastMessageAt: s.last_message_at,
          unreadCount: s.unread_count,
          isPinned: !!s.is_pinned
        })),
        total: total.count
      }
    }),

  // Get or create chat session
  getSession: protectedProcedure
    .input(z.object({ characterId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      let session = db.prepare(`
        SELECT * FROM chat_sessions
        WHERE user_id = ? AND character_id = ?
      `).get(ctx.user.id, input.characterId) as any

      if (!session) {
        // Get character greeting
        const character = db.prepare('SELECT * FROM characters WHERE id = ?').get(input.characterId) as any
        if (!character) {
          throw new Error('角色不存在')
        }

        // Create session
        const result = db.prepare(`
          INSERT INTO chat_sessions (user_id, character_id, last_message, last_message_at)
          VALUES (?, ?, ?, datetime('now'))
        `).run(ctx.user.id, input.characterId, character.greeting)

        // Add greeting message
        db.prepare(`
          INSERT INTO chat_messages (session_id, role, content)
          VALUES (?, 'assistant', ?)
        `).run(result.lastInsertRowid, character.greeting)

        // Update character chat count
        db.prepare('UPDATE characters SET chat_count = chat_count + 1 WHERE id = ?').run(input.characterId)

        session = db.prepare('SELECT * FROM chat_sessions WHERE id = ?').get(result.lastInsertRowid)
      }

      // Mark as read
      db.prepare('UPDATE chat_sessions SET unread_count = 0 WHERE id = ?').run(session.id)

      return { sessionId: session.id }
    }),

  // Get chat messages
  messages: protectedProcedure
    .input(z.object({
      sessionId: z.number(),
      page: z.number().default(1),
      pageSize: z.number().default(50)
    }))
    .query(async ({ ctx, input }) => {
      // Verify session belongs to user
      const session = db.prepare(
        'SELECT * FROM chat_sessions WHERE id = ? AND user_id = ?'
      ).get(input.sessionId, ctx.user.id)

      if (!session) {
        throw new Error('会话不存在')
      }

      const offset = (input.page - 1) * input.pageSize

      const messages = db.prepare(`
        SELECT * FROM chat_messages
        WHERE session_id = ?
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `).all(input.sessionId, input.pageSize, offset) as any[]

      return {
        items: messages.reverse().map(m => ({
          id: m.id,
          role: m.role,
          content: m.content,
          contentType: m.content_type,
          createdAt: m.created_at
        }))
      }
    }),

  // Send message
  send: protectedProcedure
    .input(z.object({
      sessionId: z.number(),
      content: z.string().min(1).max(2000)
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify session belongs to user
      const session = db.prepare(`
        SELECT s.*, c.name, c.personality, c.greeting
        FROM chat_sessions s
        JOIN characters c ON s.character_id = c.id
        WHERE s.id = ? AND s.user_id = ?
      `).get(input.sessionId, ctx.user.id) as any

      if (!session) {
        throw new Error('会话不存在')
      }

      // Save user message
      const userMsg = db.prepare(`
        INSERT INTO chat_messages (session_id, role, content)
        VALUES (?, 'user', ?)
      `).run(input.sessionId, input.content)

      // Generate AI reply (simple demo response)
      const aiReply = generateReply(session.name, session.personality, input.content)

      // Save AI message
      const aiMsg = db.prepare(`
        INSERT INTO chat_messages (session_id, role, content)
        VALUES (?, 'assistant', ?)
      `).run(input.sessionId, aiReply)

      // Update session
      db.prepare(`
        UPDATE chat_sessions
        SET last_message = ?, last_message_at = datetime('now')
        WHERE id = ?
      `).run(aiReply, input.sessionId)

      return {
        userMessage: {
          id: Number(userMsg.lastInsertRowid),
          role: 'user',
          content: input.content,
          createdAt: new Date().toISOString()
        },
        aiMessage: {
          id: Number(aiMsg.lastInsertRowid),
          role: 'assistant',
          content: aiReply,
          createdAt: new Date().toISOString()
        }
      }
    }),

  // Pin/unpin session
  togglePin: protectedProcedure
    .input(z.object({ sessionId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const session = db.prepare(
        'SELECT * FROM chat_sessions WHERE id = ? AND user_id = ?'
      ).get(input.sessionId, ctx.user.id) as any

      if (!session) {
        throw new Error('会话不存在')
      }

      db.prepare('UPDATE chat_sessions SET is_pinned = ? WHERE id = ?')
        .run(session.is_pinned ? 0 : 1, input.sessionId)

      return { isPinned: !session.is_pinned }
    }),

  // Delete session
  deleteSession: protectedProcedure
    .input(z.object({ sessionId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      db.prepare('DELETE FROM chat_messages WHERE session_id IN (SELECT id FROM chat_sessions WHERE id = ? AND user_id = ?)').run(input.sessionId, ctx.user.id)
      db.prepare('DELETE FROM chat_sessions WHERE id = ? AND user_id = ?').run(input.sessionId, ctx.user.id)
      return { success: true }
    })
})

// Simple reply generator (in production, use real AI API)
function generateReply(name: string, personality: string, userMessage: string): string {
  const replies: Record<string, string[]> = {
    default: [
      `嗯嗯，我明白你的意思～`,
      `哈哈，你说的真有趣！`,
      `是这样吗？跟我说说更多吧～`,
      `我也是这么想的呢！`,
      `嘿嘿，被你发现了～`
    ],
    greeting: [
      `你好呀！今天过得怎么样？`,
      `嗨～终于等到你了！`,
      `见到你真开心！`
    ],
    question: [
      `这个问题很有趣呢，让我想想...`,
      `嗯...我觉得应该是这样的...`,
      `你怎么会想到这个问题呢？好有意思！`
    ]
  }

  // Detect message type
  let type = 'default'
  if (userMessage.match(/你好|嗨|hi|hello/i)) {
    type = 'greeting'
  } else if (userMessage.includes('?') || userMessage.includes('？') || userMessage.match(/什么|怎么|为什么|吗/)) {
    type = 'question'
  }

  const options = replies[type]
  const reply = options[Math.floor(Math.random() * options.length)]

  // Add some personality flavor
  if (personality?.includes('温柔')) {
    return reply + ' 💕'
  } else if (personality?.includes('活泼')) {
    return reply + ' 😄'
  } else if (personality?.includes('高冷')) {
    return reply.replace(/～|！/g, '。')
  }

  return reply
}
