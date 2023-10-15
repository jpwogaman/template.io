import { router } from '@/server/trpc/trpc'
import { authRouter } from '@/server/trpc/router/auth'
import { ItemsRouter } from '@/server/trpc/router/items'

export const appRouter = router({
  auth: authRouter,
  items: ItemsRouter
})

// export type definition of API
export type AppRouter = typeof appRouter
