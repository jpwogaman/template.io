import { router } from '@/server/trpc/trpc'
import { authRouter } from '@/server/trpc/router/auth'
import { ItemsRouter } from '@/server/trpc/router/items'
import { TauriMenuEvents } from '@/server/trpc/router/tauriMenuEvent'

export const appRouter = router({
  auth: authRouter,
  items: ItemsRouter,
  tauriMenuEvents: TauriMenuEvents
})

// export type definition of API
export type AppRouter = typeof appRouter