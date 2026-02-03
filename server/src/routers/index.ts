import { router } from '../trpc.js'
import { authRouter } from './auth.js'
import { characterRouter } from './character.js'
import { chatRouter } from './chat.js'
import { momentRouter } from './moment.js'
import { walletRouter } from './wallet.js'
import { giftRouter } from './gift.js'
import { adminRouter } from './admin.js'

export const appRouter = router({
  auth: authRouter,
  character: characterRouter,
  chat: chatRouter,
  moment: momentRouter,
  wallet: walletRouter,
  gift: giftRouter,
  admin: adminRouter
})

export type AppRouter = typeof appRouter
