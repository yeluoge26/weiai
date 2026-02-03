import { initTRPC, TRPCError } from '@trpc/server'
import type { Request } from 'express'
import { verifyToken, type TokenPayload } from './utils/jwt.js'

export interface Context {
  req: Request
  user: TokenPayload | null
}

export function createContext({ req }: { req: Request }): Context {
  const authHeader = req.headers.authorization
  let user: TokenPayload | null = null

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7)
    user = verifyToken(token)
  }

  return { req, user }
}

const t = initTRPC.context<Context>().create()

export const router = t.router
export const publicProcedure = t.procedure

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: '请先登录' })
  }
  return next({ ctx: { ...ctx, user: ctx.user } })
})

export const adminProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user || ctx.user.type !== 'admin') {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: '需要管理员权限' })
  }
  return next({ ctx: { ...ctx, user: ctx.user } })
})
